import { createEvent, getEvent, listEvents } from '../services/events';
import { Request, Response } from 'express';  

const create = async(req: Request, res: Response) => {
    try {
        const event = await createEvent(req.body)
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message })
    }
};

const getOne = async(req: Request, res: Response) => {
    try {
        const event = await getEvent(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json(event);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message })
    }
};

const list = async(req: Request, res: Response) => {
    try {
        const events = await listEvents(req.query)
        res.status(200).json(events)
    } catch (err) {
        res.status(400).json({ error: (err as Error).message })
    }
};

export {create, getOne, list};