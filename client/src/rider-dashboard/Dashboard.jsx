import { Bike, ClipboardList, Hourglass } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../main";
import { ClipLoader } from "react-spinners";

const Dashboard = () => {
  const [riderOrders, setRiderOrders] = useState([]);
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

  /* ---------- Stats Calculation ---------- */

  const totalDeliveries = riderOrders.length;

  const todayDeliveries = riderOrders.filter((order) => {
    const today = new Date().toDateString();
    return new Date(order.createdAt).toDateString() === today;
  }).length;

  const pendingDeliveries = riderOrders.filter(
    (order) => order.status !== "DELIVERED",
  ).length;

  const stats = [
    {
      title: "Total Deliveries",
      value: totalDeliveries,
      icon: <Bike size={26} className="text-orange-500" />,
    },
    {
      title: "Today's Deliveries",
      value: todayDeliveries,
      icon: <ClipboardList size={26} className="text-orange-500" />,
    },
    {
      title: "Pending Deliveries",
      value: pendingDeliveries,
      icon: <Hourglass size={26} className="text-orange-500" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={35} color="#f97316" />
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#f7efe7] p-5 rounded-xl shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <h2 className="text-3xl font-bold text-gray-700">{stat.value}</h2>
            </div>

            <div className="bg-white/60 p-3 rounded-lg">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Deliveries */}
      <div className="bg-[#f7efe7] rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Deliveries
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3">Delivery ID</th>
                <th>Restaurant</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {riderOrders.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4 font-medium text-gray-700">
                    #{order._id.slice(-4)}
                  </td>

                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-300 rounded-full"></div>
                      {order.resturantId?.slice(-6) || "Restaurant"}
                    </div>
                  </td>

                  <td className="text-gray-600">{order.items?.length} item</td>

                  <td className="font-medium">₹{order.totalAmount}</td>

                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {riderOrders.map((order, index) => (
            <div key={index} className="bg-white/40 rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-700">
                  #{order._id.slice(-4)}
                </p>

                <StatusBadge status={order.status} />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-300 rounded-full"></div>

                <p className="font-medium">
                  {order.resturantId?.slice(-6) || "Restaurant"}
                </p>
              </div>

              <p className="text-sm text-gray-600">
                {order.items?.length} item
              </p>

              <p className="font-semibold mt-1">₹{order.totalAmount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === "DELIVERED")
    return (
      <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs">
        Delivered
      </span>
    );

  if (status === "OUT_FOR_DELIVERY")
    return (
      <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs">
        Out For Delivery
      </span>
    );

  return (
    <span className="bg-gray-300 px-3 py-1 rounded-lg text-xs">{status}</span>
  );
};

export default Dashboard;
