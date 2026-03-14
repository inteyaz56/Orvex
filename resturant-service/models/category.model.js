import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  resturantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Resturant",
  },

  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
