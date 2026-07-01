import { Request, Response } from 'express';
import { reserveSeat, getSeatsByEventId } from '../services/booking';
import { publishBookingConfirmed } from '../messaging';

const reserve = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const booking = await reserveSeat({ ...req.body, user_id: userId });
        publishBookingConfirmed(booking);      
        res.status(201).json(booking);
    }catch(err) {
        res.status(400).json({ error: (err as Error).message })
    }
}

const getEventSeats = async (req: Request, res: Response) => {
    try{
        const eventId = req.params.event_id

        const seats = await getSeatsByEventId(eventId)
        res.status(200).json(seats)
    }catch(err){
        res.status(400).json({ error: (err as Error).message })
    }
}

export { reserve, getEventSeats  }