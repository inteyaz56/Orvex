import ampq from "amqplib";
let channel;

export const connectRabbitMQ = async () => {
  let connection = await ampq.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange("auth.exchange", "direct", {
    durable: true,
  });

  console.log("RabbitMQ connected (Auth)");
};

export const publishUserCreated = async (userData) => {
  const routingKey = `${userData.role}.created`;

  channel.publish(
    "auth.exchange",
    routingKey,
    Buffer.from(JSON.stringify(userData)),
  );
  console.log("Event created".userData);
};
