import { Router } from 'express';
import {
    getVersionController,
    deleteVersionController
} from '../controllers/versionController.js';

const router = Router();

// Rotas diretas de versões
router.get('/:versionId', getVersionController);
router.delete('/:versionId', deleteVersionController);

export default router;