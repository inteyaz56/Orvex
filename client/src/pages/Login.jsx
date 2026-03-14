import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slice/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/auth/login`, {
        email,
        password,
      });
      console.log(result.data);
      dispatch(setUserData(result.data.user));
      localStorage.setItem("token", result.data.token);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
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
            Login to Account
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <FiMail className="absolute top-3.5 left-4 text-orange-500" />
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-orange-600 cursor-pointer text-sm hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r cursor-pointer from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
          >
            {loading ? <ClipLoader /> : " Login"}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-600 font-semibold hover:underline"
            >
              Create Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
