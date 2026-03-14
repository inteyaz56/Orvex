import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Restaurant = () => {
  const navigate = useNavigate();

  const { resturant = [] } = useSelector((state) => state.admin);

  return (
    <div className="min-h-screen bg-[#efe6dd]">
      {/* Navbar */}
      <div className="bg-[#f7efe7] shadow-sm px-3 lg:px-4 py-4 flex items-center gap-3">
        <IoArrowBack
          size={24}
          className="cursor-pointer text-gray-700"
          onClick={() => navigate(-1)}
        />

        <h1 className="text-lg font-semibold text-gray-700">
          Restaurants Near You
        </h1>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {resturant.map((res) => {
            const address = res.address ? JSON.parse(res.address) : {};

            return (
              <div
                key={res._id}
                className="bg-[#f7efe7] rounded-xl shadow-sm overflow-hidden"
              >
                {/* Banner */}
                <img
                  src={res.banner}
                  alt={res.restaurantName}
                  className="w-full h-44 object-cover"
                />

                {/* Card Content */}
                <div className="p-4 space-y-2">
                  {/* Name */}
                  <h2 className="text-lg font-semibold text-gray-700">
                    {res.resturantName}
                  </h2>

                  {/* Owner */}
                  <p className="text-gray-500 text-sm">Owner: {res.owner}</p>

                  {/* Phone */}
                  <p className="text-gray-500 text-sm">Phone: {res.phone}</p>

                  {/* Address */}
                  <p className="text-gray-400 text-sm">
                    {address.street}, {address.state}, {address.country}
                  </p>

                  {/* Bottom Section */}
                  <div className="flex justify-between items-center pt-3">
                    {res.isOpen ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                        Open
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                        Closed
                      </span>
                    )}

                    <button
                      onClick={() => navigate(`/restaurant/${res._id}`)}
                      className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
