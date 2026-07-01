import { connect, type Channel } from 'amqplib';

const QUEUE = 'event.created';

let channel: Channel;

export const initMessaging = async () => {
    const conn = await connect(process.env.RABBITMQ_URL!);
    channel = await conn.createChannel();
    await channel.assertQueue(QUEUE, { durable: true }); // queue survives broker restart
    console.log(`[event] connected to RabbitMQ; queue "${QUEUE}" ready`);
};

export const publishEventCreated = (event: object) => {
    if (!channel) {
        console.error('[event] cannot publish — RabbitMQ channel not ready yet');
        return;
    }
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(event)), { persistent: true });
    console.log('[event] published event.created', event);
};

