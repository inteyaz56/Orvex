import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    resturantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resturant",
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    isVeg: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
