import mongoose from "mongoose";

const resturantSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },

    resturantName: {
      type: String,
      default: "",
    },

    owner: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    cuisineType: {
      type: String,
      default: "",
    },

    openingTime: {
      type: String,
      default: "",
    },

    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      pincode: { type: String, default: "" },
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

    closingTime: {
      type: String,
      default: "",
    },

    isOpen: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

resturantSchema.index({ location: "2dsphere" });

const Resturant = mongoose.model("Resturant", resturantSchema);

export default Resturant;
