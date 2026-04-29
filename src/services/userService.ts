import { prisma } from '../lib/prisma';


export const findAllUsers = async () => {
    return await prisma.user.findMany();
};


enum UserType {
  User = 0,
  Mod = 1,
  Admin = 2
}

export const createUser = async (username: string, email: string, password: string, userTypeInt: number ) => {
    const userType = UserType[userTypeInt];
    return await prisma.user.create({
        data: {username, email, password, userType }
    });
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

export const updateUser = async (userId: number, data: { username?: string; email?: string; password?: string; userType?: number }) => {
    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userExists) {
        throw new Error('User not found');
    }

    const updateData: any = { ...data };
    if (data.userType !== undefined) {
        updateData.userType = UserType[data.userType];
    }

    return await prisma.user.update({
        where: { id: userId },
        data: updateData
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