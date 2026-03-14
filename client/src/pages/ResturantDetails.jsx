import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../main";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const RestaurantDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const [resturantDetails, setResturantDetails] = useState(null);
  const [menus, setMenus] = useState([]);

  const fetchResturantDetails = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${serverUrl}/resturants/resturant/${id}`);

      setResturantDetails(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async () => {
    setMenuLoading(true);

    try {
      const result = await axios.get(
        `${serverUrl}/resturants/menu/resturant/menu/${id}`,
      );

      setMenus(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    fetchResturantDetails();
    fetchMenu();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <ClipLoader size={35} color="orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efe6dd]">
      {/* Navbar */}
      <div className="bg-[#f7efe7] px-4 py-4 flex items-center gap-3 shadow-sm">
        <IoArrowBack
          size={24}
          className="cursor-pointer text-gray-700"
          onClick={() => navigate(-1)}
        />

        <h1 className="text-lg font-semibold text-gray-700">Restaurant</h1>
      </div>

      <div className="p-6">
        {/* Banner */}
        <img
          src={resturantDetails?.banner}
          className="w-full h-56 rounded-xl object-cover"
          alt="banner"
        />

        {/* Restaurant Info */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              {resturantDetails?.restaurantName}
            </h2>

            {resturantDetails?.isOpen && (
              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                Open
              </span>
            )}
          </div>

          <p className="text-gray-500 text-sm">
            Owner : {resturantDetails?.owner}
          </p>

          <p className="text-gray-500 text-sm">
            📞 Phone : {resturantDetails?.phone}
          </p>

          <p className="text-gray-500 text-sm">
            ⏰ {resturantDetails?.openingTime} - {resturantDetails?.closingTime}
          </p>
        </div>

        {/* Menu */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Menu</h3>

          {menuLoading ? (
            <div className="flex justify-center">
              <ClipLoader size={25} color="orange" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {menus?.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/item/details/${item._id}`);
                    console.log(item._id);
                  }}
                  className="bg-[#f7efe7] cursor-pointer rounded-xl shadow-sm p-3 flex gap-3"
                >
                  <img
                    src={item.image}
                    className="w-24 h-20 object-cover rounded-lg"
                    alt={item.name}
                  />

                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-gray-700">
                          {item.name}
                        </h4>

                        <span className="text-orange-500 font-semibold">
                          ₹{item.price}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {menus.length === 0 && !menuLoading && (
            <p className="text-gray-500 text-sm">No menu available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
