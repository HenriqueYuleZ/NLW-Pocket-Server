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
    }, async request => {
        const { username, password } = request.body
        await createUser({
            username,
            password
        })
    })
};