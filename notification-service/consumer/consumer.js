import { getChannel } from "../config/rabbitmq.js";
import Notification from "../models/notification.model.js";
import admin from "../config/firebaseAdmin.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const gatewayServer = process.env.gateway_server;

export const startNotificationConsumer = async () => {
  const channel = await getChannel();

  const queue = "notification_queue";

  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(queue, "order.exchange", "order.*");

  channel.prefetch(1);

  console.log("Waiting for messages in %s. To exit press CTRL+C", queue);

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());

      if (!data.userId) {
        console.log("Notification skipped: userId missing", data);
        channel.ack(msg);
        return;
      }

      const notification = await Notification.create({
        userId: data.userId,
        title: "Order Update",
        message: `Your order has been ${data?.status} .`,
        type: "order",
      });

      global.io
        .to(`user_${data.userId}`)
        .emit("new_notification", notification);

      let fcmToken = null;

      try {
        const userResponse = await axios.get(
          `${gatewayServer}/auth/fcm-token/${data.userId}`,
        );

        fcmToken = userResponse.data.token;
      } catch (error) {
        console.log("Failed to fetch FCM token:", error.message);
      }

      if (!fcmToken) {
        console.log("User has no push token");
        channel.ack(msg);
        return;
      }

      await admin.messaging().send({
        token: fcmToken,
        notification: {
          userId: data.userId,
          title: "Order Update",
          message: `Your order ${data?.status} status changed.`,
          type: "order",
        },
      });

      channel.ack(msg);
    } catch (error) {
      console.log("Notification Error:", error);

      channel.nack(msg, false, false);
    }
  });
};
