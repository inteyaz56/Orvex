import Menu from "../models/menu.model.js";
import Category from "../models/category.model.js";
import Resturant from "../models/resturant.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const addMenu = async (req, res) => {
  try {
    let resturant = await Resturant.findOne({ authId: req.user.authId });
    let id = resturant._id;

    if (!resturant.isApproved) {
      return res.status(401).json({ message: "Wait until verfication" });
    }

    let { categoryId, price, name, description } = req.body;

    if (!categoryId || !price || !name || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let isCategoryExist = await Category.findById(categoryId);

    if (!isCategoryExist) {
      return res.status(404).json({ message: "Invalid category" });
    }

    let isMenuExist = await Menu.findOne({ categoryId, name });

    if (isMenuExist) {
      return res.status(400).json({ message: "Menu already exist" });
    }

    let image;

    if (req.file) {
      let uploadImage = await uploadOnCloudinary(req.file.path);
      image = uploadImage;
    }
    const menu = await Menu.create({
      resturantId: id,
      categoryId,
      name,
      price,
      image,
      description,
    });

    return res.status(201).json(menu);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyMenu = async (req, res) => {
  try {
    let resturant = await Resturant.findOne({ authId: req.user.authId });
    let id = resturant._id;

    if (!resturant.isApproved) {
      return res.status(401).json({ message: "Wait until verfication" });
    }
    let menu = await Menu.find({ resturantId: id });
    return res.status(200).json(menu);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find({})
      .sort({ createdAt: -1 })
      .populate("resturantId")
      .populate("categoryId");
    return res.status(200).json(menu);
  } catch (error) {
    console.error("GET MENU ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch menu" });
  }
};

export const searchMenuItems = async (req, res) => {
  try {
    const { q } = req.query;

    const menuItems = await Menu.find({
      name: { $regex: q, $options: "i" },
    }).populate("resturantId");

    return res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMenuById = async (req, res) => {
  let { id } = req.params;
  let menu = await Menu.findById(id)
    .populate("resturantId")
    .populate("categoryId");
  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }

  return res.status(200).json(menu);
};
export const getMenuByResturant = async (req, res) => {
  let { id } = req.params;
  let menus = await Menu.find({ resturantId: id });
  if (!menus.length) {
    return res.status(404).json({ message: "No menu found" });
  }

  return res.status(200).json(menus);
};
export const validateMenus = async (req, res) => {
  try {
    const { menuIds } = req.body;

    if (!menuIds || menuIds.length === 0) {
      return res.status(400).json({ message: "menuIds required" });
    }

    const menus = await Menu.find({
      _id: { $in: menuIds },
    }).select("_id name price isAvailable resturantId");

    return res.status(200).json(menus);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getMenuByCategory = async (req, res) => {
  try {
    let { categoryId } = req.params;
    let menu = await Menu.find({ categoryId });
    return res.status(200).json(menu);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleMenu = async (req, res) => {
  let { menuId } = req.params;
  let menu = await Menu.findById(menuId);
  menu.isAvailable = !menu.isAvailable;
  await menu.save();
  return res.status(200).json(menu);
};

export const deleteMenu = async (req, res) => {
  let { menuId } = req.params;
  let menu = await Menu.findById(menuId);
  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }
  await Menu.findByIdAndDelete(menuId);

  return res.status(200).json({ message: "Menu deleted" });
};

const menuData = [
  {
    resturantId: "69ad26f4d1f37138b1f53d94",
    categoryId: "69ad2e45d1f37138b1f53f64",
    image:
      "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg",
    name: "Chicken Dum Biryani",
    description: "Traditional dum cooked chicken biryani with aromatic spices.",
    price: 240,
    isVeg: false,
    isAvailable: true,
  },
  {
    resturantId: "69ad26f4d1f37138b1f53d94",
    categoryId: "69ad2e45d1f37138b1f53f64",
    image: "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg",
    name: "Hyderabadi Chicken Biryani",
    description: "Authentic Hyderabadi style biryani cooked with rich spices.",
    price: 260,
    isVeg: false,
    isAvailable: true,
  },
  {
    resturantId: "69ad26f4d1f37138b1f53d94",
    categoryId: "69ad2e45d1f37138b1f53f64",
    image: "https://images.pexels.com/photos/9609844/pexels-photo-9609844.jpeg",
    name: "Mutton Biryani",
    description: "Fragrant basmati rice cooked with tender mutton pieces.",
    price: 300,
    isVeg: false,
    isAvailable: true,
  },
  {
    resturantId: "69ad26f4d1f37138b1f53d94",
    categoryId: "69ad2e45d1f37138b1f53f64",
    image: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg",
    name: "Egg Biryani",
    description: "Flavorful biryani cooked with boiled eggs and spices.",
    price: 190,
    isVeg: false,
    isAvailable: true,
  },
  {
    resturantId: "69ad26f4d1f37138b1f53d94",
    categoryId: "69ad2e45d1f37138b1f53f64",
    image: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg",
    name: "Lucknowi Biryani",
    description: "Awadhi style biryani known for its mild aromatic spices.",
    price: 250,
    isVeg: false,
    isAvailable: true,
  },
  {
    resturantId: "69ad26f4d1f37138b1f53d94",
    categoryId: "69ad2e45d1f37138b1f53f64",
    image: "https://images.pexels.com/photos/1860204/pexels-photo-1860204.jpeg",
    name: "Kolkata Chicken Biryani",
    description: "Kolkata style biryani served with potato and chicken.",
    price: 245,
    isVeg: false,
    isAvailable: true,
  },
  {
    resturantId: "69ad26f4d1f37138b1f53d94",
    categoryId: "69ad2e45d1f37138b1f53f64",
    image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg",
    name: "Boneless Chicken Biryani",
    description: "Delicious biryani made with tender boneless chicken.",
    price: 270,
    isVeg: false,
    isAvailable: true,
  },
  {
    resturantId: "69ad26f4d1f37138b1f53d94",
    categoryId: "69ad2e45d1f37138b1f53f64",
    image: "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg",
    name: "Spicy Chicken Biryani",
    description: "Hot and spicy biryani prepared with extra chili and masala.",
    price: 230,
    isVeg: false,
    isAvailable: true,
  },
  {
    resturantId: "69ad26f4d1f37138b1f53d94",
    categoryId: "69ad2e45d1f37138b1f53f64",
    image: "https://images.pexels.com/photos/8477354/pexels-photo-8477354.jpeg",
    name: "Special Chicken Biryani",
    description: "Chef special biryani loaded with chicken and herbs.",
    price: 275,
    isVeg: false,
    isAvailable: true,
  },
  {
    resturantId: "69ad26f4d1f37138b1f53d94",
    categoryId: "69ad2e45d1f37138b1f53f64",
    image: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg",
    name: "Family Pack Biryani",
    description: "Large portion biryani perfect for sharing with family.",
    price: 450,
    isVeg: false,
    isAvailable: true,
  },
];

const insertMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Menu.insertMany(menuData);

    console.log("Menu inserted successfully");

    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//insertMenu()
