import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const connectMQ = async () => {
  try {
    return await amqp.connect(process.env.AMQP_UTL_DOCKER);
  } catch (error) {
    console.log(error);
  }
};

const sendQueue = async (queueName, message) => {
  let conn, channel;
  try {
    conn = await connectMQ();
    channel = await conn.createChannel();

    await channel.assertQueue(queueName, { durable: true });
    
    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
  } catch (error) {
    console.error(error);
  } finally {
    if (channel) await channel.close();
    if (conn) await conn.close();
  }
};

const consumeQueue = async (queueName, callback) => {
  try {
    const conn = await connectMQ();
    const channel = await conn.createChannel();

    await channel.assertQueue(queueName, { durable: true });

    await channel.consume(queueName, async (msg) => {
      if (msg) {
        const content = msg.content.toString();
        await callback(content);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export { sendQueue, consumeQueue };
