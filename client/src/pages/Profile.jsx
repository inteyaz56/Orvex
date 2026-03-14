import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { serverUrl } from "../main";
import {
  setAddress,
  setMyProfile,
  setUserData,
} from "../redux/slice/userSlice";
import { getMyAddress, getMyProfile } from "../hooks/allHooks";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { myProfile, address } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [label, setLabel] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const token = localStorage.getItem("token");

  getMyProfile();
  getMyAddress();

  useEffect(() => {
    if (myProfile) {
      setName(myProfile.name || "");
      setPhone(myProfile.phone || "");
    }
  }, [myProfile]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        console.log("User Location:", loc);
        setLocation(loc);
      },
      (error) => {
        console.log(error);
        toast.error("Unable to fetch location");
      },
    );
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const result = await axios.put(
        `${serverUrl}/users/update/profile`,
        { name, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(setMyProfile(result.data));
      toast.success(result?.data?.message || "Profile Updated");
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      if (!location.latitude || !location.longitude) {
        toast.error("Location not available");
        return;
      }

      setLoading(true);

      const result = await axios.post(
        `${serverUrl}/users/address/add`,
        {
          city,
          pincode,
          addressLine,
          state,
          label,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(setAddress(result.data));
      toast.success("Address Added Successfully");
      setOpenAddressModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await axios.get(`${serverUrl}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Logout success");
    dispatch(setUserData(null));
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#d8cbbd]">
      <div className="bg-[#efe6dc] shadow-md">
        <div className="max-w-4xl mx-auto flex items-center px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl cursor-pointer text-orange-500"
          >
            <IoArrowBack />
          </button>

          <h1 className="text-xl font-semibold text-gray-800 ml-4">
            My Profile
          </h1>
        </div>
      </div>

      <div className="flex justify-center py-10 px-4">
        <div className="w-full max-w-4xl bg-[#f4ede6] shadow-2xl rounded-3xl p-8">
          <div className="flex flex-col items-center mb-8">
            <FaUserCircle className="text-7xl text-orange-500" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-orange-200"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={myProfile?.email || ""}
                disabled
                className="w-full mt-2 px-4 py-3 rounded-xl border border-orange-200 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                type="text"
                value={phone}
                disabled={!isEditing}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-orange-200"
              />
            </div>

            {address ? (
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Address</label>

                <textarea
                  rows="4"
                  readOnly
                  value={`${address.label}
${address.addressLine}
${address.city}, ${address.state} - ${address.pincode}`}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-orange-200"
                />
              </div>
            ) : (
              <div className="md:col-span-2">
                <button
                  onClick={() => {
                    getUserLocation();
                    setOpenAddressModal(true);
                  }}
                  className="bg-orange-500 text-white px-8 py-3 rounded-xl"
                >
                  Add Address
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8 gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 cursor-pointer text-white px-8 py-3 rounded-xl"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 cursor-pointer text-white px-6 py-3 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="bg-orange-500 cursor-pointer text-white px-8 py-3 rounded-xl"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleLogout}
              className="bg-orange-500 cursor-pointer text-white px-12 py-3 rounded-xl"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {openAddressModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-[#f4ede6] w-[90%] max-w-lg rounded-3xl p-6 relative">
            <button
              onClick={() => setOpenAddressModal(false)}
              className="absolute top-4 right-4 text-2xl"
            >
              <IoClose />
            </button>

            <h2 className="text-xl  font-bold mb-6">Add Address</h2>

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <input
                type="text"
                placeholder="Address Line"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <button
                onClick={handleSaveAddress}
                className="bg-orange-500 cursor-pointer text-white py-3 rounded-xl"
              >
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
