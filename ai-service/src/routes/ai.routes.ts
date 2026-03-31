import {Router} from 'express';
const router = Router();
import createAuthmiddleware from '../middlewares/auth.middleware';
import { analyzeResume } from '../controllers/ai.controller';

router.post('/',createAuthmiddleware(['user']),analyzeResume);

export default router;