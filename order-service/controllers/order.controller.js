import axios from "axios";
import Order from "../models/order.model.js";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";

import {
  publishOrderCreated,
  publishOrderStatusChange,
} from "../config/rabbitmq.js";
const gatewayServer = process.env.GATEWAY_SERVER;

export const createOrder = async (req, res) => {
  try {
    const { resturantId, items, paymentMethod } = req.body;
    const userId = req.user.authId;

    // ==============================
    // 1️⃣ Role Protection
    // ==============================
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ==============================
    // 2️⃣ Basic Validation
    // ==============================
    if (!resturantId || !items || items.length === 0 || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // ==============================
    // 3️⃣ Validate Restaurant
    // ==============================
    const resturantResponse = await axios.get(
      `${gatewayServer}/resturants/resturant/${resturantId}`,
    );

    const resturant = resturantResponse.data;

    if (!resturant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (!resturant.isOpen) {
      return res.status(400).json({ message: "Restaurant is closed" });
    }

    // ==============================
    // 4️⃣ Validate Menu Items
    // ==============================
    const menuIds = items.map((item) => item.menuId);

    const menuResponse = await axios.post(
      `${gatewayServer}/resturants/menu/validate`,
      { menuIds },
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    const menus = menuResponse.data;

    if (menus.length !== menuIds.length) {
      return res.status(400).json({ message: "Invalid menu items" });
    }

    // ==============================
    // 5️⃣ Calculate Subtotal
    // ==============================
    let subtotal = 0;
    const orderItems = [];

    for (let item of items) {
      const menu = menus.find((m) => String(m._id) === String(item.menuId));

      if (!menu) {
        return res.status(400).json({ message: "Menu item not found" });
      }

      if (String(menu.resturantId) !== String(resturantId)) {
        return res.status(400).json({
          message: "Menu does not belong to this restaurant",
        });
      }

      if (!menu.isAvailable) {
        return res.status(400).json({
          message: `${menu.name} is not available`,
        });
      }

      const itemTotal = menu.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuId: menu._id,
        name: menu.name,
        priceAtPurchase: menu.price,
        quantity: item.quantity,
      });
    }

    // ==============================
    // 6️⃣ Fees Calculation
    // ==============================
    const deliveryFee = 30;
    const platformFee = 5;
    const codFee = paymentMethod === "COD" ? 20 : 0;

    const totalAmount = subtotal + deliveryFee + platformFee + codFee;

    // ==============================
    // 7️⃣ Payment + Status Logic
    // ==============================
    let status = "PENDING";
    let paymentStatus = "PENDING";

    if (paymentMethod === "COD") {
      status = "CONFIRMED";
      paymentStatus = "PENDING";
    }

    if (paymentMethod === "ONLINE") {
      status = "PENDING"; // waiting for payment
      paymentStatus = "PENDING";
    }

    // ==============================
    // 8️⃣ Create Order
    // ==============================
    const order = await Order.create({
      userId,
      resturantId,
      items: orderItems,
      subtotal,
      deliveryFee,
      platformFee,
      codFee,
      totalAmount,
      paymentMethod,
      paymentStatus,
      status,
      statusHistory: [
        {
          status,
        },
      ],
    });

    //  Publish Event (ONLY for COD)

    await publishOrderCreated({
      orderId: order._id,
      resturantId: order.resturantId,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMetshod,
    });

    return res.status(201).json(order);
  } catch (error) {
    console.log(error.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to create order",
    });
  }
};
export const getMyOrder = async (req, res) => {
  let order = await Order.find({ userId: req.user.authId }).sort({
    createdAt: -1,
  });
  return res.status(200).json(order);
};

export const getResturantOrder = async (req, res) => {
  try {
    if (req.user.role !== "resturant") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let status = req.query.status; // optional filter

    let skip = (page - 1) * limit;

    const resturantResponse = await axios.get(
      `${gatewayServer}/resturants/resturant/authId`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    let resturant = resturantResponse.data;

    // Build filter
    let filter = { resturantId: resturant._id };
    if (status) {
      filter.status = status;
    }

    // Get total count
    const totalOrders = await Order.countDocuments(filter);

    // Get paginated orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRiderOrders = async (req, res) => {
  try {
    if (req.user.role !== "rider") {
      console.log("Forbidden");
      return res.status(403).json({ message: "Forbidden" });
    }

    let riderResponse = await axios.get(`${gatewayServer}/riders/me`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    let rider = riderResponse.data;

    if (!rider) {
      console.log("Rider not found");
      return res.status(404).json({ message: "Rider not found" });
    }

    let riderOrders = await Order.find({
      riderId: rider._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(riderOrders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetOrderById = async (req, res) => {
  let { orderId } = req.params;

  let order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if (
    order.userId.toString() !== req.user.authId &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  return res.status(200).json(order);
};

export const changeOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (req.user.role !== "resturant") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // =========================
    // 1️⃣ Find Order
    // =========================
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // =========================
    // 2️⃣ Get Restaurant
    // =========================
    const resturantResponse = await axios.get(
      `${gatewayServer}/resturants/resturant/authId`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    const resturant = resturantResponse.data;

    if (!resturant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // =========================
    // 3️⃣ Verify Ownership
    // =========================
    if (order.resturantId.toString() !== resturant._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // =========================
    // 4️⃣ Allowed Status Transitions
    // =========================
    const allowedTransitions = {
      PENDING: ["CONFIRMED", "REJECTED"],
      CONFIRMED: ["PREPARING", "REJECTED"],
      PREPARING: ["READY_FOR_PICKUP"],
      READY_FOR_PICKUP: [],
    };

    if (!allowedTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        message: "Invalid status transition",
      });
    }

    // =========================
    // 5️⃣ Update Order Status
    // =========================
    order.status = status;

    order.statusHistory.push({
      status,
    });

    await order.save();

    // =========================
    // 6️⃣ Extract Restaurant Coordinates
    // =========================
    let restaurantLat = null;
    let restaurantLng = null;

    if (resturant.location?.coordinates) {
      restaurantLng = resturant.location.coordinates[0];
      restaurantLat = resturant.location.coordinates[1];
    }

    // =========================
    // 7️⃣ Publish Event
    // =========================
    await publishOrderStatusChange({
      orderId: order._id,
      resturantId: order.resturantId,
      userId: order.userId,
      status: order.status,
      totalAmount: order.totalAmount,
      restaurantLat,
      restaurantLng,
    });

    return res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const role = req.user.role;
    const authId = req.user.authId;

    if (role === "user") {
      if (order.userId.toString() !== authId) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    if (role === "resturant") {
      // Restaurant can cancel only its own order
      const resturantResponse = await axios.get(
        `${gatewayServer}/resturants/resturant/${authId}`,
      );
      let resturant = resturantResponse.data;

      if (!resturant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (order.resturantId.toString() !== resturant._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    if (!["user", "resturant"].includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 2 Status Validation

    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      return res.status(400).json({
        message: "Cannot cancel at this stage",
      });
    }

    //  Cancel Order

    order.status = "CANCELLED";
    await order.save();

    return res.status(200).json({
      message: "Order Cancelled Successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const paymentStatus = async (req, res) => {
  try {
    let { orderId } = req.params;
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order.paymentStatus);
  } catch (error) {
    console.log(error);
  }
};
