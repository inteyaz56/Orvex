import amqp from "amqplib";
let channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange("rider.change", "topic", {
    durable: true,
  });

  console.log("Rider-Service connected to RabbitMQ");
};

export const markAsDelivered = async (orderId) => {
  const routingKey = "order.delivered";

  channel.publish(
    "rider.change",
    routingKey,
    Buffer.from(JSON.stringify({ orderId })),
  );
  console.log(`Order ${orderId} marked as delivered`);
};
export const getChannel = () => channel;
