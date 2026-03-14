import amqp from "amqplib";
let channel;

export const connectRabbitMQ = async () => {
  let conection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await conection.createChannel();

  await channel.assertExchange("order.exchange", "topic", {
    durable: true,
  });

  console.log("RabbitMQ connected to notification-service");
};

export const getChannel = () => channel;
