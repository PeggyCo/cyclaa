/**
 * Mechanic Routes
 * Rider-facing search and profile lookup.
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { MechanicController } from '@controllers/mechanicController';

export async function mechanicRoutes(fastify: FastifyInstance) {
  // GET /mechanics?specialty=road&lat=..&lng=..
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: {
          type: 'object',
          properties: {
            specialty: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { specialty, lat, lng } = request.query as any;
        const mechanics = await MechanicController.search({
          specialty,
          lat: lat != null ? Number(lat) : undefined,
          lng: lng != null ? Number(lng) : undefined,
        });

        return reply.send({ success: true, data: mechanics });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({ success: false, error: 'Failed to search mechanics' });
      }
    }
  );

  // GET /mechanics/:userId
  fastify.get(
    '/:userId',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { userId } = request.params as any;
        const mechanic = await MechanicController.getByUserId(userId);

        return reply.send({ success: true, data: mechanic });
      } catch (error: any) {
        if (error.message === 'NOT_FOUND') {
          return reply.status(404).send({ success: false, error: 'Mechanic not found' });
        }

        fastify.log.error(error);
        return reply.status(500).send({ success: false, error: 'Failed to fetch mechanic' });
      }
    }
  );
}
