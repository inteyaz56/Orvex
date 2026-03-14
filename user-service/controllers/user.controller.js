import User from "../models/user.model.js";

//If user not created from event
export const createProfile = async (req, res) => {
  try {
    let { name, gender, phone } = req.body;

    const existingUser = await User.findOne({ authId: req.user.authId });
    if (!existingUser) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const user = await User.create({
      authId: req.user.authId,
      name,
      phone,
      gender,
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Get My Profile

export const getMyProfile = async (req, res) => {
  try {
    const { authId } = req.user;

    const user = await User.findOne({ authId });

    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Update Profile
export const updateMyProfile = async (req, res) => {
  try {
    let { name, phone } = req.body;

    const user = await User.findOneAndUpdate(
      {
        authId: req.user.authId,
      },
      { name, phone },
      { returnDocument: "after" },
    );
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
