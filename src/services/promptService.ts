import { prisma } from '../lib/prisma.js';

// GET ALL prompts
export const findAllPrompts = async () => {
    return await prisma.prompt.findMany({
        include: {
            user: {
                select: { id: true, username: true }
            },
            category: true,
            versions: {
                orderBy: { versionNumber: 'asc' },
                include: {
                    user: {
                        select: { id: true, username: true }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

// GET prompt by ID
export const findPromptById = async (id: number) => {
    const promptExists = await prisma.prompt.findUnique({
        where: { id }
    });

    if (!promptExists) {
        throw new Error('Prompt not found');
    }

    return await prisma.prompt.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, username: true }
            },
            category: true,
            comments: {
                include: {
                    user: { select: { id: true, username: true } }
                }
            },
            evals: true,
            versions: {
                orderBy: { versionNumber: 'asc' },
                include: {
                    user: {
                        select: { id: true, username: true }
                    }
                }
            }
        }
    });
};

// CREATE prompt
export const createPrompt = async (data: {
    title: string;
    description: string;
    prompt: string;
    AImodel: string;
    result: string;
    categoryId: number;
    userId: number;
}) => {
    return await prisma.prompt.create({
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
            user: {
                select: { id: true, username: true }
            },
            category: true
        }
    });
};

// UPDATE prompt
export const updatePrompt = async (id: number, data: {
    title?: string;
    description?: string;
    prompt?: string;
    AImodel?: string;
    result?: string;
    categoryId?: number;
}) => {
    const promptExists = await prisma.prompt.findUnique({
        where: { id }
    });

    if (!promptExists) {
        throw new Error('Prompt not found');
    }

    return await prisma.prompt.update({
        where: { id },
        data,
        include: {
            user: {
                select: { id: true, username: true }
            },
            category: true
        }
    });
};

// DELETE prompt (e todas as suas versões - onDelete: Cascade)
export const deletePrompt = async (id: number) => {
    const promptExists = await prisma.prompt.findUnique({
        where: { id }
    });

    if (!promptExists) {
        throw new Error('Prompt not found');
    }

    return await prisma.prompt.delete({
        where: { id }
    });
};