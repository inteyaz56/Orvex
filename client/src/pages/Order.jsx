import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import { ClipLoader } from "react-spinners";

const Order = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/orders/my/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (error) {
  
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={30} color="#f97316" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600";
      case "PREPARING":
        return "text-blue-600";
      case "OUT_FOR_DELIVERY":
        return "text-orange-600";
      case "REJECTED":
        return "text-red-600";
      case "DELIVERED":
        return "text-green-700";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ede3] pb-10">
      {/* Navbar */}
      <div className="sticky top-0 bg-[#f5ede3] cursor-pointer border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")}>
          <IoArrowBack size={22} />
        </button>
        <h2 className="text-lg font-semibold">My Orders</h2>
      </div>

      <div className="p-4 space-y-5">
        {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}

        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow p-4">
            {/* Header */}
            <div className="flex justify-between mb-2">
              <span className="font-semibold">
                Order #{order._id.slice(-6)}
              </span>

              <span
                className={`text-sm font-medium ${getStatusColor(
                  order.status,
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="text-sm text-gray-600 space-y-1">
              {order.items.map((item) => (
                <p key={item.menuId}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            <hr className="my-3" />

            {/* Payment */}
            <div className="flex justify-between text-sm">
              <span>Payment</span>
              <span>
                {order.paymentMethod} ({order.paymentStatus})
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-orange-600 mt-2">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>

            {/* Time */}
            <div className="text-xs text-gray-400 mt-2">
              {new Date(order.createdAt).toLocaleString()}
            </div>

            {/* Track Order Button */}
            {order.status === "OUT_FOR_DELIVERY" && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => navigate(`/track-order/${order._id}`)}
                  className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg"
                >
                  Track Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
