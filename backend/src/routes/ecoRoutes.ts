import { Router } from 'express';
import { getEcoStats } from '../controllers/ecoController';

const router = Router();

router.get('/prompts/:id/eco', getEcoStats);

export default router;