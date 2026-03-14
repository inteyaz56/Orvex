import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../redux/slice/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, totalAmount } = useSelector((state) => state.cart);


  const increaseQty = (item) => {
    dispatch(addToCart(item));
  };


  const decreaseQty = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="min-h-screen bg-[#f5ede3] pb-32">
      {/*  Navbar */}
      <div className="sticky top-0 z-50 bg-[#f5ede3] border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-800 cursor-pointer text-2xl"
        >
          <IoArrowBack />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
      </div>

      {/*  Cart Items */}
      <div className="px-4 py-6 space-y-5">
        {items.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Your cart is empty
          </div>
        )}

        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-sm p-4 flex gap-4"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-xl object-cover"
            />

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>

              <div className="flex items-center gap-2 text-orange-500 text-sm mt-1">
                <FaMapMarkerAlt />
                <span>{item?.resturantId?.resturantName}</span>
              </div>

              <div className="text-orange-600 font-bold mt-2">
                ₹{item.price}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => decreaseQty(item._id)}
                  className="bg-orange-100 cursor-pointer text-orange-600 px-3 py-1 rounded-lg font-bold"
                >
                  -
                </button>

                <span className="font-medium">{item.quantity}</span>

                <button
                  onClick={() => increaseQty(item)}
                  className="bg-orange-100 cursor-pointer text-orange-600 px-3 py-1 rounded-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => dispatch(removeFromCart(item._id))}
              className="text-gray-400 cursor-pointer hover:text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/*  Sticky Bottom Checkout */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-700 font-medium">Total Price</span>
          <span className="text-orange-600 text-xl font-bold">
            ₹{totalAmount}
          </span>
        </div>

        <button
          disabled={items.length === 0}
          onClick={() => {
            navigate("/checkout");
          }}
          className="w-full bg-orange-500 cursor-pointer text-white py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
