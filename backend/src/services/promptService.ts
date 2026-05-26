import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { indexPrompt, searchEmbeddedPrompts } from "./embeddingService";

export const searchPrompts = async (search: string) => {
    const promptIds = await searchEmbeddedPrompts(search);
    return await prisma.prompt.findMany({ where: { id: { in: promptIds } } });
};

export const findAllPrompts = async () => {
    return await prisma.prompt.findMany({
        include: {
            user: { select: { id: true, username: true } },
            category: true,
            versions: {
                orderBy: { versionNumber: 'asc' },
                include: { user: { select: { id: true, username: true } } }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const findPromptById = async (id: number) => {
    const prompt = await prisma.prompt.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, username: true } },
            category: true,
            comments: { include: { user: { select: { id: true, username: true } } } },
            evals: true,
            versions: { orderBy: { versionNumber: 'asc' }, include: { user: { select: { id: true, username: true } } } }
        }
    });

    if (!prompt) {
        logger.warn(`Prompt não encontrado: id=${id}`);
        throw new Error('Prompt not found');
    }

    return prompt;
};

export const createPrompt = async (data: {
    title: string;
    description: string;
    prompt: string;
    AImodel: string;
    result: string;
    categoryId: number;
    userId: number;
}) => {
    const categoryExists = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!categoryExists) {
        logger.warn(`Categoria não encontrada ao criar prompt: id=${data.categoryId}`);
        throw new Error('Category not found');
    }

    const userExists = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!userExists) {
        logger.warn(`Utilizador não encontrado ao criar prompt: id=${data.userId}`);
        throw new Error('User not found');
    }

    const prompt = await prisma.prompt.create({
        data: {
            title: data.title,
            description: data.description,
            prompt: data.prompt,
            AImodel: data.AImodel,
            result: data.result,
            categoryId: data.categoryId,
            userId: data.userId
        },
        include: {
            user: { select: { id: true, username: true } },
            category: true
        }
    });

    logger.info(`Prompt criado: id=${prompt.id} por user=${data.userId}`);
    await indexPrompt(data.title + " " + data.description, prompt.id);
    return prompt;
};

export const updatePrompt = async (id: number, data: {
    title?: string;
    description?: string;
    prompt?: string;
    AImodel?: string;
    result?: string;
    categoryId?: number;
}) => {
    const promptExists = await prisma.prompt.findUnique({ where: { id } });
    if (!promptExists) {
        logger.warn(`Prompt não encontrado ao atualizar: id=${id}`);
        throw new Error('Prompt not found');
    }

    if (data.categoryId) {
        const categoryExists = await prisma.category.findUnique({ where: { id: data.categoryId } });
        if (!categoryExists) {
            logger.warn(`Categoria não encontrada ao atualizar prompt: id=${data.categoryId}`);
            throw new Error('Category not found');
        }
    }

    const updated = await prisma.prompt.update({
        where: { id },
        data,
        include: {
            user: { select: { id: true, username: true } },
            category: true
        }
    });

    logger.info(`Prompt atualizado: id=${id}`);
    return updated;
};

export const deletePrompt = async (id: number) => {
    const promptExists = await prisma.prompt.findUnique({ where: { id } });
    if (!promptExists) {
        logger.warn(`Prompt não encontrado ao apagar: id=${id}`);
        throw new Error('Prompt not found');
    }

    const deleted = await prisma.prompt.delete({ where: { id } });
    logger.info(`Prompt apagado: id=${id}`);
    return deleted;
};
