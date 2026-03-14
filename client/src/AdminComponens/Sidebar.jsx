import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setActive, setUserData } from "../redux/slice/userSlice";
import { MdDirectionsBike } from "react-icons/md";
import { FaHotel } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../main";

const Sidebar = () => {
  let [menu, setMenu] = useState("Dashboard");
  let dispatch = useDispatch();

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
            dispatch(setActive("Riders"));
            setMenu("Riders");
            dispatch(setActive("Riders"));
          }}
          className={`flex cursor-pointer items-center gap-3 w-full ${
            menu === "Riders" ? "bg-orange-500  text-white " : "text-black"
          } hover:text-white px-4 py-3 hover:bg-orange-500 font-semibold rounded-xl shadow-md`}
        >
          <div className="flex items-center gap-3">
            <MdDirectionsBike />
            <span>Riders</span>
          </div>
        </button>
      </div>

      {/* Profile */}
      <div className="mb-4">
        <button
          onClick={() => {
            setMenu("Resturant");
            dispatch(setActive("Resturant"));
          }}
          className={`flex items-center gap-3 w-full ${
            menu === "Resturant" ? "bg-orange-500 text-white " : "text-black"
          } text-black px-4 py-3 hover:bg-orange-500 hover:text-white font-semibold cursor-pointer rounded-xl shadow-md`}
        >
          <div
            onClick={() => {
              dispatch(setActive("Resturant"));
            }}
            className="flex items-center gap-3"
          >
            <FaHotel />
            <span>Resturant</span>
          </div>
        </button>
      </div>
      <div
        onClick={handleLogout}
        className="mb-4 fixed bottom-12 cursor-pointer bg-red-600 p-1.5 rounded text-white "
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
