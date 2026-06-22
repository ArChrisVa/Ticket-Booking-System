import { insertEvent, getEventById, findEvents } from '../repositories/events';


export const createEvent = async (input:
    {
        name: string; 
        category: string; 
        city: string; 
        venue: string; 
        event_date: string
    }
) => {
    if (!input.name) throw new Error('Event name is required');
    if (!input.category) throw new Error('Event category is required');
    if (!input.city) throw new Error('Event city is required');
    if (!input.venue) throw new Error('Event venue is required');
    if (!input.event_date) throw new Error('Event date is required');
    const event = await insertEvent(input);
    return event;
};

export const getEvent = async (id: string) => {
    if(!id) throw new Error('Event id is required');
    const event = await getEventById(id);
    return event;
};

export const listEvents = async (filters: {
    city?: string;
    category?: string;
    event_date?: string;
}
) => {
    const events = await findEvents(filters);
    return events;
};
