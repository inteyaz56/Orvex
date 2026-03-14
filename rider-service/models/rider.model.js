import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    name: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    profilePic: {
      type: String,
      default: "",
    },

    vehicle: {
      type: {
        type: String,
        enum: ["bike", "scooter", "car", "auto"],
        default: "bike",
      },
      model: {
        type: String,
        default: "",
      },
      numberPlate: {
        type: String,
        default: "",
      },
      color: {
        type: String,
        default: "",
      },
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    currentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isBusy: {
      type: Boolean,
      default: false,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true },
);

riderSchema.index({ location: "2dsphere" });

const Rider = mongoose.model("Rider", riderSchema);

export default Rider;
