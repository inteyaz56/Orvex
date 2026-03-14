import { getChannel } from "../config/rabbitmq.js";
import Resturant from "../models/resturant.model.js";

export const startResturantConsumer = async () => {
  const channel = getChannel();

  const restaurantQueue = "resturant.queue";

  await channel.assertQueue(restaurantQueue, { durable: true });
  await channel.bindQueue(
    restaurantQueue,
    "auth.exchange",
    "resturant.created",
  );

  channel.consume(restaurantQueue, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      const { authId, email } = data;

      const existingResturant = await Resturant.findOne({ authId });

      if (!existingResturant) {
        const restaurant = await Resturant.create({ authId, email });

        console.log("Resturant created from event");
      } else {
        console.log("Restaurant already exists");
      }

      channel.ack(msg);
    } catch (error) {
      console.log(error);
      channel.nack(msg, false, false);
    }
  });

  //  Order Created Consumer

  const orderQueue = "order.queue";

  await channel.assertQueue(orderQueue, { durable: true });
  await channel.assertExchange("order.exchange", "topic", {
    durable: true,
  });
  await channel.bindQueue(orderQueue, "order.exchange", "order.created");

  channel.consume(orderQueue, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      let { orderId, userId, resturantId } = data;

      console.log(
        "New order received for resturant:",
        orderId,
        userId,
        resturantId,
      );

      // Here you can:
      // - Save notification
      // - Trigger WebSocket
      // - Update dashboard cache

      channel.ack(msg);
    } catch (error) {
      console.log(error);
      channel.nack(msg, false, false);
    }
  });

  console.log("Restaurant service is listening for events...");
};
