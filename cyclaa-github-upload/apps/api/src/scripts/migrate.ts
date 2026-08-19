/**
 * Lightweight migration runner.
 *
 * sequelize-cli can't be used directly in this project: it loads migration
 * files with CommonJS `require()`, but this package is `"type": "module"`
 * and migrations are TypeScript files using ESM `export async function up/down`.
 * This script runs them directly under tsx instead, tracking applied
 * migrations in a `SequelizeMeta` table (same table name sequelize-cli uses,
 * so this stays compatible if the project moves to the CLI later).
 *
 * Usage:
 *   tsx src/scripts/migrate.ts up      # run all pending migrations
 *   tsx src/scripts/migrate.ts undo    # roll back the most recent migration
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, '../migrations');

interface MigrationModule {
  up: (queryInterface: QueryInterface) => Promise<void>;
  down: (queryInterface: QueryInterface) => Promise<void>;
}

async function getSequelize(): Promise<Sequelize> {
  const sequelize = new Sequelize({
    username: process.env.DB_USER || 'velo',
    password: process.env.DB_PASSWORD || 'velo',
    database: process.env.DB_NAME || 'velo_dev',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    },
    logging: false,
  });
  await sequelize.authenticate();
  return sequelize;
}

async function ensureMetaTable(queryInterface: QueryInterface) {
  const tables = await queryInterface.showAllTables();
  if (!tables.includes('SequelizeMeta')) {
    await queryInterface.createTable('SequelizeMeta', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
    });
  }
}

function listMigrationFiles(): string[] {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.ts'))
    .sort();
}

async function getAppliedNames(sequelize: Sequelize): Promise<string[]> {
  const [rows] = await sequelize.query('SELECT name FROM "SequelizeMeta" ORDER BY name ASC');
  return (rows as Array<{ name: string }>).map((r) => r.name);
}

async function runUp() {
  const sequelize = await getSequelize();
  const queryInterface = sequelize.getQueryInterface();
  await ensureMetaTable(queryInterface);

  const applied = new Set(await getAppliedNames(sequelize));
  const files = listMigrationFiles();
  const pending = files.filter((f) => !applied.has(f));

  if (pending.length === 0) {
    console.log('No pending migrations.');
    await sequelize.close();
    return;
  }

  for (const file of pending) {
    const mod = (await import(path.join(MIGRATIONS_DIR, file))) as MigrationModule;
    console.log(`Applying ${file}...`);
    await mod.up(queryInterface);
    await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES (:name)', {
      replacements: { name: file },
    });
    console.log(`Applied ${file}`);
  }

  await sequelize.close();
}

async function runUndo() {
  const sequelize = await getSequelize();
  const queryInterface = sequelize.getQueryInterface();
  await ensureMetaTable(queryInterface);

  const applied = await getAppliedNames(sequelize);
  const last = applied[applied.length - 1];

  if (!last) {
    console.log('No migrations to undo.');
    await sequelize.close();
    return;
  }

  const mod = (await import(path.join(MIGRATIONS_DIR, last))) as MigrationModule;
  console.log(`Reverting ${last}...`);
  await mod.down(queryInterface);
  await sequelize.query('DELETE FROM "SequelizeMeta" WHERE name = :name', {
    replacements: { name: last },
  });
  console.log(`Reverted ${last}`);

  await sequelize.close();
}

const command = process.argv[2] || 'up';

(async () => {
  try {
    if (command === 'up') {
      await runUp();
    } else if (command === 'undo') {
      await runUndo();
    } else {
      console.error(`Unknown command: ${command}. Use "up" or "undo".`);
      process.exit(1);
    }
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();
