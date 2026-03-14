import { getChannel } from "../config/rabbitmq.js";
import User from "../models/user.model.js";

export const startUserConsumer = async () => {
  const channel = getChannel();

  const queue = "user.queue";

  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(queue, "auth.exchange", "user.created");

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());

      console.log("Received:", data);

      const { authId, email } = data;

      const existingUser = await User.findOne({ authId });

      if (!existingUser) {
        await User.create({
          authId,
          email,
        });

        console.log("User profile created");
      } else {
        console.log("User already exists");
      }

      channel.ack(msg);
    } catch (error) {
      console.error("Error processing user.created:", error);

      channel.nack(msg, false, false);
    }
  });
};
