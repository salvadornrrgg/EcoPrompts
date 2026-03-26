import { prisma } from '../lib/prisma.js';

export const findAllBooks = async () => {
    return await prisma.book.findMany({
        include: {
                author: true
        }
    });
};

export const createBook = async (title: string, authorId: number) => {
    const authorExists = await prisma.author.findUnique({
        where: { id: authorId }
    });

    if (!authorExists) {
        throw new Error('AuthorID not found');
    }

    return await prisma.book.create({
        data: {
            title,
            authorId
        }
    });
};

export const searchBookByName = async (chave: string) => {
    return await prisma.book.findMany({
        where: {
            title: {
                contains: chave
            }
        },
        include: {
            author: true
        }
    });
};

export const findRecentBooks = async () => {
    return await prisma.book.findMany({
        orderBy: {
            id: 'desc'
        },
        take: 3,
        include: {
                author: true
        }
    });
};