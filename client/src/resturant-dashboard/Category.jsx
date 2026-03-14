import React from "react";
import { FaPlus, FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../hooks/resturantHooks";

const Category = () => {
  getCategories();

  let { categories } = useSelector((state) => state.resturant);

  const navigate = useNavigate();
  return (
    <div className="min-h-screen  ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Categories</h1>

        <button
          onClick={() => {
            navigate("/add/category");
          }}
          className="flex cursor-pointer items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-40 object-cover"
              />

              {/* Bottom Section */}
              <div className="flex justify-between items-center p-4">
                <h3 className="text-lg font-medium text-gray-800">
                  {category.name}
                </h3>

                <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition">
                  <FaPen className="text-gray-600 text-sm" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No Categories found</div>
        )}
      </div>
    </div>
  );
};

export default Category;
