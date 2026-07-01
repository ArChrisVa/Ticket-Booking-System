import { Router } from 'express';
import { reserve, getEventSeats } from '../controllers/booking';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.post('/', requireAuth, reserve);
router.get('/seats/:event_id', requireAuth, getEventSeats)

export default router;