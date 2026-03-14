import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { serverUrl } from "./main";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Profile from "./pages/Profile";
import ItemDetails from "./pages/ItemDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import UpdateRestaurant from "./resturant-pages/UpdateResturant";

import AddMenu from "./resturant-pages/AddMenu";
import UpdateProfile from "./rider-page/UpdateProfile";
import { ToastContainer } from "react-toastify";

import socket from "./config/socket";
import { getCurrentUser } from "./hooks/allHooks";

// Firebase Push Notifications
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./config/firebase";
import axios from "axios";
import TrackOrder from "./pages/TrackOrder";
import Resturant from "./pages/Resturant";

import { getApproveResturant } from "./hooks/adminHooks";
import ResturantDetails from "./pages/ResturantDetails";
import AddCategory from "./resturant-dashboard/AddCategory";

const App = () => {
  const { userData } = useSelector((state) => state.user);

  getCurrentUser();
  getApproveResturant();

  useEffect(() => {
    if (!userData) return;

    socket.emit("join", userData._id);
  }, [userData]);

  // Request Notification Permission
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        // register service worker manually
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );

        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        let localToken = localStorage.getItem("token");
        await axios.post(
          `${serverUrl}/auth/save-fcm-token`,
          { token },
          {
            headers: {
              Authorization: `Bearer ${localToken}`,
            },
          },
        );
      }
    } catch (error) {}
  };

  // Setup notifications
  useEffect(() => {
    requestPermission();

    // Foreground notifications
    onMessage(messaging, (payload) => {
      console.log("Foreground notification:", payload);

      if (payload?.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/logo.png",
        });
      }
    });
  }, []);

  return (
    <div>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />

        <Route path="/verify/:email" element={<VerifyOtp />} />

        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Restaurant Routes */}

        <Route
          path="/update/resturant"
          element={
            userData && userData.role === "resturant" ? (
              <UpdateRestaurant />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/add/category"
          element={
            userData && userData.role === "resturant" ? (
              <AddCategory />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/add/menu"
          element={
            userData && userData.role === "resturant" ? (
              <AddMenu />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Food */}

        <Route path="/item/details/:id" element={<ItemDetails />} />

        <Route
          path="/cart"
          element={userData ? <Cart /> : <Navigate to="/login" />}
        />

        <Route
          path="/checkout"
          element={userData ? <Checkout /> : <Navigate to="/login" />}
        />

        <Route
          path="/orders"
          element={userData ? <Order /> : <Navigate to="/" />}
        />

        {/* Rider */}

        <Route
          path="/update/rider/profile"
          element={
            userData && userData.role === "rider" ? (
              <UpdateProfile />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/track-order/:orderId" element={<TrackOrder />} />
        <Route path="/resturants" element={<Resturant />} />
        <Route path="/restaurant/:id" element={<ResturantDetails />} />
      </Routes>
    </div>
  );
};

export default App;
