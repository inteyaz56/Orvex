import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import socket from "../config/socket";

import { IoNotifications } from "react-icons/io5";
import { IoMdCart } from "react-icons/io";
import { IoIosMenu } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { HiClipboardList } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { RiHotelFill } from "react-icons/ri";
import { getNotifications, getNotificationsCount } from "../hooks/allHooks";
import { addNotification } from "../redux/slice/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData, notifications, count } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  const [showNotifications, setShowNotifications] = useState(false);

  // fetch notifications once

  getNotifications();
  getNotificationsCount();

  // join socket room
  useEffect(() => {
    if (!userData) return;

    socket.emit("join", userData._id);
  }, [userData]);

  // listen for realtime notifications
  useEffect(() => {
    socket.on("new_notification", (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.off("new_notification");
    };
  }, [dispatch]);

  return (
    <div className="w-[100%] h-[70px] flex-col z-40 shadow-lg bg-white flex justify-between fixed top-0">
      {/* TOP NAVBAR */}
      <div className="flex items-center px-2 lg:px-8 w-[100%] h-[100%] justify-between">
        <div className="flex items-center gap-2">
          <h1
            onClick={() => navigate("/")}
            className="cursor-pointer text-orange-600 text-2xl font-semibold"
          >
            Orvex
          </h1>
        </div>

        <div className="flex gap-5 items-center">
          {userData && (
            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold">Hi, {userData?.name}</h1>
            </div>
          )}

          {/* NOTIFICATION */}
          <div className="flex gap-2 relative items-center">
            <button
              onClick={() => setShowNotifications(true)}
              className="cursor-pointer text-orange-400"
            >
              <IoNotifications size={25} />
            </button>

            <span className="w-4 h-4 text-xs absolute -right-1.5 -top-1.5 flex items-center text-white justify-center rounded-full bg-orange-600">
              {count > 99 ? "99+" : count}
            </span>
          </div>

          <div className="flex gap-2 relative items-center">
            <button
              onClick={() => {
                navigate("/resturants");
              }}
              className="cursor-pointer text-orange-400"
            >
              <RiHotelFill size={28} />
            </button>
          </div>

          {/* CART */}
          <div className="flex gap-2 relative items-center">
            <button
              onClick={() => {
                navigate("/cart");
                setShowNotifications(false);
              }}
              className="cursor-pointer text-orange-400"
            >
              <IoMdCart size={25} />
            </button>

            <span className="w-4 h-4 text-xs absolute -right-1.5 -top-1.5 flex items-center text-white justify-center rounded-full bg-orange-600">
              {items?.length || 0}
            </span>
          </div>

          {/* PROFILE */}
          <div className="flex gap-2 relative items-center">
            <button
              onClick={() => {
                if (userData) navigate("/profile");
                else navigate("/login");
              }}
              className="cursor-pointer text-orange-400"
            >
              <FaUser size={25} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="w-[100%] h-[70px] shadow-lg justify-between px-2 lg:hidden flex items-center bg-white fixed bottom-0">
        <div
          onClick={() => navigate("/")}
          className="flex flex-col rounded p-1 cursor-pointer justify-center items-center"
        >
          <button className="text-orange-400 cursor-pointer ">
            <FaHome size={30} />
          </button>
          <h1 className="text-gray-600 font-semibold text-lg">Home</h1>
        </div>

        <div
          onClick={() => navigate("/resturants")}
          className="flex flex-col rounded p-1 cursor-pointer justify-center items-center"
        >
          <button className="text-orange-400 ">
            <RiHotelFill size={32} />
          </button>
          <h1 className="text-gray-600 font-semibold text-lg">Resturants</h1>
        </div>
        <div
          onClick={() => navigate("/orders")}
          className="flex flex-col rounded p-1 cursor-pointer justify-center items-center"
        >
          <button className="text-orange-400">
            <HiClipboardList size={32} />
          </button>
          <h1 className="text-gray-600 font-semibold text-lg">Orders</h1>
        </div>

        <div
          onClick={() => navigate("/profile")}
          className="flex flex-col rounded p-1 cursor-pointer justify-center items-center"
        >
          <button className="text-orange-400">
            <FaUser size={30} />
          </button>
          <h1 className="text-gray-600 font-semibold text-lg">Profile</h1>
        </div>
      </div>

      {/* NOTIFICATION DROPDOWN */}
      {showNotifications && (
        <div className="w-[250px] rounded flex flex-col gap-1 shadow-lg shadow-black bg-gradient-to-br from-[#f5ede4] to-[#f3e1d2] h-[200px] p-3 fixed right-2.5 top-18">
          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">Notifications</h1>

            <button
              onClick={() => setShowNotifications(false)}
              className="cursor-pointer"
            >
              <ImCross size={14} />
            </button>
          </div>

          <div className="flex flex-col overflow-auto">
            {notifications?.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="border-b cursor-pointer flex flex-col gap-1 border-gray-300"
                >
                  <p>{notification.title}</p>
                  <p>{notification.message}</p>

                  <p className="text-xs text-gray-500">
                    {new Date(notification.updatedAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No notifications available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
