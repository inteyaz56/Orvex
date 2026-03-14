import React, { act, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaBell } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { getProfile } from "../hooks/resturantHooks";
import { useSelector } from "react-redux";
import MobileSidebar from "../components/MobileSidebar";
import Profile from "../resturant-pages/Profile";
import Category from "../resturant-dashboard/Category";
import Dashboard from "../resturant-dashboard/Dashboard";
import Menu from "../resturant-dashboard/Menu";
import Orders from "../resturant-dashboard/Orders";

const ResturantDashboard = () => {
  getProfile();

  const [showMenu, setShowMenu] = useState(false);

  const { profile } = useSelector((state) => state.resturant);
  const { active } = useSelector((state) => state.user);

  return (
    <div className="h-screen flex flex-col ">
      {/* 🔥 HEADER */}
      <div className="w-full bg-[#f4ede6] h-[70px] shadow-sm border-b border-orange-100 flex items-center justify-between px-4 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-3xl lg:hidden"
          >
            <IoIosMenu />
          </button>

          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer">
            <FaBell className="text-xl text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-800">
              {profile?.owner || "Restaurant"}
            </span>
            <p className="text-xs text-gray-500">Owner</p>
          </div>
        </div>
      </div>

      {/* 🔥 BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-gradient-to-b from-[#f4ede6] to-[#e9dfd4] border-r overflow-y-auto">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar showMenu={showMenu} setShowMenu={setShowMenu} />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {active === "Dashboard" ? (
            <Dashboard />
          ) : active === "Profile" ? (
            <Profile />
          ) : active === "Category" ? (
            <Category />
          ) : active === "Menu" ? (
            <Menu />
          ) : active === "Orders" ? (
            <Orders />
          ) : (
            <Dashboard />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResturantDashboard;
