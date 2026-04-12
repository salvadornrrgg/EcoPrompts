import { Request, Response } from 'express';
import * as promptService from '../services/promptService.js';
import * as versionService from '../services/versionService.js';
import { createPromptSchema, promptIdSchema, updatePromptSchema, promptSearchSchema } from '../schemas/promptSchema.js';
import { createVersionSchema } from '../schemas/versionSchema.js';

// GET /prompts - Lista todos os prompts
export const getPromptsController = async (req: Request, res: Response) => {
    try {
        const prompts = await promptService.findAllPrompts();
        res.json(prompts);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar prompts" });
    }
};

// GET /prompts/:id - Obtém prompt específico
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
            res.status(500).json({ error: "Erro ao buscar prompt" });
        }
    }
};

// POST /prompts - Cria novo prompt
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
        // TODO: Pegar userId do token de autenticação
        const userId = req.body.userId || 1;
        
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

// PUT /prompts/:id - Edita prompt existente
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
        const updatedPrompt = await promptService.updatePrompt(parseInt(idResult.data.id), dataResult.data);
        res.status(200).json(updatedPrompt);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao atualizar prompt" });
    }
};

// DELETE /prompts/:id - Remove prompt (e as suas versões)
export const deletePromptController = async (req: Request, res: Response) => {
    const result = promptIdSchema.safeParse({ id: req.params.id });

    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        await promptService.deletePrompt(parseInt(result.data.id));
        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao remover prompt" });
    }
};

// GET /prompts/:id/versions - Lista versões de um prompt
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

// POST /prompts/:id/versions - Cria nova versão
export const createVersionController = async (req: Request, res: Response) => {
    // Validar ID do prompt
    const idResult = promptIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: idResult.error.issues.map((issue) => issue.message)
        });
    }

    // Validar dados da versão
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
        // TODO: Pegar userId do token de autenticação
        const userId = req.body.userId || 1;
        
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