import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    title: String,

    message: String,

    type: {
      type: String,
      enum: ["order", "payment", "system"],
      default: "order",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    meta: Object,
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
