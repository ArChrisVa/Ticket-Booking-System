import { getSeatById, markSeatBooked, createBooking } from '../repositories/booking';


export const reserveSeat = async (reservation : {
    user_id: string;
    seat_id: string;
    event_id: string;
}) => {
    if (!reservation.user_id) throw new Error('User is required');
    if (!reservation.seat_id) throw new Error('Seat is required');
    if (!reservation.event_id) throw new Error('Event is required');

    const seat = await getSeatById(reservation.seat_id);
    if(seat == null) throw new Error('Seat does not exist');

    if (seat.status !== 'available') throw new Error('Seat is unavailable')

    const markSeat = await markSeatBooked(reservation.seat_id);
    if(!markSeat) throw new Error('Seat could not be set to booked');

    const newBooking = await createBooking(reservation);
    return newBooking;
}

