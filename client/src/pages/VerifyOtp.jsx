import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { serverUrl } from "../main";
import axios from "axios";

const VerifyOtp = () => {
  let { email } = useParams();
  const [otp, setOtp] = useState("");
  let [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/auth/verify`, {
        email,
        otp,
      });

      toast.success(result?.data?.message || "Success");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d8cbbd]">
      <div className="w-[420px] bg-[#e9e9e9] rounded-3xl shadow-2xl p-8 border-t-4 border-orange-500">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-600 flex items-center justify-center gap-2">
            Orvex
          </h1>
          <p className="text-xl text-gray-800 mt-2">Verify OTP</p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {/* Single OTP Input */}
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full px-5 py-4 rounded-xl border border-orange-300 
                       focus:outline-none focus:ring-2 focus:ring-orange-400 
                       text-center text-xl tracking-widest bg-white"
          />

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer cursor-pointer bg-orange-500 hover:bg-orange-600 
                       text-white font-semibold py-4 rounded-xl 
                       transition duration-300 shadow-md"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
