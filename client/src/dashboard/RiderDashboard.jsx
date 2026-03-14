import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../rider-components/Sidebar";
import { FaBell } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import MobileSidebar from "../rider-components/MobileSidebar";
import Profile from "../rider-page/Profile";
import { serverUrl } from "../main";
import socket from "../config/socket";
import Popup from "../rider-page/Popup";
import { useSelector } from "react-redux";
import Dashboard from "../rider-dashboard/Dashboard";
import Order from "../rider-dashboard/Order";
import axios from "axios";

const RiderDashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const activeOrderRef = useRef(null); // ✅ FIX: inside component

  let { active } = useSelector((state) => state.user);
  let { profile } = useSelector((state) => state.rider);

  const token = localStorage.getItem("token");

  // Update active order
  useEffect(() => {
    if (profile?.currentOrderId) {
      setActiveOrderId(profile.currentOrderId);
      activeOrderRef.current = profile.currentOrderId;
    }

    console.log("Current order from profile:", profile?.currentOrderId);
  }, [profile]);

  // Join rider socket room
  useEffect(() => {
    if (profile?._id) {
      socket.emit("join_rider_room", profile._id);
    }
  }, [profile]);

  // Send rider GPS location
  const sendRiderLocation = () => {
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            const result = await axios.post(
              `${serverUrl}/riders/location`,
              { latitude, longitude },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            console.log("Location updated:", result.data);

            if (activeOrderRef.current) {
              socket.emit("rider_location_update", {
                orderId: activeOrderRef.current,
                latitude,
                longitude,
              });
            }
          } catch (err) {
            console.log("API Error:", err);
          }
        },
        (error) => {
          console.log("GPS Error:", error);
        },
        {
          enableHighAccuracy: true,
        },
      );
    }, 5000);

    return intervalId;
  };

  // Start GPS tracking
  useEffect(() => {
    const intervalId = sendRiderLocation();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="w-full bg-[#f4ede6] h-[70px] shadow-sm border-b border-orange-100 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-3xl cursor-pointer lg:hidden"
          >
            <IoIosMenu />
          </button>

          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer">
            <FaBell className="text-xl text-gray-700" />
          </div>

          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-800">Rider</span>
            <p className="text-xs text-gray-500">Owner</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block w-64 bg-gradient-to-b from-[#f4ede6] to-[#e9dfd4] border-r overflow-y-auto">
          <Sidebar />
        </div>

        <MobileSidebar showMenu={showMenu} setShowMenu={setShowMenu} />

        <div className="flex-1 overflow-y-auto p-6 relative">
          {active === "Dashboard" ? (
            <Dashboard />
          ) : active === "Profile" ? (
            <Profile />
          ) : active === "Orders" ? (
            <Order />
          ) : (
            <Dashboard />
          )}

          <Popup />
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
