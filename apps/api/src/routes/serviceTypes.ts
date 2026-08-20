/**
 * Service Type Routes
 * Public catalog used by the booking flow's "what do you need?" step.
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ServiceTypeController } from '@controllers/serviceTypeController';

export async function serviceTypeRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const types = await ServiceTypeController.list();
      return reply.send({ success: true, data: types });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({ success: false, error: 'Failed to fetch service types' });
    }
  });
}
