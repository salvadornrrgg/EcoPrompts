import { prisma } from '../lib/prisma';
import { indexPrompt, searchEmbeddedPrompts } from "./embeddingService";

// GET searched prompts by string
export const searchPrompts = async (search: string) => {
    const promptIds = await searchEmbeddedPrompts(search);

    const prompts = await prisma.prompt.findMany({
        where: {
            id: { in: promptIds }
        }
    });
    
    return prompts;
};


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
        throw new Error('Prompt not found');
    }

    return prompt;
};

// CREATE prompt - com validação prévia
export const createPrompt = async (data: {
    title: string;
    description: string;
    prompt: string;
    AImodel: string;
    result: string;
    categoryId: number;
    userId: number;
}) => {
    // Validar se a categoria existe
    const categoryExists = await prisma.category.findUnique({
        where: { id: data.categoryId }
    });
    
    if (!categoryExists) {
        throw new Error('Category not found');
    }
    
    // Validar se o utilizador existe
    const userExists = await prisma.user.findUnique({
        where: { id: data.userId }
    });
    
    if (!userExists) {
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
            user: {
                select: { id: true, username: true }
            },
            category: true
        }
    });

    await indexPrompt(data.title+" "+data.description, prompt.id);

    return prompt;
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
    
    // Se for atualizar a categoria, validar se existe
    if (data.categoryId) {
        const categoryExists = await prisma.category.findUnique({
            where: { id: data.categoryId }
        });
        
        if (!categoryExists) {
            throw new Error('Category not found');
        }
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

// DELETE prompt
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