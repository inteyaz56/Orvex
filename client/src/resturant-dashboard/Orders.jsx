import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../main";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const statusTabs = ["All Orders"];

const Orders = () => {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  const getResturantOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/orders/resturant/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
          status:
            activeTab !== "All Orders"
              ? encodeURIComponent(activeTab)
              : undefined,
        },
      });

      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResturantOrders();
  }, [page, activeTab]);

  // ✅ Status Badge Styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500 text-white";
      case "CONFIRMED":
        return "bg-green-500 text-white";
      case "Accepted":
        return "bg-green-600 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      case "Out for Delivery":
        return "bg-orange-500 text-white";
      case "Delivered":
        return "bg-green-700 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  // ✅ Pagination Handlers
  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={35} color="#f97316" />
      </div>
    );
  }

  const handleChangeStatus = async (orderId, status) => {
    try {
      let result = await axios.put(
        `${serverUrl}/orders/change/status`,
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Status updated");
      getResturantOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">
        Orders Dashboard
      </h1>
      <p className="text-gray-600 mb-6">Manage Your Restaurant's Orders</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1); // reset page when tab changes
            }}
            className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium shadow-sm ${
              activeTab === tab
                ? "bg-[#8b5e3c] text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-md overflow-auto bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f0e6dd] text-gray-700">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="p-4 font-medium">#{order._id.slice(-6)}</td>
                  <td className="p-4">{order.userName || "Customer"}</td>
                  <td className="p-4">{order.items?.length} Items</td>
                  <td className="p-4">₹{order.totalAmount?.toFixed(2)}</td>
                  <td className="p-4">{order.paymentMethod}</td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Action Dropdown */}
                  <td className="p-4">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        handleChangeStatus(order._id, e.target.value);
                        console.log(order._id, e.target.value);
                      }}
                      className="px-3 py-1 text-xs rounded-md border
                      bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="" disabled>
                        Change Status
                      </option>

                      {order.status === "PENDING" && (
                        <>
                          <option value="CONFIRMED">Confirm</option>
                          <option value="REJECTED">Reject</option>
                        </>
                      )}

                      {order.status === "CONFIRMED" && (
                        <>
                          <option value="PREPARING">Preparing</option>
                          <option value="REJECTED">Reject</option>
                        </>
                      )}

                      {order.status === "PREPARING" && (
                        <option value="READY_FOR_PICKUP">
                          Ready For Pickup
                        </option>
                      )}

                      {order.status === "OUT_FOR_DELIVERY" && (
                        <option value="DELIVERED">Deliverd</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-center items-center gap-6 p-4 bg-[#f8f4ef] text-sm">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className={` cursor-pointer ${
              page === 1 ? "text-gray-400" : "text-gray-700"
            }`}
          >
            &lt; Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`cursor-pointer ${
              page === totalPages ? "text-gray-400" : "text-gray-700"
            }`}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
