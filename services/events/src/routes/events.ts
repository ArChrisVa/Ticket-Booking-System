import { Router } from 'express';
import { create, getOne, list } from '../controllers/events';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, requireAdmin, create);     // POST   /events       → create
router.get('/', list);        // GET    /events       → list
router.get('/:id', getOne);   // GET    /events/:id   → getOne

export default router;