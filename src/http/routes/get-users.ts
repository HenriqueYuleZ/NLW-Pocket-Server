import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getUsers } from '../../functions/get-users';

export const getAllUsers: FastifyPluginAsyncZod = async (app) => {
    app.get('/users', async () => {
        const { allUsers } = await getUsers()

        return { allUsers }
    })
};