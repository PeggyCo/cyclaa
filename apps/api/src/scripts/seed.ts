/**
 * Lightweight seed runner — same rationale as scripts/migrate.ts: this is
 * an ESM + TypeScript project, so sequelize-cli's seeders (loaded with
 * CommonJS `require()`) can't run directly. This connects with the same
 * raw Sequelize setup as the migration runner and inserts baseline data
 * that both mobile apps assume exists (the service catalog used by the
 * booking flow).
 *
 * Usage:
 *   tsx src/scripts/seed.ts
 *
 * Safe to re-run — upserts by slug, so it won't create duplicates.
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const SERVICE_TYPES = [
  {
    name: 'Basic tune-up',
    slug: 'basic-tune-up',
    description: 'Gear and brake adjustment, chain lube, tire pressure check, general safety inspection.',
    iconName: 'wrench',
    category: 'maintenance',
    basePriceMin: 45,
    basePriceMax: 65,
    estimatedDurationMinutes: 45,
    skillLevelRequired: 'basic',
    requiresParts: false,
  },
  {
    name: 'Flat tire fix',
    slug: 'flat-tire-fix',
    description: 'Tube replacement or patch, tire inspection for the cause of the flat.',
    iconName: 'tire',
    category: 'repair',
    basePriceMin: 25,
    basePriceMax: 40,
    estimatedDurationMinutes: 20,
    skillLevelRequired: 'basic',
    requiresParts: true,
  },
  {
    name: 'Brake adjustment',
    slug: 'brake-adjustment',
    description: 'Cable tension, pad alignment, and lever feel dialed in for rim or disc brakes.',
    iconName: 'hand-palm',
    category: 'maintenance',
    basePriceMin: 30,
    basePriceMax: 50,
    estimatedDurationMinutes: 30,
    skillLevelRequired: 'basic',
    requiresParts: false,
  },
  {
    name: 'Full overhaul',
    slug: 'full-overhaul',
    description: 'Complete strip-down service: drivetrain deep clean, bearings, cables, full safety check.',
    iconName: 'gear-six',
    category: 'maintenance',
    basePriceMin: 120,
    basePriceMax: 180,
    estimatedDurationMinutes: 120,
    skillLevelRequired: 'advanced',
    requiresParts: true,
  },
  {
    name: 'Wheel truing',
    slug: 'wheel-truing',
    description: 'Spoke tension adjustment to straighten a wobbling wheel.',
    iconName: 'circle-dashed',
    category: 'repair',
    basePriceMin: 25,
    basePriceMax: 45,
    estimatedDurationMinutes: 30,
    skillLevelRequired: 'intermediate',
    requiresParts: false,
  },
  {
    name: 'E-bike diagnostic',
    slug: 'e-bike-diagnostic',
    description: 'Battery, motor, and controller check for e-bikes with performance or error issues.',
    iconName: 'lightning',
    category: 'e-bike',
    basePriceMin: 50,
    basePriceMax: 90,
    estimatedDurationMinutes: 40,
    skillLevelRequired: 'advanced',
    requiresParts: false,
  },
];

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

async function seedServiceTypes(sequelize: Sequelize) {
  for (const service of SERVICE_TYPES) {
    const [existing] = await sequelize.query('SELECT id FROM "ServiceTypes" WHERE slug = :slug', {
      replacements: { slug: service.slug },
    });

    if ((existing as any[]).length > 0) {
      console.log(`Skipping "${service.name}" (already seeded)`);
      continue;
    }

    await sequelize.query(
      `INSERT INTO "ServiceTypes"
        (id, name, slug, description, "iconName", category, "basePriceMin", "basePriceMax",
         "estimatedDurationMinutes", "skillLevelRequired", "requiresParts", "isActive",
         "createdAt", "updatedAt")
       VALUES
        (:id, :name, :slug, :description, :iconName, :category, :basePriceMin, :basePriceMax,
         :estimatedDurationMinutes, :skillLevelRequired, :requiresParts, true,
         NOW(), NOW())`,
      {
        replacements: {
          id: uuidv4(),
          ...service,
        },
      }
    );
    console.log(`Seeded "${service.name}"`);
  }
}

(async () => {
  const sequelize = await getSequelize();
  try {
    await seedServiceTypes(sequelize);
    console.log('Seed complete.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
})();
