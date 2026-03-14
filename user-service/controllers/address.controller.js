import Address from "../models/address.model.js";
import User from "../models/user.model.js";

export const addAddress = async (req, res) => {
  try {
    let user = await User.findOne({ authId: req.user.authId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let {
      city,
      label,
      addressLine,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    const address = await Address.create({
      userId: user._id,
      city,
      label,
      addressLine,
      state,
      pincode,
      latitude,
      longitude,
    });

    return res.status(201).json(address);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAddress = async (req, res) => {
  try {
    let user = await User.findOne({ authId: req.user.authId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let address = await Address.findOne({ userId: user._id });
    return res.status(200).json(address);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    let { id } = req.params;
    const address = await Address.findByIdAndDelete(id);
    if (!address) {
      return res.status(500).json({ message: "Address deleted" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
