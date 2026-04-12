import { prisma } from '../lib/prisma.js';

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

// CREATE version
export const createVersion = async (promptId: number, userId: number, data: {
    promptText: string;
    improvements?: string;
    rating?: number;
}) => {
    // Verificar se o prompt original existe
    const promptExists = await prisma.prompt.findUnique({
        where: { id: promptId }
    });

    if (!promptExists) {
        throw new Error('Prompt not found');
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