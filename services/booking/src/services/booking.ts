import { reserveSeat as reserveSeatInDb, getEventSeatsById, insertEventSeatsById } from '../repositories/booking';

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

export const getSeatsByEventId = async (event_id: string) => {
    if(!event_id) throw new Error('Event was not found');
    return getEventSeatsById(event_id);
};

export const createSeats = async (event_id: string) => {
    if(!event_id) throw new Error('Event was not found');
    return insertEventSeatsById(event_id);
};