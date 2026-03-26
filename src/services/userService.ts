import { prisma } from '../lib/prisma.js';


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
        throw new Error('UserID not found');
    }
    return await prisma.user.findUnique({
        where: {
            id: userId  
        }
    });
};