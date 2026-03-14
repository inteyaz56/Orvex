import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { serverUrl } from "../main";
import axios from "axios";

const Signup = () => {
  let [showPassword, setShowPassword] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("user");
  let [loading, setLoading] = useState(false);
  const roles = ["user", "resturant", "rider"];
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/auth/register`, {
        email,
        password,
        role,
      });
      console.log(result.data);
      navigate(`/verify/${email}`);
      toast.success(result?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong !");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5ede4] to-[#f3e1d2] px-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-orange-500">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-600"> Orvex</h1>
          <h2 className="text-xl font-semibold mt-2 text-gray-800">
            Create Account
          </h2>
        </div>

        {/* Role Selector */}
        <div className="flex bg-orange-100 rounded-full p-1 mb-6">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm cursor-pointer font-semibold rounded-full transition-all duration-300 ${
                role === r
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-orange-700 hover:text-orange-900"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <FiMail className="absolute top-3.5 left-4 text-orange-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute top-3.5 left-4 text-orange-500" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {password && (
              <div
                className="absolute top-3.5 right-4 cursor-pointer text-gray-500"
                onClick={togglePassword}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r cursor-pointer from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            {loading ? "Sending OTP" : ` Sign Up as ${role.toUpperCase()}`}
          </button>
        </form>

        {/* Bottom Login Option */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
