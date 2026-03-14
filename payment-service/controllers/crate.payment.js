import { razorpayInstance } from "../config/razorpay.js";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import axios from "axios";
let gatewayServer = process.env.GATEWAY_SERVER;
import { getChannel } from "../config/rabbitmq.js";

export const createOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const response = await axios.get(
      `${gatewayServer}/orders/order/${orderId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    const order = response.data;

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("This is order", order);

    if (order.paymentMethod !== "ONLINE") {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: orderId,
    });

    return res.status(200).json(razorpayOrder);
  } catch (error) {
    console.log(error.response?.data || error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const channel = getChannel();

    if (expectedSignature === razorpay_signature) {
      channel.publish(
        "payment.exchange",
        "payment.success",
        Buffer.from(JSON.stringify({ orderId })),
      );

      return res.status(200).json({ message: "Payment verified" });
    } else {
      channel.publish(
        "payment.exchange",
        "payment.failed",
        Buffer.from(JSON.stringify({ orderId })),
      );

      return res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
