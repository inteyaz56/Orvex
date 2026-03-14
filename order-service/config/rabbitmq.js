import amqp from "amqplib";
let channel;

export const connectRabbitMQ = async () => {
  let connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized yet");
  }
  await channel.assertExchange("order.exchange", "topic", {
    durable: true,
  });
  console.log("RabbitMQ connected to order-service");
};

export const publishOrderCreated = async (orderData) => {
  const routingKey = "order.created";

  await channel.publish(
    "order.exchange",
    routingKey,
    Buffer.from(JSON.stringify(orderData)),
  );

  console.log("Event created", orderData);
};
export const publishOrderStatusChange = async (orderData) => {
  const routingKey = `order.status.${orderData.status}`;

  channel.publish(
    "order.exchange",
    routingKey,
    Buffer.from(JSON.stringify(orderData)),
    { persistent: true },
  );

  console.log("Order status event published:", routingKey);
};

export const getChannel = () => channel;
