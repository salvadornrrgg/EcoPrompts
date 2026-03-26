import { prisma } from '../lib/prisma.js';
export const findAllUsers = async () => {
return await prisma.user.findMany();
};
export const createUser = async (fullName: string, email: string) => {
return await prisma.user.create({
data: { fullName, email }
});
};


export const findFavAuthors = async (userId: number) => {
    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userExists) {
        throw new Error('UserID not found');
    }
    return await prisma.user.findUnique({
        where: {
            id: userId  
        },
        select: {
            favoriteAuthors: true
        }
    });
};