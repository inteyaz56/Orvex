import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const gatewayServer = process.env.GATEWAY_SERVER;

export const getAllPendingResturants = async (req, res) => {
  try {
    let resturantsResponse = await axios.get(
      `${gatewayServer}/resturants/pending/resturants`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    let resturants = resturantsResponse.data;
    if (!resturants.length) {
      return res.status(404).json({ message: "No pending resturant found" });
    }

    return res.status(200).json(resturants);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const approveRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.patch(
      `${gatewayServer}/resturants/approve/resturant/${id}`,
      {},
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    return res.status(200).json({
      message: "Resturant approved successfully",
      data: response.data,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "Failed to approve restaurant",
    });
  }
};

export const getAllPendingRiders = async (req, res) => {
  try {
    let riderResponse = await axios.get(
      `${gatewayServer}/riders/pending/riders`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    let riders = riderResponse.data;

    return res.status(200).json(riders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const approveRider = async (req, res) => {
  try {
    let { id } = req.params;
    let response = await axios.patch(
      `${gatewayServer}/riders/approve/${id}`,
      {},
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
