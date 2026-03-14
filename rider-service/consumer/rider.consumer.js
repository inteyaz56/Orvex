import { getChannel } from "../config/rabbitmq.js";
import Rider from "../models/rider.model.js";
import AvailableOrder from "../models/available.order.model.js";

export const startRiderConsumer = async () => {
  try {
    const channel = getChannel();

    if (!channel) {
      throw new Error("RabbitMQ channel not initialized");
    }

    await channel.prefetch(1);

    const riderQueue = "rider.queue";
    const orderQueue = "rider.order.ready.queue";

    await channel.assertExchange("auth.exchange", "direct", {
      durable: true,
    });

    await channel.assertExchange("order.exchange", "topic", {
      durable: true,
    });

    await channel.assertQueue(riderQueue, { durable: true });
    await channel.assertQueue(orderQueue, { durable: true });

    await channel.bindQueue(riderQueue, "auth.exchange", "rider.created");

    await channel.bindQueue(
      orderQueue,
      "order.exchange",
      "order.status.READY_FOR_PICKUP",
    );

    channel.consume(riderQueue, async (msg) => {
      if (!msg) return;

      try {
        const data = JSON.parse(msg.content.toString());
        const { authId, email } = data;

        const riderExist = await Rider.findOne({ authId });

        if (!riderExist) {
          await Rider.create({
            authId,
            email,
          });

          console.log("✅ Rider created from auth event");
        } else {
          console.log("ℹ Rider already exists");
        }

        channel.ack(msg);
      } catch (error) {
        console.error("❌ Rider creation failed:", error);
        channel.nack(msg, false, false);
      }
    });

    channel.consume(orderQueue, async (msg) => {
      if (!msg) return;

      try {
        const orderData = JSON.parse(msg.content.toString());

        const {
          orderId,
          restaurantLat,
          restaurantLng,
          resturantId,
          userId,
          totalAmount,
        } = orderData;

        // 🔍 Find nearest rider within 5km

        if (!restaurantLat || !restaurantLng) {
          console.log("❌ Restaurant coordinates missing", orderData);
          channel.ack(msg);
          return;
        }
        const nearestRider = await Rider.find({
          isAvailable: true,
          isBusy: false,
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [restaurantLng, restaurantLat],
              },
              $maxDistance: 5000,
            },
          },
        }).limit(5);

        if (!nearestRider.length) {
          console.log("❌ No riders found nearby");
          channel.ack(msg);
          return;
        }

        await AvailableOrder.create({
          orderId,
          riderId: nearestRider._id,
          resturantId,
          userId,
          totalAmount,
        });

        console.log(
          `✅ Order ${orderId} offered to nearest rider ${nearestRider._id}`,
        );

        channel.ack(msg);
      } catch (error) {
        console.error(error);
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    console.error("❌ Rider Consumer Startup Error:", error);
  }
};
