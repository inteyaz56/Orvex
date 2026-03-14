import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { toast } from "react-toastify";
import { clearCart } from "../redux/slice/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { address } = useSelector((state) => state.user);

  const token = localStorage.getItem("token");

  const selectedAddress = address?._id || null;

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const deliveryFee = 30;
  const platformFee = 5;
  const codFee = paymentMethod === "COD" ? 20 : 0;

  const finalTotal = totalAmount + deliveryFee + platformFee + codFee;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    const payload = {
      resturantId:
        typeof items[0]?.resturantId === "object"
          ? items[0]?.resturantId?._id
          : items[0]?.resturantId,

      items: items.map((item) => ({
        menuId: item._id,
        quantity: item.quantity,
      })),

      paymentMethod,
    };

    try {
      if (paymentMethod === "COD") {
        const result = await axios.post(`${serverUrl}/orders/create`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Order placed successfully 🎉");

        dispatch(clearCart());
        localStorage.removeItem("cartItems");

        navigate("/orders");
      } else {
        try {
          const orderResponse = await axios.post(
            `${serverUrl}/orders/create`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const createdOrder = orderResponse.data;

          const razorpayResponse = await axios.post(
            `${serverUrl}/payments/create-order`,
            { orderId: createdOrder._id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const razorpayOrder = razorpayResponse.data;

          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            order_id: razorpayOrder.id,
            name: "ORVEX",
            description: "Food Order Payment",

            handler: async function (response) {
              try {
                await axios.post(
                  `${serverUrl}/payments/verify-payment`,
                  {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: createdOrder._id,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );

                toast.success("Payment successful 🎉");

                dispatch(clearCart());
                localStorage.removeItem("cartItems");
                navigate("/orders");
              } catch (error) {
                console.log("Payment verification failed");
                toast.error("Payment verification failed");
              }
            },

            prefill: {
              name: address?.fullName || "",
              contact: address?.phone || "",
            },

            theme: {
              color: "#f97316",
            },
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        } catch (error) {
          console.log(error.response?.data || error.message);
          toast.error("Payment failed");
        }
      }
    } catch (error) {
      console.log("Order Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ede3] pb-32">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-[#f5ede3] border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-800 cursor-pointer text-2xl"
        >
          <IoArrowBack />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Checkout</h2>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Address */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Delivery Address</h3>

          {!address && (
            <p className="text-gray-500 text-sm">No saved address found</p>
          )}

          {address && (
            <div>
              <p className="font-medium text-gray-800">{address.fullName}</p>
              <p className="text-sm text-gray-600">
                {address.street}, {address.city}, {address.state},{" "}
                {address.pincode}
              </p>
              <p className="text-sm text-gray-600">Phone: {address.phone}</p>
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>

          <label className="flex items-center gap-3 mb-2">
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            Pay Online (Razorpay)
          </label>
        </div>

        {/* Summary */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>

          {items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm mb-2">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr className="my-3" />

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>

          {paymentMethod === "COD" && (
            <div className="flex justify-between text-sm">
              <span>COD Fee</span>
              <span>₹{codFee}</span>
            </div>
          )}

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-orange-600">
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
        >
          {paymentMethod === "ONLINE" ? "Pay & Place Order" : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
