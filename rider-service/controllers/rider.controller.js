import Rider from "../models/rider.model.js";
import { getChannel } from "../config/rabbitmq.js";
import AvailableOrder from "../models/available.order.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

export const createRider = async (req, res) => {
  try {
    const { name, phone, profilePic } = req.body;

    const existing = await Rider.findOne({ authId: req.user.authId });
    if (existing) {
      return res.status(400).json({ message: "Rider already exists" });
    }

    const rider = await Rider.create({
      authId: req.user.authId,
      name,
      phone,
      profilePic,
    });

    return res.status(201).json(rider);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const myProfile = async (req, res) => {
  const profile = await Rider.findOne({ authId: req.user.authId });
  return res.status(200).json(profile);
};

export const getPendingRiders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "Access Denied" });
    }

    let riders = await Rider.find({ isApproved: false });

    if (!riders.length) {
      return res.status(404).json({ message: "No pending riders found" });
    }

    return res.status(200).json(riders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllRiders = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Access denied" });
  }
  let rider = await Rider.find({ isApproved: true });
  return res.status(200).json(rider);
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    // 🔥 Parse vehicle safely
    let vehicle;
    if (req.body.vehicle) {
      vehicle = JSON.parse(req.body.vehicle);
    }

    let profilePic;

    if (req.file) {
      const uploadImage = await uploadOnCloudinary(req.file.path);
      profilePic = uploadImage; // use secure_url
    }

    const rider = await Rider.findOne({ authId: req.user.authId });
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    const updateData = {
      name,
      phone,
    };

    if (profilePic) updateData.profilePic = profilePic;
    if (vehicle) updateData.vehicle = vehicle;

    const updatedRider = await Rider.findOneAndUpdate(
      { authId: req.user.authId },
      updateData,
      { new: true }, // ✅ use new: true
    );

    return res.status(200).json(updatedRider);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRiderById = async (req, res) => {
  let { id } = req.params;
  let rider = await Rider.findById(id);
  if (!rider) {
    return res.status(404).json({ message: "Rider not found" });
  }

  return res.status(200).json(rider);
};

export const approveRider = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "Access Denied" });
    }

    let { id } = req.params;

    let rider = await Rider.findByIdAndUpdate(
      id,
      { isApproved: true },
      { returnDocument: "after" },
    );

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    return res.status(200).json(rider);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const changeStatus = async (req, res) => {
  try {
    const rider = await Rider.findOne({ authId: req.user.authId });

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    rider.isAvailable = !rider.isAvailable;
    await rider.save();

    return res.status(200).json({
      message: "Status updated",
      isAvailable: rider.isAvailable,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const rider = await Rider.findOne({ authId: req.user.authId });

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    rider.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    await rider.save();

    if (global.io) {
      global.io.emit("rider_location_updated", {
        riderId: rider._id,
        latitude,
        longitude,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location: rider.location,
    });
  } catch (error) {
    console.error("Location update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update location",
    });
  }
};

export const getAvailableOrders = async (req, res) => {
  try {
    const availableOrders = await AvailableOrder.find({
      riderId: null,
    });

    let rider = await Rider.findOne({ authId: req.user.authId });

    return res.status(200).json(availableOrders || []);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAvailableRiders = async (req, res) => {
  let riders = await Rider.find({ isAvailable: true, isBusy: false });
  return res.status(200).json(riders);
};

export const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const rider = await Rider.findOne({ authId: req.user.authId });

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    if (rider.isBusy) {
      return res.status(400).json({ message: "Rider already busy" });
    }

    const availableOrder = await AvailableOrder.findOneAndUpdate(
      { orderId, riderId: null },
      { riderId: rider._id },
      { new: true },
    );

    if (!availableOrder) {
      return res.status(400).json({ message: "Order already accepted" });
    }

    const updatedRider = await Rider.findByIdAndUpdate(
      rider._id,
      {
        currentOrderId: orderId,
        isBusy: true,
        isAvailable: false,
      },
      { returnDocument: "after" },
    );

    await AvailableOrder.deleteOne({ _id: availableOrder._id });

    const channel = getChannel();
    channel.publish(
      "order.exchange",
      "order.assigned",
      Buffer.from(
        JSON.stringify({
          orderId,
          riderId: rider._id,
        }),
      ),
    );

    return res.status(200).json({
      message: "Order accepted successfully",
      rider: updatedRider,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /riders/reject-order
export const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const rider = await Rider.findOne({ authId: req.user.authId });

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    await AvailableOrder.deleteOne({
      orderId,
      riderId: rider._id,
    });

    return res.status(200).json({
      message: "Order rejected",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const completeOrder = async (req, res) => {
  try {
    const channel = getChannel();

    const rider = await Rider.findOne({ authId: req.user.authId });

    if (!rider || !rider.currentOrderId) {
      return res.status(400).json({
        message: "No active order",
      });
    }

    const orderId = rider.currentOrderId;

    // reset rider
    rider.isBusy = false;
    rider.isAvailable = true;
    rider.currentOrderId = null;
    await rider.save();

    channel.publish(
      "order.exchange",
      "order.delivered",
      Buffer.from(
        JSON.stringify({
          orderId,
          riderId: rider._id,
        }),
      ),
      { persistent: true },
    );

    return res.status(200).json({
      message: "Order completed",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
