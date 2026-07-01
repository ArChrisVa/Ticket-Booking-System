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

// Transaction query. Locked db actions together to avoid race condition.
export const reserveSeat = async (reservation: {
    user_id: string;
    seat_id: string;
    event_id: string;
}) => {

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const seatRes = await client.query(
            `SELECT id, status
               FROM seats
              WHERE id = $1
              FOR UPDATE`,
            [reservation.seat_id]
        );

        const seat = seatRes.rows[0];
        if (!seat) throw new Error('Seat does not exist');
        if (seat.status !== 'available') throw new Error('Seat is unavailable');

        await client.query(
            `UPDATE seats SET status = 'booked' WHERE id = $1`,
            [reservation.seat_id]
        );

        const bookingRes = await client.query(
            `INSERT INTO bookings (user_id, seat_id, event_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [reservation.user_id, reservation.seat_id, reservation.event_id]
        );

        await client.query('COMMIT');
        return bookingRes.rows[0];
    } catch (err) {
        await client.query('ROLLBACK'); 
        throw err;
    } finally {
        client.release(); 
    }
}

export const getEventSeatsById = async (eventId : string) => {

    const result = await pool.query(
        `
        SELECT id, event_id, section, row_label, seat_number, price_cents, status
        FROM seats
        WHERE seats.event_id = $1
        ORDER BY section, row_label, seat_number
        `,[eventId]
    )

    return result.rows;
}

export const insertEventSeatsById = async (eventId : string) => {
    const result = await pool.query(
        `
        INSERT INTO seats (event_id, section, row_label, seat_number, price_cents, status)
        SELECT $1,
            s.section,
            r.row_label,
            n.seat_number,
            CASE s.section WHEN 'A' THEN 8000 WHEN 'B' THEN 5000 ELSE 3000 END,
            'available'
        FROM       (VALUES ('A'), ('B'), ('C'))               AS s(section)
        CROSS JOIN (VALUES ('1'), ('2'), ('3'), ('4'), ('5')) AS r(row_label)
        CROSS JOIN generate_series(1, 10)                     AS n(seat_number)
        ON CONFLICT (event_id, section, row_label, seat_number) DO NOTHING;
        `,[eventId]
    )

    return result.rowCount;
}
