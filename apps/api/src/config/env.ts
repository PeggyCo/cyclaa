/**
 * Environment configuration
 * Validates and exports all environment variables
 */

import dotenv from 'dotenv';

dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  logLevel: string;
  database: {
    url: string;
    ssl: boolean;
  };
  redis: {
    url: string;
  };
  meilisearch: {
    url: string;
    apiKey: string;
  };
  jwt: {
    secret: string;
    expirySeconds: number;
  };
  aws: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    s3Bucket: string;
  };
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };
  externalApis: {
    strava: {
      clientId: string;
      clientSecret: string;
    };
    googlePlaces: {
      apiKey: string;
    };
    mapbox: {
      apiKey: string;
    };
  };
  notifications: {
    oneSignal: {
      appId: string;
      restApiKey: string;
    };
    resend: {
      apiKey: string;
      fromEmail: string;
    };
    twilio: {
      accountSid: string;
      authToken: string;
      phoneNumber: string;
    };
  };
  cors: {
    origin: string[];
  };
}

function parseJwtExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60; // default 7 days

  const [, value, unit] = match;
  const numValue = parseInt(value, 10);

  switch (unit) {
    case 'd':
      return numValue * 24 * 60 * 60;
    case 'h':
      return numValue * 60 * 60;
    case 'm':
      return numValue * 60;
    case 's':
      return numValue;
    default:
      return 7 * 24 * 60 * 60;
  }
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  database: {
    url: process.env.DATABASE_URL || '',
    ssl: process.env.DATABASE_SSL === 'true',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  meilisearch: {
    url: process.env.MEILISEARCH_URL || 'http://localhost:7700',
    apiKey: process.env.MEILISEARCH_API_KEY || 'masterKey',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    expirySeconds: parseJwtExpiry(process.env.JWT_EXPIRY || '7d'),
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    s3Bucket: process.env.AWS_S3_BUCKET || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  externalApis: {
    strava: {
      clientId: process.env.STRAVA_CLIENT_ID || '',
      clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
    },
    googlePlaces: {
      apiKey: process.env.GOOGLE_PLACES_API_KEY || '',
    },
    mapbox: {
      apiKey: process.env.MAPBOX_API_KEY || '',
    },
  },
  notifications: {
    oneSignal: {
      appId: process.env.ONESIGNAL_APP_ID || '',
      restApiKey: process.env.ONESIGNAL_REST_API_KEY || '',
    },
    resend: {
      apiKey: process.env.RESEND_API_KEY || '',
      fromEmail: process.env.FROM_EMAIL || 'noreply@velo.com',
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    },
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:8081').split(','),
  },
};

export { config };
