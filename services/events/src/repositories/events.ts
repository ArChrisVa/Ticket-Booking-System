
import { pool } from '../db';

// Insert new event

export const InsertEvent = async (event :
    {
        name: string; 
        category: string; 
        city: string; 
        venue: string; 
        event_date: string
    }) => {
    const result = await pool.query(
        `INSERT INTO events (name,category,city,venue,event_date) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [event.name, event.category, event.city, event.venue, event.event_date]
    );

    return result.rows[0];
};

// Fetch event by id

export const GetEventById = async (id: string) => {
    const result = await pool.query(
        `SELECT id, name, category, city, venue, event_date, created_at
         FROM events
         WHERE events.id = $1
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

// find events by optional filters
export const FindEvents = async (filters : 
    {
        city?: string;
        category?: string;
        event_date?: string;
    }) =>
    {
    const conditions: string[] = [];
    const values: unknown[] = [];
    
    if (filters.city !== undefined) {
        values.push(filters.city);                       
        conditions.push(`city = $${values.length}`); // sql where clause   
    }
    if (filters.category !== undefined) {
        values.push(filters.category);                       
        conditions.push(`category = $${values.length}`); // sql where clause   
    }
    if (filters.event_date !== undefined) {
        values.push(filters.event_date);                       
        conditions.push(`event_date >= $${values.length}`); // sql where clause   
    }

    const where = conditions.length > 0 
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const result = await pool.query(
        `SELECT id, name, category, city, venue, event_date, created_at
         FROM events
         ${where}
         ORDER BY event_date ASC`,
         values
    );

    return result.rows;
};