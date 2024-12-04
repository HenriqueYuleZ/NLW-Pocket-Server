import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { JwtPayload } from 'jsonwebtoken';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import jwt from 'jsonwebtoken';
import { env } from '../env';

const JWT_SECRET = env.JWT_SECRET;

export const authenticateToken: FastifyPluginAsync = async (app) => {
    app.addHook('preHandler', async (request, reply) => {
        try {
            const authHeader = request.headers.authorization;
            const token = authHeader?.split(' ')[1]; // Token no formato "Bearer <token>"

            if (!token) {
                return reply.status(401).send({ error: "Token não fornecido" });
            }

            // Verificar o token JWT
            const user = jwt.verify(token, JWT_SECRET);

            // Adicionar os dados do usuário à requisição
            request.user = user;

        } catch (error) {
            return reply.status(403).send({ error: "Token inválido" });
        }
    });
};