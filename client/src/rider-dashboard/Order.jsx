import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaStore } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../main";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const Order = () => {
  const [riderOrders, setRiderOrders] = useState([]);
  let [riderLoading, setRiderLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const getRiderOrders = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${serverUrl}/orders/rider/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRiderOrders(result.data || []);
    } catch (error) {
      console.log("Order fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRiderOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={35} color="#f97316" />
      </div>
    );
  }

  if (!loading && riderOrders.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No active orders
      </div>
    );
  }

  const completeOrder = async () => {
    setRiderLoading(true);
    try {
      let result = await axios.patch(
        `${serverUrl}/riders/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(result.data.message || "Order marked as completed");
      getRiderOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete order");
      console.log("Complete order error:", error);
    } finally {
      setRiderLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row gap-4 flex-wrap  items-start">
        {riderOrders.map((order) => (
          <div
            key={order._id}
            className="w-full max-w-[600px] rounded-3xl shadow-xl overflow-hidden bg-white"
          >
            {/* Header */}
            <div className="bg-orange-500 text-white p-5">
              <h2 className="text-lg font-semibold">
                🚚 Order #{order._id.slice(-6)}
              </h2>

              <p className="text-sm opacity-90">Status: {order.status}</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Restaurant */}
              <div className="flex items-start gap-3">
                <FaStore className="text-orange-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Restaurant ID</p>
                  <p className="font-semibold text-gray-800">
                    {order.restaurantId}
                  </p>
                </div>
              </div>

              {/* Ordered Items */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Ordered Items</p>

                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm border-b py-2"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span className="font-medium">₹{item.priceAtPurchase}</span>
                  </div>
                ))}
              </div>

              {/* Address Placeholder */}
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-orange-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Delivery</p>
                  <p className="text-gray-700 text-sm">
                    Customer location will appear here
                  </p>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-[#f4ede6] p-4 rounded-2xl text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{order.deliveryFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{order.platformFee}</span>
                </div>

                <div className="flex justify-between font-semibold text-base pt-2">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Payment: {order.paymentMethod}
                </span>

                <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                  {order.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {order.status === "READY_FOR_PICKUP" && (
                  <button className="w-full cursor-pointer bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600">
                    Mark as Picked Up
                  </button>
                )}

                {order.status === "OUT_FOR_DELIVERY" && (
                  <button
                    disabled={riderLoading}
                    onClick={completeOrder}
                    className="w-full cursor-pointer bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600"
                  >
                    {riderLoading ? "Saving..." : "  Mark as Delivered"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
