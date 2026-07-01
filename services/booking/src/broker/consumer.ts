import { connect } from 'amqplib';
import { createSeats } from '../services/booking'

const QUEUE = 'event.created';

export const startConsumer = async () => {
    const conn = await connect(process.env.RABBITMQ_URL!);
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });

    channel.prefetch(1); 
    channel.consume(QUEUE, async (msg) => {
        if (!msg) return;

        try {
            const event = JSON.parse(msg.content.toString());
            await createSeats(event.id);
            channel.ack(msg);
        }catch(err) {
            console.error("[booking] seat creation failed:", (err as Error).message);
            channel.nack(msg, false, false);
        }


    });

    console.log(`[event] consuming "${QUEUE}"`);
};
