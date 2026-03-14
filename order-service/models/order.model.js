import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    
    resturantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    items: [
      {
        menuId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        name: String,
        priceAtPurchase: Number,
      },
    ],

    subtotal: Number,
    deliveryFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    codFee: { type: Number, default: 0 },
    totalAmount: Number,

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        at: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "REJECTED",
        "PREPARING",
        "READY_FOR_PICKUP",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

orderSchema.index({ userId: 1 });
orderSchema.index({ resturantId: 1 });
orderSchema.index({ status: 1 });
const Order = mongoose.model("Order", orderSchema);
export default Order;
