import React, { useEffect, useState, useRef } from "react";

import { FaBell } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import MobileSidebar from "../AdminComponens/MobileSidebar";
import Sidebar from "../AdminComponens/Sidebar";
import {
  getApproveResturant,
  getApprovedRider,
  getPendingResturant,
  getPendingdRider,
} from "../hooks/adminHooks";
import { serverUrl } from "../main";

import { useSelector } from "react-redux";

import axios from "axios";
import Dashboard from "../AdminDashboard/Dashboard";
import Rider from "../AdminDashboard/Rider";
import Resturant from "../AdminDashboard/Resturant";

const AdminDashboard = () => {
  getApproveResturant();
  getApprovedRider();
  getPendingdRider();
  getPendingResturant();
  const [showMenu, setShowMenu] = useState(false);
  let { active } = useSelector((state) => state.user);

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
            <span className="text-sm font-medium text-gray-800">Admin</span>
            <p className="text-xs text-gray-500">Administrator</p>
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
          ) : active === "Riders" ? (
            <Rider />
          ) : active === "Resturant" ? (
            <Resturant />
          ) : (
            <Dashboard />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
