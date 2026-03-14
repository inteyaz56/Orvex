import amqp from "amqplib";
let channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);

  channel = await connection.createChannel();

  await channel.assertExchange("auth.exchange", "direct", {
    durable: true,
  });

  console.log("RabbitMQ connected (User Service)");
};

export const getChannel = () => channel;
