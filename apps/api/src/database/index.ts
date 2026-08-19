/**
 * Sequelize database initialization and connection pool
 * Central place for all database operations
 */

import { Sequelize } from 'sequelize';
import { config } from '@config/env';
import { logger } from '@utils/logger';

let sequelize: Sequelize;

/**
 * Initialize database connection
 */
export async function initializeDatabase() {
  try {
    const dbConfig = {
      username: process.env.DB_USER || 'velo',
      password: process.env.DB_PASSWORD || 'velo',
      database: process.env.DB_NAME || 'velo_dev',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      dialect: 'postgres' as const,
      dialectOptions: {
        ssl: config.database.ssl ? { rejectUnauthorized: false } : undefined,
      },
      logging: config.nodeEnv === 'development' ? logger.debug.bind(logger) : false,
      pool: {
        max: 20,
        min: 5,
        idle: 10000,
      },
    };

    sequelize = new Sequelize(dbConfig);

    // Test connection
    await sequelize.authenticate();
    logger.info('Database connection established');

    // Sync models (for development only - use migrations in production)
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: false }); // Never use alter: true in production
      logger.info('Database models synchronized');
    }

    return sequelize;
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Get database instance
 */
export function getDatabase(): Sequelize {
  if (!sequelize) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return sequelize;
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  if (sequelize) {
    await sequelize.close();
    logger.info('Database connection closed');
  }
}
