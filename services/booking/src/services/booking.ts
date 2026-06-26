import { reserveSeat as reserveSeatInDb } from '../repositories/booking';

export const reserveSeat = async (reservation: {
    user_id: string;
    seat_id: string;
    event_id: string;
}) => {
    if (!reservation.user_id) throw new Error('User is required');
    if (!reservation.seat_id) throw new Error('Seat is required');
    if (!reservation.event_id) throw new Error('Event is required');

    return reserveSeatInDb(reservation);
};
