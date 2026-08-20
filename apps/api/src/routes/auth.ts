/**
 * Auth Routes
 * Registration, login, and session lookup for riders and mechanics.
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthController } from '@controllers/authController';

export async function authRoutes(fastify: FastifyInstance) {
  // POST /auth/register
  fastify.post(
    '/register',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName', 'phone'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            firstName: { type: 'string', minLength: 1 },
            lastName: { type: 'string', minLength: 1 },
            phone: { type: 'string', minLength: 7 },
            role: { type: 'string', enum: ['rider', 'mechanic'] },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { user } = await AuthController.register(request.body as any);
        const token = fastify.jwt.sign({ id: user.id, role: user.role });

        return reply.status(201).send({ success: true, data: { token, user } });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === 'EMAIL_ALREADY_REGISTERED') {
          return reply.status(400).send({ success: false, error: 'An account with this email already exists' });
        }

        return reply.status(500).send({ success: false, error: 'Failed to create account' });
      }
    }
  );

  // POST /auth/login
  fastify.post(
    '/login',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { user } = await AuthController.login(request.body as any);
        const token = fastify.jwt.sign({ id: user.id, role: user.role });

        return reply.send({ success: true, data: { token, user } });
      } catch (error: any) {
        if (error.message === 'INVALID_CREDENTIALS') {
          return reply.status(401).send({ success: false, error: 'Invalid email or password' });
        }

        if (error.message === 'ACCOUNT_SUSPENDED') {
          return reply.status(403).send({ success: false, error: 'This account has been suspended' });
        }

        fastify.log.error(error);
        return reply.status(500).send({ success: false, error: 'Failed to sign in' });
      }
    }
  );

  // GET /auth/me - current user from JWT
  fastify.get(
    '/me',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.user as { id: string };
        const user = await AuthController.getById(id);

        return reply.send({ success: true, data: { user } });
      } catch (error: any) {
        if (error.message === 'NOT_FOUND') {
          return reply.status(404).send({ success: false, error: 'User not found' });
        }

        return reply.status(500).send({ success: false, error: 'Failed to fetch user' });
      }
    }
  );
}
