import { Request, Response } from 'express';
import { reserveSeat } from '../services/booking';

const reserve = async (req: Request, res: Response) => {
    try {
        const result = await reserveSeat(req.body);
        res.status(201).json(result)
    }catch(err) {
        res.status(400).json({ error: (err as Error).message })
    }
}

export { reserve }