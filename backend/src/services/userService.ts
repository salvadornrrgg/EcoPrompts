import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export const findAllUsers = async () => {
    return await prisma.user.findMany();
};

export const createUser = async (username: string, email: string, password: string, userType: string = "User") => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email já está em uso');

  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      userType: userType
    }
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const findUser = async (userId: number) => {
    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userExists) {
        throw new Error('User not found');
    }
    return await prisma.user.findUnique({
        where: {
            id: userId  
        }
    });
};

export const updateUser = async (userId: number, data: { username?: string; email?: string; password?: string; userType?: string }) => {
    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userExists) {
        throw new Error('User not found');
    }

    return await prisma.user.update({
        where: { id: userId },
        data
    });
};

export const deleteUser = async (userId: number) => {
    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userExists) {
        throw new Error('User not found');
    }

    return await prisma.user.delete({
        where: { id: userId }
    });
};