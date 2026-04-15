import { prisma } from '../lib/prisma.js';

export const login = async (email: string, password: string) => {
    // Procura o utilizador pelo email
    const user = await prisma.user.findUnique({
        where: { email }
    });

    // Se não existir, erro
    if (!user) {
        throw new Error('Credenciais inválidas');
    }

    // Comparação simples de password (sem hash, é aldrabado)
    if (user.password !== password) {
        throw new Error('Credenciais inválidas');
    }

    // Devolve o user sem a password e um token falso
    const { password: _, ...userWithoutPassword } = user;
    
    return {
        user: userWithoutPassword,
        token: `fake-token-${user.id}-${Date.now()}`
    };
};