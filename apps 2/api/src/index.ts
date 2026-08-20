/**
 * Cyclaa API - Main Entry Point
 * Fastify server with Socket.io, Redis, PostgreSQL, and Stripe integration
 */

import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import { config } from '@config/env';
import { logger } from '@utils/logger';
import { initializeDatabase } from './database/index';
import authPlugin from '@middleware/auth';

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

  await fastify.register(fastifyRateLimit, {
    global: false, // opt-in per route
  });

  await fastify.register(authPlugin);

  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Initialize the database connection BEFORE importing anything that touches
  // models. Model files call getDatabase() at module load time, so importing
  // them (even transitively, via routes/controllers) before the connection
  // exists throws "Database not initialized".
  await initializeDatabase();

  // Import the model index once, up front, purely for its side effect:
  // it's the only place associations (User.hasMany(Booking), etc) are
  // declared. Controllers import individual model files directly
  // (@models/Booking, not @models/index), so without this those
  // associations never run and any `include: [...]` in a query throws
  // "X is not associated to Y" at request time.
  await import('@models/index');

  // Routes (dynamically imported so their model imports resolve after the DB
  // connection is ready — see note above)
  const { waitlistRoutes } = await import('@routes/waitlist');
  const { authRoutes } = await import('@routes/auth');
  const { mechanicRoutes } = await import('@routes/mechanics');
  const { bookingRoutes } = await import('@routes/bookings');
  const { serviceTypeRoutes } = await import('@routes/serviceTypes');
  // TODO: users, bikes, community, messaging routes

  // Register routes
  await fastify.register(waitlistRoutes, { prefix: '/api' });
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(mechanicRoutes, { prefix: '/api/mechanics' });
  await fastify.register(bookingRoutes, { prefix: '/api/bookings' });
  await fastify.register(serviceTypeRoutes, { prefix: '/api/service-types' });

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
