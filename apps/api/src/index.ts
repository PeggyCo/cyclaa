/**
 * Cyclaa API - Main Entry Point
 * Fastify server with Socket.io, Redis, PostgreSQL, and Stripe integration
 */

import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import { config } from '@config/env';
import { logger } from '@utils/logger';

// Routes
import { waitlistRoutes } from '@routes/waitlist';
// TODO: Import other routes when created
// import authRoutes from '@routes/auth';
// import userRoutes from '@routes/users';
// import bookingRoutes from '@routes/bookings';

// TODO: Socket.io integration for real-time features (bookings, GPS tracking, chat)

async function start() {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(fastifyCors, {
    origin: config.cors.origin,
    credentials: true,
  });

  await fastify.register(fastifyJwt, {
    secret: config.jwt.secret,
    sign: { expiresIn: config.jwt.expirySeconds },
  });

  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Register routes
  await fastify.register(waitlistRoutes, { prefix: '/api' });
  // TODO: Register other routes
  // await fastify.register(authRoutes, { prefix: '/auth' });
  // await fastify.register(userRoutes, { prefix: '/users' });
  // await fastify.register(bookingRoutes, { prefix: '/bookings' });

  // Error handling
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.code(error.statusCode || 500).send({
      error: error.message || 'Internal server error',
      statusCode: error.statusCode || 500,
    });
  });

  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    fastify.log.info(`Server running at http://localhost:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
