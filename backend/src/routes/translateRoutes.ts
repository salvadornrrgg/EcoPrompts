import { Router } from 'express';
import { translateController } from '../controllers/translateController';

const router = Router();

router.post('/', translateController);

export default router;
