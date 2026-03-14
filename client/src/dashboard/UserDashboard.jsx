import React from "react";
import Navbar from "../components/Navbar";
import { getMyProfile, getMyAddress } from "../hooks/allHooks";

import { getAllMenu } from "../hooks/resturantHooks";
import Trending from "../components/Treding";
import FastFood from "../components/FastFood";
import Biryani from "../components/Biryani";
import Pizzas from "../components/Pizza";
import Burger from "../components/Burger";
import Footer from "../pages/Footer";
import Hero from "../components/Hero";

const UserDashboard = () => {
  getMyProfile();
  getMyAddress();
  getAllMenu();

  return (
    <div className="flex pt-20 flex-col gap-2 pb-24  ">
      <Navbar />
      <Hero />
      <Trending />
      <FastFood />
      <Biryani />
      <Pizzas />
      <Burger />
      <Footer />
    </div>
  );
};

export default UserDashboard;
