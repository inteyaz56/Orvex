import React, { useEffect, useState } from "react";

import { FaBell } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { serverUrl } from "../main";
import { toast } from "react-toastify";
import { setProfile } from "../redux/slice/riderSlice"; // adjust path

const Popup = () => {
  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const [riderOrders, setRiderOrders] = useState([]);

  const token = localStorage.getItem("token");

  // 🔥 Fetch Profile
  const fetchProfile = async () => {
    try {
      const result = await axios.get(`${serverUrl}/riders/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setProfile(result.data));
    } catch (error) {
      console.log("Profile error:", error);
    }
  };

  const { profile } = useSelector((state) => state.rider);

  // 🔥 Fetch Orders
  const fetchMyOrders = async () => {
    if (profile?.isBusy) return;

    try {
      const result = await axios.get(`${serverUrl}/riders/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched Rider Orders:", result.data);
      setRiderOrders(result.data || []);
    } catch (error) {
      console.log("Order error:", error);
    }
  };

  useEffect(() => {
    fetchProfile();

    if (!profile?.isBusy) {
      fetchMyOrders();

      const interval = setInterval(() => {
        fetchMyOrders();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [profile?.isBusy]);

  // 🔥 Accept Order
  const handleAccept = async (orderId) => {
    try {
      let result = await axios.patch(
        `${serverUrl}/riders/accept`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(result.data);
      dispatch(setRiderOrders(result.data.rider));
      toast.success("Order Accepted 🚀");
      setRiderOrders([]);

      // refresh profile
      fetchProfile();
    } catch (error) {
      toast.error("Failed to accept order");
    }
  };

  // 🔥 Reject Order
  const handleReject = async (orderId) => {
    try {
      await axios.patch(
        `${serverUrl}/riders/reject`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Order Rejected");
      fetchMyOrders();
    } catch (error) {
      toast.error("Failed to reject order");
    }
  };

  return (
    <div>
      {riderOrders.length > 0 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              🚚 New Delivery Request
            </h2>

            <p>
              <strong>Order ID:</strong> {riderOrders[0]?.orderId}
            </p>

            <p>
              <strong>Total:</strong> ₹{riderOrders[0]?.totalAmount}
            </p>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => handleAccept(riderOrders[0]?.orderId)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Accept
              </button>

              <button
                onClick={() => handleReject(riderOrders[0]?.orderId)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
