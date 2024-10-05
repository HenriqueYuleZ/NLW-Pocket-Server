import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { loginUser, getUsers } from '../../functions/get-users';
import { z } from 'zod';

export const getAllUsers: FastifyPluginAsyncZod = async (app) => {
    app.get('/users', async () => {
        const { allUsers } = await getUsers()

        return { allUsers }
    })
};

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const login: FastifyPluginAsyncZod = async (app) => {
    app.post('/login', {
        schema: {
            body: loginSchema,  // Usa o Zod schema para validação
        },
    }, async (request, reply) => {
        const { username, password } = request.body as { username: string; password: string };

        try {
            const { user, token } = await loginUser({ username, password });
            return reply.send({ message: "Login bem-sucedido", user, token });
        } catch (error) {
            return reply.status(401).send({ error: (error as Error).message });
        }
    });
};