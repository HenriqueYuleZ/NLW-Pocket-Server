import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekSummary } from '../../functions/get-week-summary';
import { z } from 'zod';

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
    app.get('/summary', {
        schema: {
            querystring: z.object({
                userId: z.string()
            })
        }
    }, async request => {
        const { userId } = request.query
        const { summary } = await getWeekSummary({ userId })

        return { summary }
    })
};