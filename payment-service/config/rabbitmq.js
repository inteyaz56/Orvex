import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  let connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange("order.exchange", "topic", {
    durable: true,
  });

  await channel.assertExchange("payment.exchange", "topic", {
    durable: true,
  });

  console.log("RabbitMQ connected to payment-service");
};

export const getChannel = () => channel;
