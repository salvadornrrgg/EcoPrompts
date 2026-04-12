import { prisma } from '../lib/prisma.js';

// Obtem todas as categorias na base de dados
export const findAllCategories = async () => {
    return await prisma.category.findMany({
        orderBy: {
            name: 'asc'
        }
    });
};

// Cria categoria
export const createCategory = async (name: string) => {
    const existingCategory = await prisma.category.findUnique({
        where: { name }
    });

    if (existingCategory) {
        throw new Error('Category not found');
    }

    return await prisma.category.create({
        data: {
            name
        }
    });
};

// Procura categoria por nome
export const searchCategoryByName = async (chave: string) => {
    return await prisma.category.findMany({
        where: {
            name: {
                contains: chave,
                mode: 'insensitive'
            }
        }
    });
};

// Categoria por Id
export const findCategoryById = async (id: number) => {
    const categoryExists = await prisma.category.findUnique({
        where: { id }
    });

    if (!categoryExists) {
        throw new Error('Category not found');
    }

    return await prisma.category.findUnique({
        where: { id },
        include: {
            prompts: true
        }
    });
};