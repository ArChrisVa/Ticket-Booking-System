import { connect } from 'amqplib';

const QUEUE = 'booking.confirmed';

export const startConsumer = async () => {
    const conn = await connect(process.env.RABBITMQ_URL!);
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });

    channel.consume(QUEUE, (msg) => {
        if (!msg) return;

        const booking = JSON.parse(msg.content.toString());
        console.log(
            `[notification] 📧 Email sent — booking ${booking.id}: ` +
            `seat ${booking.seat_id}, event ${booking.event_id}, user ${booking.user_id}`
        );

        channel.ack(msg);
    });

    console.log(`[notification] consuming "${QUEUE}"`);
};
