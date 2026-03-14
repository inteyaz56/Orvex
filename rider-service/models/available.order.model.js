import mongoose from "mongoose";

const availableOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    resturantId: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "READY_FOR_PICKUP",
    },

    assignedRiderId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const AvailableOrder = mongoose.model("AvailableOrder", availableOrderSchema);

export default AvailableOrder;
