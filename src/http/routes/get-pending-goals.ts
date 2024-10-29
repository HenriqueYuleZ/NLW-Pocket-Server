import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekPendingGoals } from '../../functions/get-week-pending-goals';
import { z } from 'zod';

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async (app) => {
    app.get('/pending-goals', {
        schema: {
            querystring: z.object({
                userId: z.string()
            })
        }
    }, async request => {
        const { userId } = request.query
        const { pendingGoals } = await getWeekPendingGoals({ userId })

        return { pendingGoals }
    })
};