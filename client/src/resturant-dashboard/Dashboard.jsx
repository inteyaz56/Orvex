import { ReceiptText, ClipboardList, Hourglass, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../main";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(20);

  const token = localStorage.getItem("token");

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: <ReceiptText size={28} className="text-orange-500" />,
      highlight: true,
    },
    {
      title: "Today's Orders",
      value: orders.length,
      icon: <ClipboardList size={28} className="text-orange-500" />,
    },
    {
      title: "Pending Orders",
      value: orders.filter((o) => o.status === "Pending").length,
      icon: <Hourglass size={28} className="text-orange-500" />,
    },
    {
      title: "Total Menu",
      value: 25,
      icon: <BookOpen size={28} className="text-orange-500" />,
    },
  ];

  const getResturantOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${serverUrl}/orders/resturant/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
        },
      });

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResturantOrders();
  }, []);

  return (
    <div className="space-y-6 bg-[#efe6dd] min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl shadow-sm flex items-center justify-between ${
              stat.highlight ? "bg-orange-200" : "bg-[#f7efe7]"
            }`}
          >
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <h2 className="text-3xl font-bold text-gray-700">{stat.value}</h2>
            </div>

            <div className="bg-white/60 p-3 rounded-lg">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div className="bg-[#f7efe7] rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Orders
        </h2>

        {loading && <p className="text-gray-500">Loading orders...</p>}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3">Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4 font-medium text-gray-700">
                    {order._id?.slice(-4)}
                  </td>

                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-300 rounded-full"></div>
                      {order.customerName || "Customer"}
                    </div>
                  </td>

                  <td className="text-gray-600">
                    {order.items?.map((i) => i.name).join(", ")}
                  </td>

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
          {orders.map((order, index) => (
            <div key={index} className="bg-white/40 rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-700">
                  #{order._id?.slice(-4)}
                </p>

                <StatusBadge status={order.status} />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-300 rounded-full"></div>

                <p className="font-medium">
                  {order.customerName || "Customer"}
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                {order.items?.map((i) => i.name).join(", ")}
              </p>

              <p className="font-semibold">₹{order.totalAmount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === "Pending")
    return (
      <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs">
        Pending
      </span>
    );

  if (status === "Preparing")
    return (
      <span className="bg-gray-200 px-3 py-1 rounded-lg text-xs">
        Preparing
      </span>
    );

  if (status === "Ready")
    return (
      <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs">
        Ready
      </span>
    );

  return (
    <span className="bg-gray-300 px-3 py-1 rounded-lg text-xs">Picked</span>
  );
};

export default Dashboard;
