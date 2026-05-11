import { Request, Response } from 'express';
import * as promptService from '../services/promptService';
import * as versionService from '../services/versionService';
import { createPromptSchema, promptIdSchema, updatePromptSchema, promptSearchSchema } from '../schemas/promptSchema';
import { createVersionSchema } from '../schemas/versionSchema';
import { AuthenticatedRequest } from '../middlewares/authGuard';


export const searchPromptsController = async (req: Request, res: Response) => {
    const result = promptSearchSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({
            error: "Pesquisa inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    };

    try {
        const prompts = await promptService.searchPrompts(result.data.q);
        res.json(prompts);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || "Erro ao pesquisar prompts" });
    };
};

export const getPromptsController = async (req: Request, res: Response) => {
    try {
        const prompts = await promptService.findAllPrompts();
        res.json(prompts);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || "Erro ao buscar prompts" });
    }
};

export const getPromptController = async (req: Request, res: Response) => {
    const result = promptIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }
    try {
        const prompt = await promptService.findPromptById(parseInt(result.data.id));
        res.json(prompt);
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Prompt not found') {
            res.status(404).json({ error: "Prompt não encontrado" });
        } else {
            res.status(500).json({ error: error.message || "Erro ao buscar prompt" });
        }
    }
};

export const createPromptController = async (req: Request, res: Response) => {
    const result = createPromptSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const userId = (req as AuthenticatedRequest).user!.id;
        const newPrompt = await promptService.createPrompt({
            ...result.data,
            userId
        });
        res.status(201).json(newPrompt);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao criar prompt" });
    }
};

export const updatePromptController = async (req: Request, res: Response) => {
    const idResult = promptIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: idResult.error.issues.map((issue) => issue.message)
        });
    }

    const dataResult = updatePromptSchema.safeParse(req.body);
    if (!dataResult.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            errors: dataResult.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const promptId = parseInt(idResult.data.id);
        const prompt = await promptService.findPromptById(promptId);
        if (!prompt) return res.status(404).json({ error: "Prompt não encontrado" });

        const currentUser = (req as AuthenticatedRequest).user!;
        const isOwner = prompt.userId === currentUser.id;
        const isAdmin = currentUser.userType === 'Admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "Apenas o autor ou Admin podem editar este prompt" });
        }

        const updatedPrompt = await promptService.updatePrompt(promptId, dataResult.data);
        res.status(200).json(updatedPrompt);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao atualizar prompt" });
    }
};

export const deletePromptController = async (req: Request, res: Response) => {
    const result = promptIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        const promptId = parseInt(result.data.id);
        const prompt = await promptService.findPromptById(promptId);
        if (!prompt) return res.status(404).json({ error: "Prompt não encontrado" });

        const currentUser = (req as AuthenticatedRequest).user!;
        if (prompt.userId !== currentUser.id) {
            return res.status(403).json({ error: "Apenas o autor pode apagar este prompt" });
        }

        await promptService.deletePrompt(promptId);
        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao remover prompt" });
    }
};

export const getVersionsByPromptController = async (req: Request, res: Response) => {
    const result = promptIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }
    try {
        const versions = await versionService.findVersionsByPromptId(parseInt(result.data.id));
        res.json(versions);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao buscar versões" });
    }
};

export const createVersionController = async (req: Request, res: Response) => {
    const idResult = promptIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: idResult.error.issues.map((issue) => issue.message)
        });
    }

    const dataResult = createVersionSchema.safeParse(req.body);
    if (!dataResult.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            errors: dataResult.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const userId = (req as AuthenticatedRequest).user!.id;
        const newVersion = await versionService.createVersion(
            parseInt(idResult.data.id),
            userId,
            dataResult.data
        );
        res.status(201).json(newVersion);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao criar versão" });
    }
};