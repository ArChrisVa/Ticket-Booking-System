import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Missing token' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');

    try {
        const payload = jwt.verify(token, secret);
        (req as any).user = payload;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    next();
};

export { requireAuth, requireAdmin };
