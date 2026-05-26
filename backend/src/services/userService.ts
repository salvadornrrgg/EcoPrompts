import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

export const findAllUsers = async () => {
    return await prisma.user.findMany();
};

export const createUser = async (username: string, email: string, password: string, userType: string = "User") => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        logger.warn(`Email já em uso: ${email}`);
        throw new Error('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { username, email, password: hashedPassword, userType }
    });

    logger.info(`Utilizador criado: id=${user.id} username=${username}`);
    return user;
};

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({ where: { email } });
};

export const findUser = async (userId: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        logger.warn(`Utilizador não encontrado: id=${userId}`);
        throw new Error('User not found');
    }

    return user;
};

export const updateUser = async (userId: number, data: { username?: string; email?: string; password?: string; userType?: string }) => {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    if (!userExists) {
        logger.warn(`Utilizador não encontrado ao atualizar: id=${userId}`);
        throw new Error('User not found');
    }

    const updated = await prisma.user.update({ where: { id: userId }, data });
    logger.info(`Utilizador atualizado: id=${userId}`);
    return updated;
};

export const deleteUser = async (userId: number) => {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    if (!userExists) {
        logger.warn(`Utilizador não encontrado ao apagar: id=${userId}`);
        throw new Error('User not found');
    }

    const deleted = await prisma.user.delete({ where: { id: userId } });
    logger.info(`Utilizador apagado: id=${userId}`);
    return deleted;
};
