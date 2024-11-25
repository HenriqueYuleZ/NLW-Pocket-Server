import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from 'zod';
import { deleteGoal } from '../../functions/delete-goal';

export const deleteGoalRoute: FastifyPluginAsyncZod = async (app) => {
    app.delete('/goals/:id', {
        schema: {
            params: z.object({
                id: z.string()
            }),
            body: z.object({
                userId: z.string()
            })
        }
    }, async request => {
        const { id } = request.params
        const { userId } = request.body
        await deleteGoal(id, userId)
    })
}