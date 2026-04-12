import { Request, Response } from 'express';
import * as versionService from '../services/versionService.js';
import { versionIdSchema } from '../schemas/versionSchema.js';

// GET /versions/:versionId - Obtém versão específica
export const getVersionController = async (req: Request, res: Response) => {
    const result = versionIdSchema.safeParse({ versionId: req.params.versionId });

    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        const version = await versionService.findVersionById(parseInt(result.data.versionId));
        res.json(version);
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Version not found') {
            res.status(404).json({ error: "Versão não encontrada" });
        } else {
            res.status(500).json({ error: "Erro ao buscar versão" });
        }
    }
};

// DELETE /versions/:versionId - Remove versão
export const deleteVersionController = async (req: Request, res: Response) => {
    const result = versionIdSchema.safeParse({ versionId: req.params.versionId });

    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        await versionService.deleteVersion(parseInt(result.data.versionId));
        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao remover versão" });
    }
};