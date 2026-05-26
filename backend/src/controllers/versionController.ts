import { Request, Response, NextFunction } from 'express';
import * as versionService from '../services/versionService';
import { versionIdSchema } from '../schemas/versionSchema';
import { AuthenticatedRequest } from '../middlewares/authGuard';

export const getVersionController = async (req: Request, res: Response, next: NextFunction) => {
    const result = versionIdSchema.safeParse({ versionId: req.params.versionId });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const version = await versionService.findVersionById(parseInt(result.data.versionId));
        res.json(version);
    } catch (error: any) {
        if (error.message === 'Version not found') error.status = 404;
        next(error);
    }
};

export const deleteVersionController = async (req: Request, res: Response, next: NextFunction) => {
    const result = versionIdSchema.safeParse({ versionId: req.params.versionId });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
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
        next(error);
    }
};
