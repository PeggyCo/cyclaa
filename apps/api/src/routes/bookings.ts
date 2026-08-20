/**
 * Booking Routes
 * Create/list/respond-to bookings. Every route requires auth; the current
 * user's id and role come off the JWT payload set at login (`@routes/auth`).
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { BookingController } from '@controllers/bookingController';
import { UserRole } from '@models/User';

function currentRole(request: FastifyRequest): 'rider' | 'mechanic' {
  const { role } = request.user as { role: UserRole };
  return role === UserRole.MECHANIC ? 'mechanic' : 'rider';
}

export async function bookingRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  // GET /bookings - bookings for the current user (rider sees their
  // requests, mechanic sees jobs assigned to them)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.user as { id: string };
      const bookings = await BookingController.listForUser(id, currentRole(request));
      return reply.send({ success: true, data: bookings });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({ success: false, error: 'Failed to fetch bookings' });
    }
  });

  // POST /bookings - rider requests a service (optionally targeting a
  // specific mechanic found via GET /mechanics)
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['serviceTypeId', 'address'],
          properties: {
            mechanicId: { type: 'string' },
            serviceTypeId: { type: 'string' },
            description: { type: 'string' },
            address: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        if (currentRole(request) !== 'rider') {
          return reply.status(403).send({ success: false, error: 'Only riders can request bookings' });
        }

        const { id } = request.user as { id: string };
        const booking = await BookingController.create({ ...(request.body as any), riderId: id });

        return reply.status(201).send({ success: true, data: booking });
      } catch (error: any) {
        if (error.message === 'INVALID_SERVICE_TYPE') {
          return reply.status(400).send({ success: false, error: 'Unknown service type' });
        }

        fastify.log.error(error);
        return reply.status(500).send({ success: false, error: 'Failed to create booking' });
      }
    }
  );

  // GET /bookings/:id
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = request.user as { id: string };
      const { id } = request.params as any;
      const booking = await BookingController.getById(id, userId);

      return reply.send({ success: true, data: booking });
    } catch (error: any) {
      if (error.message === 'NOT_FOUND') {
        return reply.status(404).send({ success: false, error: 'Booking not found' });
      }
      if (error.message === 'FORBIDDEN') {
        return reply.status(403).send({ success: false, error: 'Not your booking' });
      }

      fastify.log.error(error);
      return reply.status(500).send({ success: false, error: 'Failed to fetch booking' });
    }
  });

  // PATCH /bookings/:id/status - { action: 'accept' | 'decline' | 'cancel' | 'start' | 'complete' }
  fastify.patch(
    '/:id/status',
    {
      schema: {
        body: {
          type: 'object',
          required: ['action'],
          properties: {
            action: { type: 'string', enum: ['accept', 'decline', 'cancel', 'start', 'complete'] },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id: userId } = request.user as { id: string };
        const { id } = request.params as any;
        const { action } = request.body as any;

        const booking = await BookingController.updateStatus(id, userId, currentRole(request), action);

        return reply.send({ success: true, data: booking });
      } catch (error: any) {
        if (error.message === 'NOT_FOUND') {
          return reply.status(404).send({ success: false, error: 'Booking not found' });
        }
        if (error.message === 'FORBIDDEN') {
          return reply.status(403).send({ success: false, error: 'Not your booking' });
        }
        if (error.message === 'INVALID_ACTION') {
          return reply.status(400).send({ success: false, error: 'That action is not allowed for this booking' });
        }

        fastify.log.error(error);
        return reply.status(500).send({ success: false, error: 'Failed to update booking' });
      }
    }
  );
}
