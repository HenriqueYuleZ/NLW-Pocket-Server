import { db } from "../db";
import { users } from "../db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from 'bcrypt';
import { z } from "zod";
import jwt from 'jsonwebtoken';
import { env } from '../env';

export async function getUsers() {
    const allUsers = await db.select().from(users)

    return { allUsers };
}

const loginSchema = z.object({
    username: z.string().min(1, "Username é obrigatório"),
    password: z.string().min(1, "Password é obrigatório"),
});

const JWT_SECRET = env.JWT_SECRET;

export async function loginUser({ username, password }: { username: string, password: string }) {
    // Validação com Zod
    const validation = loginSchema.safeParse({ username, password });
    if (!validation.success) {
        throw new Error("Dados inválidos");
    }

    // Consultar o banco de dados pelo username
    const result = await db.select().from(users).where(eq(users.username, username));
    const user = result[0];

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    // Comparar a senha fornecida com a armazenada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Senha incorreta");
    }

    // Gerar o token JWT após o login bem-sucedido
    const token = jwt.sign(
        { id: user.id, username: user.username },  // Payload (dados no token)
        JWT_SECRET,                                // Chave secreta para assinar o token
        { expiresIn: '1h' }                        // Expira em 1 hora
    );

    return {
        message: "Login bem-sucedido",
        token,  // Retornar o token para o frontend
        user: {
            id: user.id,
            username: user.username,
        },
    };
}