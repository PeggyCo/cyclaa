/**
 * Jest setup for API tests.
 * Points at a dedicated `velo_test` Postgres database (create with
 * `createdb -O velo velo_test` locally) and rebuilds all tables from the
 * current model definitions before any test file's imports run.
 *
 * This runs its DB setup with a top-level await (not inside beforeAll):
 * setupFilesAfterEnv modules are loaded before the test file, but a
 * beforeAll registered here would only *run* right before the first test —
 * after the test file's own top-level `import`/`await import` calls have
 * already executed. Model files call getDatabase() at import time, so the
 * connection has to exist before that happens.
 */

import { initializeDatabase, getDatabase, closeDatabase } from '../database';

process.env.NODE_ENV = 'test';
process.env.DB_NAME = process.env.DB_NAME_TEST || 'velo_test';

await initializeDatabase();
await import('../models');
await getDatabase().sync({ force: true });

afterAll(async () => {
  await closeDatabase();
});
