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
        throw new Error('Category already exists');
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

// Procura Categoria por Id
export const findCategoryById = async (id: number) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: { prompts: true }
    });

    if (!category) {
        throw new Error('Category not found');
    }

    return category;
};

// Lista prompts pertencentes a uma determinada categoria
export const getPromptsByCategoryId = async (categoryId: number) => {
    const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId }
    });

    if (!categoryExists) {
        throw new Error('Category not found');
    }

    return await prisma.prompt.findMany({
        where: { categoryId: categoryId },
        include: {
            user: {
                select: { id: true, username: true } 
            },
            versions: {
                take: 1,
                orderBy: { createdAt: 'desc' } 
            }
        }
    });
};