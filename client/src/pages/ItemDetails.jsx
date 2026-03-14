import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../main";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slice/cartSlice";
import { toast } from "react-toastify";

const ItemDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  let dispatch = useDispatch();
  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${serverUrl}/resturants/menu/menu/${id}`);
      setItem(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <ClipLoader size={30} color="#f97316" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto">
        {/* 🔥 Top Navbar */}
        <div className="sticky  top-0 z-50  border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-gray-800 cursor-pointer text-2xl"
          >
            <IoArrowBack />
          </button>

          <h2 className="text-lg font-semibold text-gray-800">Item Details</h2>
        </div>

        {/* Image Section */}
        <div className="h-[250px] sm:h-[300px] lg:h-[350px] overflow-hidden lg:rounded-2xl lg:mt-6">
          <img
            src={item?.image}
            alt={item?.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="px-5 py-6">
          {/* Item Name */}
          <h1 className="text-2xl font-bold text-gray-800">{item?.name}</h1>

          {/* Hotel Name */}
          <div className="flex items-center gap-2 mt-2 text-orange-500 font-medium">
            <FaMapMarkerAlt />
            <span>{item?.resturantId?.resturantName}</span>
          </div>

          {/* Description */}
          <p className="mt-4 text-gray-600 leading-relaxed">
            {item?.description}
          </p>

          {/* Price */}
          <div className="mt-6 text-2xl font-bold text-orange-600">
            ₹{item?.price}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                dispatch(addToCart(item));
                toast.success("Added to cart ✅");
                navigate("/cart");
              }}
              className="flex-1 border-2 cursor-pointer border-orange-500 text-orange-500 py-3 rounded-xl font-semibold hover:bg-orange-50 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
