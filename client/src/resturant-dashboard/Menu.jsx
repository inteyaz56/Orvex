import React from "react";
import { FaPlus, FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMenu } from "../hooks/resturantHooks";

const Menu = () => {
  getMenu();
  let { menu } = useSelector((state) => state.resturant);
  console.log("This is menu", menu);
  const navigate = useNavigate();
  const badgeColor = (badge) => {
    if (badge === "Most Popular") return "bg-orange-100 text-orange-600";
    if (badge === "Recommended") return "bg-green-100 text-green-600";
    if (badge === "Chef's Choice") return "bg-purple-100 text-purple-600";
    return "";
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Menu</h1>

        <button
          onClick={() => {
            navigate("/add/menu");
          }}
          className="flex items-center gap-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <FaPlus />
          Add Menu Item
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {menu && menu.length > 0 ? (
          menu.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                <button className="absolute top-3 right-3 bg-white p-2 rounded-lg shadow hover:bg-gray-100 transition">
                  <FaPen className="text-gray-600 text-sm" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-green-600 font-semibold">
                    ₹{item.price}
                  </span>

                  {item.badge && (
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${badgeColor(
                        item.badge,
                      )}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center col-span-full">
            No menu found
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
