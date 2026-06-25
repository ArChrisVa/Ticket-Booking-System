import { Router } from 'express';
import { reserve } from '../controllers/booking';

const router = Router();
router.post('/', reserve);

export default router;