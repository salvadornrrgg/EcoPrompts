import { Request, Response } from 'express';
import * as versionService from '../services/versionService';
import { versionIdSchema } from '../schemas/versionSchema';
import { AuthenticatedRequest } from '../middlewares/authGuard';

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
            res.status(500).json({ error: error.message || "Erro ao buscar versão" });
        }
    }
};

export const deleteVersionController = async (req: Request, res: Response) => {
    const result = versionIdSchema.safeParse({ versionId: req.params.versionId });
    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        const versionId = parseInt(result.data.versionId);
        const version = await versionService.findVersionById(versionId);
        if (!version) return res.status(404).json({ error: "Versão não encontrada" });

        const currentUser = (req as AuthenticatedRequest).user;
        if (!currentUser) return res.status(401).json({ error: "Não autenticado" });

        if (version.userId !== currentUser.id) {
            return res.status(403).json({ error: "Apenas o autor pode apagar esta versão" });
        }

        await versionService.deleteVersion(versionId);
        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao remover versão" });
    }
};