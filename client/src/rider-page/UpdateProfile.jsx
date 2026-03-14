import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { setProfile } from "../redux/slice/riderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  let token = localStorage.getItem("token");
  let [name, setName] = useState("");
  let [phone, setPhone] = useState("");
  let [vehicleType, setVehicleType] = useState("");
  let [vehicleModel, setVehicleModel] = useState("");
  let [numberPlate, setNumberPlate] = useState("");
  let [color, setColor] = useState("");
  let [profilePic, setProfilePic] = useState(null);
  let [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  let vehicle = {
    type: vehicleType,
    model: vehicleModel,
    numberPlate: numberPlate,
    color: color,
  };

  let formData = new FormData();
  formData.append("name", name);
  formData.append("phone", phone);
  if (profilePic) {
    formData.append("profilePic", profilePic);
  }

  formData.append("vehicle", JSON.stringify(vehicle));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.patch(`${serverUrl}/riders/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setProfile(result.data));
      toast.success("Profile Updated ✅");
      navigate(-1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* 🔥 Navbar */}
      <div className="bg-white shadow-md fixed top-0 z-30 w-full px-6 py-4 flex items-center gap-4">
        <FaArrowLeft
          className="text-xl cursor-pointer hover:text-orange-500 transition"
          onClick={() => window.history.back()}
        />
        <h2 className="text-xl font-semibold">Update Profile</h2>
      </div>

      {/* 🔥 Main Container */}
      <div className="flex justify-center pt-20 py-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <img
                src={previewImage || profilePic}
                alt="profile"
                className="w-32 h-32 cursor-pointer rounded-full object-cover border-4 border-[#d8ccc0]"
              />

              <label className="absolute bottom-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-orange-600">
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-2 text-gray-600">Full Name</label>
              <input
                name="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Phone</label>
              <input
                name="phone"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Vehicle Type</label>
              <select
                name="vehicleType"
                value={vehicleType}
                onChange={(e) => {
                  setVehicleType(e.target.value);
                }}
                className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="auto">Auto</option>
                <option value="bike">Bike</option>
                <option value="car">Car</option>
                <option value="scooter">Scooter</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Vehicle Model</label>
              <input
                name="vehicleModel"
                value={vehicleModel}
                onChange={(e) => {
                  setVehicleModel(e.target.value);
                }}
                className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Number Plate</label>
              <input
                name="numberPlate"
                value={numberPlate}
                onChange={(e) => {
                  setNumberPlate(e.target.value);
                }}
                className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-600">Vehicle Color</label>
              <input
                name="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                }}
                className="w-full p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="md:col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-10 py-3 rounded-xl transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
