import { Request, Response, NextFunction } from 'express';
import * as promptService from '../services/promptService';
import * as versionService from '../services/versionService';
import { createPromptSchema, promptIdSchema, updatePromptSchema, promptSearchSchema } from '../schemas/promptSchema';
import { createVersionSchema } from '../schemas/versionSchema';
import { AuthenticatedRequest } from '../middlewares/authGuard';

export const searchPromptsController = async (req: Request, res: Response, next: NextFunction) => {
    const result = promptSearchSchema.safeParse(req.query);
    if (!result.success) {
        const err: any = new Error('Pesquisa inválida');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const prompts = await promptService.searchPrompts(result.data.q);
        res.json(prompts);
    } catch (error: any) {
        next(error);
    }
};

export const getPromptsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prompts = await promptService.findAllPrompts();
        res.json(prompts);
    } catch (error: any) {
        next(error);
    }
};

export const getPromptController = async (req: Request, res: Response, next: NextFunction) => {
    const result = promptIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const prompt = await promptService.findPromptById(parseInt(result.data.id));
        res.json(prompt);
    } catch (error: any) {
        if (error.message === 'Prompt not found') error.status = 404;
        next(error);
    }
};

export const createPromptController = async (req: Request, res: Response, next: NextFunction) => {
    const result = createPromptSchema.safeParse(req.body);
    if (!result.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const userId = (req as AuthenticatedRequest).user!.id;
        const newPrompt = await promptService.createPrompt({ ...result.data, userId });
        res.status(201).json(newPrompt);
    } catch (error: any) {
        next(error);
    }
};

export const updatePromptController = async (req: Request, res: Response, next: NextFunction) => {
    const idResult = promptIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = idResult.error.issues;
        return next(err);
    }

    const dataResult = updatePromptSchema.safeParse(req.body);
    if (!dataResult.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = dataResult.error.issues;
        return next(err);
    }

    try {
        const promptId = parseInt(idResult.data.id);
        const prompt = await promptService.findPromptById(promptId);
        if (!prompt) return res.status(404).json({ error: "Prompt não encontrado" });

        const currentUser = (req as AuthenticatedRequest).user!;
        if (prompt.userId !== currentUser.id && currentUser.userType !== 'Admin') {
            return res.status(403).json({ error: "Apenas o autor ou Admin podem editar este prompt" });
        }

        const updatedPrompt = await promptService.updatePrompt(promptId, dataResult.data);
        res.status(200).json(updatedPrompt);
    } catch (error: any) {
        next(error);
    }
};

export const deletePromptController = async (req: Request, res: Response, next: NextFunction) => {
    const result = promptIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const promptId = parseInt(result.data.id);
        const prompt = await promptService.findPromptById(promptId);
        if (!prompt) return res.status(404).json({ error: "Prompt não encontrado" });

        const currentUser = (req as AuthenticatedRequest).user!;
        if (prompt.userId !== currentUser.id && currentUser.userType !== 'Admin') {
            return res.status(403).json({ error: "Apenas o autor ou Admin podem apagar este prompt" });
        }

        await promptService.deletePrompt(promptId);
        res.status(204).send();
    } catch (error: any) {
        next(error);
    }
};

export const getVersionsByPromptController = async (req: Request, res: Response, next: NextFunction) => {
    const result = promptIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const versions = await versionService.findVersionsByPromptId(parseInt(result.data.id));
        res.json(versions);
    } catch (error: any) {
        if (error.message === 'Prompt not found') error.status = 404;
        next(error);
    }
};

export const createVersionController = async (req: Request, res: Response, next: NextFunction) => {
    const idResult = promptIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = idResult.error.issues;
        return next(err);
    }

    const dataResult = createVersionSchema.safeParse(req.body);
    if (!dataResult.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = dataResult.error.issues;
        return next(err);
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
        next(error);
    }
};
