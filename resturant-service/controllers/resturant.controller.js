import Resturant from "../models/resturant.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

//If not created by event

export const createResturant = async (req, res) => {
  try {
    let { resturantName, owner, phone, address } = req.body;
    if (!resturantName || !owner || !phone || !address) {
      return res.status(500).json({ message: "All fields are required" });
    }
    let existingResturant = await Resturant.findOne({
      authId: req.user.authId,
    });

    if (!existingResturant) {
      return res.status(400).json({ message: "Resturant already exist" });
    }

    const resturant = await Resturant.create({
      authId: req.user.authId,
      resturantName,
      owner,
      phone,
      address,
    });

    return res
      .status(201)
      .json({ message: "Resturant created successfully", resturant });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const AllRestaurants = async (req, res) => {
  try {
    const restaurants = await Resturant.find({
      isApproved: true,
    }).select("-__v");

    return res.status(200).json(restaurants);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPendingResturants = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "Access denied" });
    }
    const restaurants = await Resturant.find({
      isApproved: false,
    });

    return res.status(200).json(restaurants);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      isApproved: true,
      restaurantName: { $regex: search, $options: "i" },
    };

    const restaurants = await Resturant.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-__v");

    const total = await Resturant.countDocuments(query);

    return res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      restaurants,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getMyResturant = async (req, res) => {
  try {
    const resturant = await Resturant.findOne({ authId: req.user.authId });
    if (!resturant) {
      return res.status(400).json({ message: "Resturant not exist" });
    }
    return res.status(200).json(resturant);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const searchRestaurant = async (req, res) => {
  try {
    const { q } = req.query;

    const resturants = await Resturant.find({
      resturantName: { $regex: q, $options: "i" },
    });

    if (!resturants.length) {
      return res.status(200).json({
        message: "No restaurant found",
        data: [],
      });
    }

    return res.status(200).json(resturants);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getResturantByAuthId = async (req, res) => {
  try {
    if (req.user.role !== "resturant") {
      return res.status(400).json({ message: "Forbidden" });
    }
    let resturant = await Resturant.findOne({ authId: req.user.authId });
    if (!resturant) {
      return res.status(400).json({ message: "No Resturant found" });
    }
    return res.status(200).json(resturant);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getResturanById = async (req, res) => {
  try {
    let { id } = req.params;
    let resturant = await Resturant.findById(id);
    if (!resturant) {
      return res.status(404).json({ message: "Resturant not found" });
    }
    return res.status(200).json(resturant);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const approveRestaurant = async (req, res) => {
  const { id } = req.params;

  const restaurant = await Resturant.findByIdAndUpdate(
    id,
    { isApproved: true },
    { returnDocument: "after" },
  );

  res.json(restaurant);
};

export const updateResturant = async (req, res) => {
  try {
    const {
      resturantName,
      owner,
      phone,
      address,
      openingTime,
      closingTime,
      latitude,
      longitude,
    } = req.body;

    let banner;

    if (req.file) {
      const uploadImage = await uploadOnCloudinary(req.file.path);
      banner = uploadImage;
    }

    const updateData = {
      resturantName,
      owner,
      phone,
      address,
      openingTime,
      closingTime,
    };

    // Add banner if uploaded
    if (banner) {
      updateData.banner = banner;
    }

    // 📍 Add restaurant location if provided
    if (latitude && longitude) {
      updateData.location = {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)], // [lng, lat]
      };
    }

    const resturant = await Resturant.findOneAndUpdate(
      { authId: req.user.authId },
      updateData,
      { new: true },
    );

    if (!resturant) {
      return res.status(404).json({ message: "Resturant not found" });
    }

    return res.status(200).json(resturant);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBanner = async () => {
  try {
    let banner;

    if (req.file) {
      const uploadImage = await uploadOnCloudinary(req.file.path);
      banner = uploadImage;
    }
    let resturant = await Resturant.findOneAndUpdate(
      { authId: req.user.authId },
      { banner: banner },
      { returnDocument: "after" },
    );

    return res.status(200).json({ message: "Banner added", resturant });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleResturant = async (req, res) => {
  let resturant = await Resturant.findOne({ authId: req.user.authId });
  resturant.isOpen = !resturant.isOpen;
  await resturant.save();
  return res.status(200).json({ message: "Resturant status change" });
};
