/**
 * Waitlist Routes
 * Endpoints for waitlist management
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WaitlistController } from '@controllers/waitlistController';
import { EmailService } from '@services/emailService';

export async function waitlistRoutes(fastify: FastifyInstance) {
  // POST /waitlist - Join the waitlist
  fastify.post(
    '/waitlist',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
      schema: {
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            borough: {
              type: 'string',
              enum: ['manhattan', 'brooklyn', 'queens', 'bronx', 'staten_island', 'other'],
            },
            referredBy: { type: 'string' },
            source: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { email, name, borough, referredBy, source } = request.body as any;

        const entry = await WaitlistController.joinWaitlist({
          email,
          name,
          borough,
          referredBy,
          source,
        });

        // Send confirmation email
        await EmailService.sendConfirmationEmail(
          email,
          name || null,
          entry.confirmationToken as string,
          entry.position as number,
          entry.referralCode as string
        );

        return reply.status(201).send({
          success: true,
          message: 'Successfully joined the waitlist!',
          data: {
            email: entry.email,
            position: entry.position,
            referralCode: entry.referralCode,
          },
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === 'EMAIL_ALREADY_REGISTERED') {
          return reply.status(400).send({
            success: false,
            error: 'This email is already on the waitlist',
          });
        }

        return reply.status(500).send({
          success: false,
          error: 'Failed to join waitlist',
        });
      }
    }
  );

  // GET /waitlist/confirm?token=XXX - Confirm email
  fastify.get(
    '/waitlist/confirm',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { token } = request.query as any;
        const entry = await WaitlistController.confirmEmail(token);

        return reply.send({
          success: true,
          message: 'Email confirmed!',
          data: entry,
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === 'INVALID_TOKEN') {
          return reply.status(400).send({
            success: false,
            error: 'Invalid confirmation link',
          });
        }

        if (error.message === 'ALREADY_CONFIRMED') {
          return reply.status(400).send({
            success: false,
            error: 'Email already confirmed',
          });
        }

        return reply.status(500).send({
          success: false,
          error: 'Failed to confirm email',
        });
      }
    }
  );

  // GET /waitlist/referral/:code - Get referral info
  fastify.get('/waitlist/referral/:code', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { code } = request.params as any;
      const entry = await WaitlistController.getByReferralCode(code);

      return reply.send({
        success: true,
        data: entry,
      });
    } catch (error: any) {
      if (error.message === 'NOT_FOUND') {
        return reply.status(404).send({
          success: false,
          error: 'Referral code not found',
        });
      }

      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch referral data',
      });
    }
  });

  // GET /waitlist/stats - Get waitlist statistics (public)
  fastify.get('/waitlist/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await WaitlistController.getStats();

      return reply.send({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch stats',
      });
    }
  });

  // POST /waitlist/grant-access (admin) - Grant early access
  fastify.post(
    '/waitlist/grant-access',
    {
      onRequest: [fastify.authenticate], // Require auth (admin)
      schema: {
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { email } = request.body as any;
        const entry = await WaitlistController.grantAccess(email);

        // Send access granted email
        await EmailService.sendAccessGrantedEmail(email, entry.name ?? null);

        return reply.send({
          success: true,
          message: 'Access granted!',
          data: entry,
        });
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === 'NOT_FOUND') {
          return reply.status(404).send({
            success: false,
            error: 'User not found',
          });
        }

        return reply.status(500).send({
          success: false,
          error: 'Failed to grant access',
        });
      }
    }
  );
}
