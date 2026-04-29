import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard';
import {
    getVersionController,
    deleteVersionController
} from '../controllers/versionController';

const router = Router();

router.get('/:versionId', getVersionController);
router.delete('/:versionId', authGuard, deleteVersionController);

export default router;