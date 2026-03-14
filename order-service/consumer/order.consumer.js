import Order from "../models/order.model.js";

import { getChannel } from "../config/rabbitmq.js";

export const startOrderConsumer = async () => {
  let channel = getChannel();

  await channel.assertExchange("payment.exchange", "topic", { durable: true });
  const queue = "order.payment.queue";

  await channel.assertExchange("order.exchange", "topic", {
    durable: true,
  });

  const orderQueue = "order.assignment.queue";
  const riderOrderQueue = "order.rider.queue";
  // 2️⃣ Ensure queue exists

  await channel.assertQueue(queue, { durable: true });
  await channel.assertQueue(orderQueue, { durable: true });
  await channel.assertQueue(riderOrderQueue, { durable: true });

  // Listen to both success & failed
  await channel.bindQueue(queue, "payment.exchange", "payment.success");
  await channel.bindQueue(queue, "payment.exchange", "payment.failed");
  await channel.bindQueue(orderQueue, "order.exchange", "order.assigned");
  await channel.bindQueue(riderOrderQueue, "order.exchange", "order.delivered");

  console.log("Waiting for event");
  channel.consume(queue, async (msg) => {
    if (!msg) return;
    try {
      const routingKey = msg.fields.routingKey;
      const { orderId } = JSON.parse(msg.content.toString());

      const order = await Order.findById(orderId);
      if (!order) {
        channel.ack(msg);
        return;
      }

      if (order.paymentStatus !== "PENDING") {
        channel.ack(msg);
        return;
      }

      if (routingKey === "payment.success") {
        order.paymentStatus = "SUCCESS";
        order.status = "CONFIRMED";

        order.statusHistory.push({
          status: "CONFIRMED",
        });

        console.log("Order confirmed:", orderId);
      }

      if (routingKey === "payment.failed") {
        order.paymentStatus = "FAILED";
        order.status = "CANCELLED";

        order.statusHistory.push({
          status: "CANCELLED",
        });

        console.log("Order cancelled (payment failed):", orderId);
      }

      await order.save();
      channel.ack(msg);
    } catch (error) {
      console.log(error);
      channel.nack(msg, false, false);
    }
  });

  console.log("🟢 Order Service listening for order.assigned events...");
  await channel.consume(orderQueue, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      const { orderId, riderId } = data;

      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          riderId,
          status: "OUT_FOR_DELIVERY",
          $push: {
            statusHistory: {
              status: "OUT_FOR_DELIVERY",
              updatedAt: new Date(),
            },
          },
        },
        { returnDocument: "after" },
      );

      if (!order) {
        console.log("Order not found:", orderId);
      } else {
        console.log("✅ Order assigned to rider:", riderId);
      }

      channel.ack(msg);
    } catch (error) {
      console.error("❌ Error processing assignment:", error);

      // reject message permanently (no requeue)
      channel.nack(msg, false, false);
    }
  });

  await channel.consume(riderOrderQueue, async (msg) => {
    console.log("Rider order queue is listening...");
    if (!msg) return;

    try {
      let data = JSON.parse(msg.content.toString());

      const { orderId, riderId } = data;

      let order = await Order.findByIdAndUpdate(
        orderId,
        {
          riderId,
          status: "DELIVERED",
          $push: {
            statusHistory: {
              status: "DELIVERED",
              updatedAt: new Date(),
            },
          },
        },
        { returnDocument: "after" },
      );

      if (!order) {
        console.log("Order not found:", orderId);
      } else {
        console.log("This is orders", orderId);
      }

      channel.ack(msg);
    } catch (error) {
      console.error("❌ Error processing rider order:", error);
      channel.nack(msg, false, false);
    }
  });
};
