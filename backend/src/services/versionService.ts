import { prisma } from '../lib/prisma';

// GET versions by prompt ID
export const findVersionsByPromptId = async (promptId: number) => {
    const promptExists = await prisma.prompt.findUnique({
        where: { id: promptId }
    });

    if (!promptExists) {
        throw new Error('Prompt not found');
    }

    return await prisma.version.findMany({
        where: { promptId },
        include: {
            user: {
                select: { id: true, username: true }
            },
            prompt: {
                select: { id: true, title: true }
            }
        },
        orderBy: { versionNumber: 'asc' }
    });
};

// GET version by ID
export const findVersionById = async (id: number) => {
    const versionExists = await prisma.version.findUnique({
        where: { id }
    });

    if (!versionExists) {
        throw new Error('Version not found');
    }

    return await prisma.version.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, username: true }
            },
            prompt: {
                include: {
                    user: {
                        select: { id: true, username: true }
                    },
                    category: true
                }
            }
        }
    });
};

// CREATE version - COM VALIDAÇÃO PRÉVIA
export const createVersion = async (promptId: number, userId: number, data: {
    promptText: string;
    improvements?: string;
    rating?: number;
}) => {
    // Validar se o prompt original existe
    const promptExists = await prisma.prompt.findUnique({
        where: { id: promptId }
    });

    if (!promptExists) {
        throw new Error('Prompt not found');
    }
    
    // Validar se o utilizador existe
    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });
    
    if (!userExists) {
        throw new Error('User not found');
    }

    // Calcular próximo número de versão
    const versionsCount = await prisma.version.count({
        where: { promptId }
    });

    const nextVersionNumber = versionsCount + 1;

    return await prisma.version.create({
        data: {
            versionNumber: nextVersionNumber,
            promptText: data.promptText,
            improvements: data.improvements,
            rating: data.rating || 0,
            promptId,
            userId
        },
        include: {
            user: {
                select: { id: true, username: true }
            },
            prompt: {
                select: { id: true, title: true }
            }
        }
    });
};

// DELETE version
export const deleteVersion = async (id: number) => {
    const versionExists = await prisma.version.findUnique({
        where: { id }
    });

    if (!versionExists) {
        throw new Error('Version not found');
    }

    return await prisma.version.delete({
        where: { id }
    });
};