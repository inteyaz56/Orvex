import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../dashboard/UserDashboard";
import AdminDashboard from "../dashboard/AdminDashboard";
import RiderDashboard from "../dashboard/RiderDashboard";
import ResturantDashboard from "../dashboard/ResturantDashboard";

const Home = () => {
  let { userData } = useSelector((state) => state.user);
  return (
    <div className="w-full flex flex-col gap-2 bg-gradient-to-br overflow-x-hidden from-[#f5ede4] to-[#f3e1d2] min-h-screen ">
      {userData?.role === "user" ? (
        <UserDashboard />
      ) : userData?.role === "admin" ? (
        <AdminDashboard />
      ) : userData?.role === "resturant" ? (
        <ResturantDashboard />
      ) : userData?.role === "rider" ? (
        <RiderDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
};

export default Home;
