/**
 * Logger configuration
 * Using pino for structured logging
 */

import pino from 'pino';
import { config } from '@config/env';

const logger = pino({
  level: config.logLevel,
  transport:
    config.nodeEnv === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

export { logger };
