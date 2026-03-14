import Category from "../models/category.model.js";
import Resturant from "../models/resturant.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

export const createCategory = async (req, res) => {
  try {
    let { name, description } = req.body;
    let resturant = await Resturant.findOne({ authId: req.user.authId });
    let Id = resturant._id;

    if (!resturant.isApproved) {
      return res.status(401).json({ message: "Wait until verfication" });
    }
    let isCategoryExist = await Category.findOne({ name, Id });
    if (isCategoryExist) {
      return res.status(400).json({ message: "Category already exist" });
    }

    let image;
    if (req.file) {
      let uploadImage = await uploadOnCloudinary(req.file.path);
      image = uploadImage;
    }
    const category = await Category.create({
      resturantId: Id,
      name,
      image,
      description,
    });
    return res.status(201).json(category);
  } catch (error) {
    console.log(error);
  }
};

export const getMyCategory = async (req, res) => {
  try {
    let resturant = await Resturant.findOne({ authId: req.user.authId });
    let id = resturant._id;

    if (!resturant.isApproved) {
      return res.status(401).json({ message: "Wait until verfication" });
    }

    const category = await Category.find({
      resturantId: id,
    });

    return res.status(200).json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const allCategory = async (req, res) => {
  const category = await Category.find({});
  return res.status(200).json(category);
};

export const categoryById = async (req, res) => {
  let { id } = req.params;
  let category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res.status(200).json(category);
};

export const toggleCategory = async (req, res) => {
  let { id } = req.params;
  let category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  category.isActive = !category.isActive;
  await category.save();

  return res.status(200).json({ message: "Category status change" });
};
