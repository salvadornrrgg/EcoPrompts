import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';

export const findAllCategories = async () => {
    return await prisma.category.findMany({ orderBy: { name: 'asc' } });
};

export const createCategory = async (name: string) => {
    const existingCategory = await prisma.category.findUnique({ where: { name } });

    if (existingCategory) {
        logger.warn(`Categoria já existe: ${name}`);
        throw new Error('Category already exists');
    }

    const category = await prisma.category.create({ data: { name } });
    logger.info(`Categoria criada: id=${category.id} name=${name}`);
    return category;
};

export const searchCategoryByName = async (chave: string) => {
    return await prisma.category.findMany({
        where: { name: { contains: chave, mode: 'insensitive' } }
    });
};

export const findCategoryById = async (id: number) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: { prompts: true }
    });

    if (!category) {
        logger.warn(`Categoria não encontrada: id=${id}`);
        throw new Error('Category not found');
    }

    return category;
};

export const getPromptsByCategoryId = async (categoryId: number) => {
    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });

    if (!categoryExists) {
        logger.warn(`Categoria não encontrada: id=${categoryId}`);
        throw new Error('Category not found');
    }

    return await prisma.prompt.findMany({
        where: { categoryId },
        include: {
            user: { select: { id: true, username: true } },
            versions: { take: 1, orderBy: { createdAt: 'desc' } }
        }
    });
};
