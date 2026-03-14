import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { setUserData } from "../redux/slice/userSlice";
import { toast } from "react-toastify";

const Profile = () => {
  let token = localStorage.getItem("token");
  let [riders, setRiders] = useState(null);
  let [loading, setLoading] = useState(false);
  let dispatch = useDispatch();

  let fetchProfile = async () => {
    if (!token) return;
    setLoading(true);
    try {
      let result = await axios.get(`${serverUrl}/riders/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRiders(result.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await axios.get(`${serverUrl}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setUserData(null));
    localStorage.removeItem("token");
    toast.success("Loggedout✅");
  };

  const navigate = useNavigate();
  return (
    <div className=" flex justify-center">
      <div className="w-full max-w-5xl bg-white px-4 pb-3  rounded-2xl shadow-xl ">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={riders?.profilePic}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#d8ccc0]"
          />
          <h2 className="text-3xl font-semibold mt-4">{riders?.name}</h2>
          <p className="text-gray-500">{riders?.email}</p>
        </div>

        {/* Profile Details Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block mb-2 text-gray-600">Phone</label>
            <div className="bg-gray-100 p-3 rounded-lg">{riders?.phone}</div>
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Status</label>
            <div className="bg-gray-100 p-3 rounded-lg">
              {riders?.isAvailable ? "Active" : "Off"}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Vehicle Type</label>
            <div className="bg-gray-100 p-3 rounded-lg">
              {riders?.vehicle?.type}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Vehicle Model</label>
            <div className="bg-gray-100 p-3 rounded-lg">
              {riders?.vehicle?.model}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Number Plate</label>
            <div className="bg-gray-100 p-3 rounded-lg">
              {riders?.vehicle?.numberPlate}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center mt-10 gap-4">
          <button
            onClick={() => {
              navigate("/update/rider/profile");
            }}
            className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-8 py-3 rounded-xl transition"
          >
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-8 py-3 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
