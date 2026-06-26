import { Request, Response } from 'express';
import { reserveSeat } from '../services/booking';

const reserve = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const booking = await reserveSeat({ ...req.body, user_id: userId });
        res.status(201).json(booking);
    }catch(err) {
        res.status(400).json({ error: (err as Error).message })
    }
}

export { reserve }