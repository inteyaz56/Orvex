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

import { serverUrl } from "../main";

import { useDispatch } from "react-redux";
import { setActive, setUserData } from "../redux/slice/userSlice";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";

const MobileSidebar = ({ showMenu, setShowMenu }) => {
  let dispatch = useDispatch();
  let [menu, setMenu] = useState("Dashboard");
  if (!showMenu) return;

  let token = localStorage.getItem("token");
  const handleLogout = async () => {
    await axios.get(`${serverUrl}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Logout success");
    dispatch(setUserData(null));
    localStorage.removeItem("token");
    navigate("/");
  };

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

      {/* Categories */}
      <div className="mb-4">
        <button
          onClick={() => {
            setShowMenu(false);
            dispatch(setActive("Category"));
            setMenu("Category");
          }}
          className={`flex items-center gap-3 cursor-pointer w-full ${
            menu === "Category" ? "bg-orange-500 text-white" : "text-black"
          } hover:text-white px-4 py-3 hover:bg-orange-500 rounded-xl shadow-md`}
        >
          <div className="flex cursor-pointer items-center gap-3">
            <MdOutlineCategory />
            <span>Categories</span>
          </div>
        </button>
      </div>

      {/* Menu Items */}
      <div className="mb-4">
        <button
          onClick={() => {
            dispatch(setActive("Menu"));
            setShowMenu(false);
            setMenu("Menu");
          }}
          className={`flex items-center gap-3 cursor-pointer w-full ${
            menu === "Menu" ? "bg-orange-500 text-white" : "text-black"
          } hover:text-white px-4 py-3 hover:bg-orange-500 rounded-xl shadow-md`}
        >
          <div className="flex items-center gap-3">
            <MdRestaurantMenu />
            <span>Menu Items</span>
          </div>
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

      <div
        onClick={handleLogout}
        className="mb-4 fixed bottom-12 cursor-pointer bg-red-600 p-3 rounded text-white "
      >
        <button className="">
          <div className="flex text-xl cursor-pointer  font-semibold items-center gap-3">
            <RiLogoutCircleLine />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MobileSidebar;
