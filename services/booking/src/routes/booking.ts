import { Router } from 'express';
import { reserve } from '../controllers/booking';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.post('/', requireAuth, reserve);

export default router;