import { useState } from "react";
import { FaHome, FaUser, FaClipboardList } from "react-icons/fa";
import { toast } from "react-toastify";
import { MdOutlineCategory, MdRestaurantMenu } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../main";

import { useDispatch } from "react-redux";
import { setActive, setUserData } from "../redux/slice/userSlice";
import { RiLogoutCircleLine } from "react-icons/ri";

const Sidebar = () => {
  let [menu, setMenu] = useState("Dashboard");
  let dispatch = useDispatch();

  let token = localStorage.getItem("token");

  const handleLogout = async () => {
    if (!token) return;
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

      {/* Categories */}
      <div className="mb-4">
        <button
          onClick={() => {
            setMenu("Category");
            dispatch(setActive("Category"));
          }}
          className={`flex items-center cursor-pointer gap-3 w-full ${
            menu === "Category" ? "bg-orange-500 text-white " : "text-black"
          } hover:text-white font-semibold px-4 py-3 hover:bg-orange-500 rounded-xl shadow-md`}
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
            setMenu("Menu");
            dispatch(setActive("Menu"));
          }}
          className={`flex items-center cursor-pointer gap-3 w-full ${
            menu === "Menu" ? "bg-orange-500  text-white " : "text-black"
          } hover:text-white px-4 py-3 hover:bg-orange-500 font-semibold rounded-xl shadow-md`}
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

export default Sidebar;
