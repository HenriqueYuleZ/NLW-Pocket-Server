import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createUser } from '../../functions/create-user';


export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
    app.post('/users', {
        schema: {
            body: z.object({
                username: z.string(),
                password: z.string(),
            }),
        }
    }, async (request, reply) => {
        const { username, password } = request.body
        try {
            const response = await createUser({
                username,
                password
            })
            return reply.send(response.result[0]);
        } catch (error) {
            return reply.status(401).send({ error: (error as Error).message });
        }
    })
};