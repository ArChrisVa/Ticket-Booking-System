import { Router } from 'express';
import { create, getOne, list } from '../controllers/events';

const router = Router();

router.post('/', create);     // POST   /events       → create
router.get('/', list);        // GET    /events       → list
router.get('/:id', getOne);   // GET    /events/:id   → getOne

export default router;