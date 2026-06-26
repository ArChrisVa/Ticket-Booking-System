import { connect, type Channel } from 'amqplib';

const QUEUE = 'booking.confirmed';

let channel: Channel;

export const initMessaging = async () => {
    const conn = await connect(process.env.RABBITMQ_URL!);
    channel = await conn.createChannel();
    await channel.assertQueue(QUEUE, { durable: true }); // queue survives broker restart
    console.log(`[booking] connected to RabbitMQ; queue "${QUEUE}" ready`);
};

export const publishBookingConfirmed = (booking: object) => {
    if (!channel) {
        console.error('[booking] cannot publish — RabbitMQ channel not ready yet');
        return;
    }
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(booking)), { persistent: true });
    console.log('[booking] published booking.confirmed');
};
