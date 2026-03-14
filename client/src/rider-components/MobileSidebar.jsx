import { useState } from "react";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaStar,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import { MdOutlineCategory, MdRestaurantMenu } from "react-icons/md";

import { useDispatch } from "react-redux";
import { setActive } from "../redux/slice/userSlice";

const MobileSidebar = ({ showMenu, setShowMenu }) => {
  let dispatch = useDispatch();
  let [menu, setMenu] = useState("Dashboard");
  if (!showMenu) return;

  return (
    <div className="w-[90%] h-screen z-50 lg:hidden block overflow-auto fixed left-0  bg-gradient-to-b from-[#f4ede6] to-[#e9dfd4] shadow-lg p-5">
      {/* Dashboard */}
      <div className="mb-4">
        <button
          onClick={() => {
            dispatch(setActive("Dashboard"));
            setShowMenu(false);
            setMenu("Dashboard");
          }}
          className={`flex items-center gap-3 cursor-pointer w-full ${
            menu === "Dashboard" ? "bg-orange-500 text-white" : "text-black"
          } hover:text-white px-4 py-3 hover:bg-orange-500 rounded-xl shadow-md`}
        >
          <FaHome />
          <span className="font-medium">Dashboard</span>
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => {
            dispatch(setActive("Orders"));
            setShowMenu(false);
            setMenu("Orders");
          }}
          className={`flex items-center gap-3 cursor-pointer w-full ${
            menu === "Orders" ? "bg-orange-500 text-white" : "text-black"
          } hover:text-white px-4 py-3 hover:bg-orange-500 rounded-xl shadow-md`}
        >
          <div className="flex items-center gap-3">
            <FaClipboardList />
            <span>Orders</span>
          </div>
        </button>
      </div>

      {/* Profile */}
      <div className="mb-4">
        <button
          onClick={() => {
            setShowMenu(false);
            dispatch(setActive("Profile"));
            setMenu("Profile");
          }}
          className={`flex items-center gap-3 cursor-pointer w-full ${
            menu === "Profile" ? "bg-orange-500 text-white" : "text-black"
          } hover:text-white px-4 py-3 hover:bg-orange-500 rounded-xl shadow-md`}
        >
          <div className="flex items-center gap-3">
            <FaUser />
            <span>Profile</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MobileSidebar;
