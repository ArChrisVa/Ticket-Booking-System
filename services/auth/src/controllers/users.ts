import { Request, Response } from 'express';
import { registerUser } from '../services/users';

const register = async (req: Request, res: Response) =>
    {
        try{
            const user = await registerUser(req.body);
            res.status(201).json(user);
        }catch(err){
            res.status(400).json({ error: (err as Error).message });
        }

    };

export { register };