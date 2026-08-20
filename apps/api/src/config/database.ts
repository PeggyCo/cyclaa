/**
 * Sequelize database configuration
 * Used by sequelize-cli for migrations
 */

import { config } from './env';

export default {
  development: {
    username: process.env.DB_USER || 'velo',
    password: process.env.DB_PASSWORD || 'velo',
    database: process.env.DB_NAME || 'velo_dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
    },
    logging: console.log,
  },
  test: {
    username: 'velo_test',
    password: 'velo_test',
    database: 'velo_test',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    logging: false,
    pool: {
      max: 20,
      min: 5,
      idle: 10000,
    },
  },
};
