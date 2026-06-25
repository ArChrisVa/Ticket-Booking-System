
import { pool } from '../db';

export const getSeatById = async (seat_id: string) => {
    const result = await pool.query(
        `SELECT id, event_id, section, row_label, seat_number, price_cents, status
         FROM seats
         WHERE id = $1 
        `, [seat_id]
    )
    return result.rows[0] ?? null;
}

export const markSeatBooked = async (seat_id: string) => {
    const result = await pool.query(
        `UPDATE seats
         SET status = 'booked'
         WHERE seats.id = $1
        `,[seat_id]
    )

    return result.rowCount ?? null;
}

export const createBooking = async ( booking : {
    user_id: string,
    seat_id: string,
    event_id: string,
}) => {
    const result = await pool.query(
        `INSERT INTO bookings (user_id, seat_id, event_id)
         VALUES ($1, $2, $3)
         RETURNING *
        `,[booking.user_id, booking.seat_id, booking.event_id]
    )

    return result.rows[0];
}