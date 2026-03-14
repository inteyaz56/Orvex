import { getChannel } from "../config/rabbitmq.js";

export const startOrderConsumer = async () => {
  const channel = getChannel();

  const queue = "payment.order.queue";

  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(queue, "order.exchange", "order.created");

  console.log("Wating for event");
  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());

      console.log("Payment received order:", data);

      // 🔥 Simulate payment only for ONLINE
      if (data.paymentMethod === "ONLINE") {
        // simulate success (for now always success)
        channel.publish(
          "payment.exchange",
          "payment.success",
          Buffer.from(JSON.stringify({ orderId: data.orderId })),
        );

        console.log("Payment success emitted for:", data.orderId);
      }

      channel.ack(msg);
    } catch (error) {
      console.log(error);
      channel.nack(msg, false, false);
    }
  });
};
