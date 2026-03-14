import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  let connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange("auth.exchange", "direct", {
    durable: true,
  });
  console.log("RabbitMQ connected to resturant-service");
};

export const getChannel = () => channel;
