import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

interface CreateUserRequest {
    username: string;
    password: string;
}

export async function createUser({ username, password }: CreateUserRequest) {

    // verificar se já possui um usuário com o mesmo username
    const userExists = await db.select().from(users).where(eq(users.username, username));

    if (userExists.length > 0) {
        throw new Error('Usuário já existe');
    }

    const bcrypt = require('bcrypt');
    // Número de rounds para gerar o salt (ajuste conforme a necessidade de segurança e desempenho)
    const saltRounds = 10;

    // Gerar o hash da senha
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Inserir o usuário com a senha hash
    const result = await db.insert(users).values({
        username,
        password: hashedPassword // Armazenar a senha criptografada
    }).returning();

    const user = result[0];

    return {
        user
    };
}