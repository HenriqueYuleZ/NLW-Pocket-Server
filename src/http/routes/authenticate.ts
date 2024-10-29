import type { FastifyPluginAsync } from "fastify";
import jwt from 'jsonwebtoken';
import { authenticateToken } from "../../functions/authenticate";

export const protectedRoute: FastifyPluginAsync = async (app) => {
    // Aplicar o middleware de autenticação
    await authenticateToken(app, { /* options object */ });

    // Definir a rota protegida
    app.get('/protected', async (request) => {
        return {
            message: "Você acessou uma rota protegida!",
            user: request.user,
        };
    });
};