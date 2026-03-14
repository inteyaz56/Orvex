import { useState } from "react";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaStar,
  FaChartBar,
} from "react-icons/fa";
import { MdOutlineCategory, MdRestaurantMenu } from "react-icons/md";

import { useDispatch } from "react-redux";
import { setActive } from "../redux/slice/userSlice";

const Sidebar = () => {
  let [menu, setMenu] = useState("Dashboard");
  let dispatch = useDispatch();
  return (
    <div className="w-64 h-screen hidden lg:block overflow-auto fixed left-0  bg-gradient-to-b from-[#f4ede6] to-[#e9dfd4] shadow-lg p-5">
      {/* Dashboard */}
      <div className="mb-4">
        <button
          onClick={() => {
            setMenu("Dashboard");
            dispatch(setActive("Dashboard"));
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
            setMenu("Orders");
            dispatch(setActive("Orders"));
          }}
          className={`flex cursor-pointer items-center gap-3 w-full ${
            menu === "Orders" ? "bg-orange-500  text-white " : "text-black"
          } hover:text-white px-4 py-3 hover:bg-orange-500 font-semibold rounded-xl shadow-md`}
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
            setMenu("Profile");
            dispatch(setActive("Profile"));
          }}
          className={`flex items-center gap-3 w-full ${
            menu === "Profile" ? "bg-orange-500 text-white " : "text-black"
          } text-black px-4 py-3 hover:bg-orange-500 hover:text-white font-semibold cursor-pointer rounded-xl shadow-md`}
        >
          <div
            onClick={() => {
              dispatch(setActive("Profile"));
            }}
            className="flex items-center gap-3"
          >
            <FaUser />
            <span>Profile</span>
          </div>
        </button>
      </div>
      {/* Other Links */}
    </div>
  );
};

export default Sidebar;
