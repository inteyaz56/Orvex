import React from "react";
import { FaSearch } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="bg-[#f6efe7] py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-10">
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-5xl font-bold text-gray-800 leading-tight">
            Delicious Food <br />
            Delivered To Your Door
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Order your favorite meals from the best restaurants near you. Fresh,
            fast and tasty — only on{" "}
            <span className="font-semibold">Orvex</span>.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-8 flex items-center bg-white shadow-md rounded-xl overflow-hidden max-w-lg">
            <input
              type="text"
              placeholder="Search for biryani, pizza, burger..."
              className="flex-1 px-4 py-3 outline-none"
            />

            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 text-white flex items-center gap-2">
              <FaSearch />
              Search
            </button>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow">
              Order Now
            </button>

            <button className="border border-orange-500 text-orange-500 px-6 py-3 rounded-lg hover:bg-orange-50">
              Explore Menu
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
            alt="food"
            className="rounded-3xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
