import { useState, useEffect } from "react";
import { IoArrowBack, IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../redux/slice/resturantSlice";
import { getProfile } from "../hooks/resturantHooks";

const UpdateRestaurant = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  getProfile();

  const { profile } = useSelector((state) => state.resturant);

  const addresss =
    typeof profile?.address === "string"
      ? JSON.parse(profile.address)
      : profile?.address;

  const [loading, setLoading] = useState(false);

  const [owner, setOwner] = useState(profile?.owner || "");
  const [resturantName, setResturantName] = useState(
    profile?.resturantName || "",
  );
  const [phone, setPhone] = useState(profile?.phone || "");
  const [street, setStreet] = useState(addresss?.street || "");
  const [city, setCity] = useState(addresss?.city || "");
  const [state, setState] = useState(addresss?.state || "");
  const [pincode, setPincode] = useState(addresss?.pincode || "");
  const [country, setCountry] = useState(addresss?.country || "");
  const [openingTime, setOpeningTime] = useState(profile?.openingTime || "");
  const [closingTime, setClosingTime] = useState(profile?.closingTime || "");

  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(profile?.banner || null);

  
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const getRestaurantLocation = () => {
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

    
        setLocation(loc);
      },
      (error) => {

        toast.error("Unable to fetch location");
      },
    );
  };

  useEffect(() => {
    getRestaurantLocation();
  }, []);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const address = {
        street,
        state,
        country,
        pincode,
        city,
      };

      const formData = new FormData();

      formData.append("resturantName", resturantName);
      formData.append("owner", owner);
      formData.append("phone", phone);
      formData.append("openingTime", openingTime);
      formData.append("closingTime", closingTime);
      formData.append("address", JSON.stringify(address));
      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);

      if (banner) {
        formData.append("banner", banner);
      }

      const result = await axios.put(
        `${serverUrl}/resturants/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(setProfile(result.data));
      toast.success("Restaurant Updated Successfully");

      navigate(-1);
    } catch (error) {
  
      toast.error(error?.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen ">
      {/* Navbar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl text-orange-500 cursor-pointer"
          >
            <IoArrowBack />
          </button>

          <h1 className="text-lg font-semibold ml-4">Update Restaurant</h1>
        </div>
      </div>

      {/* Card */}
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
          {/* Banner Upload */}
          <div className="mb-8">
            <label className="block font-medium mb-3">Restaurant Banner</label>

            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <IoCloudUploadOutline size={40} />
                  <p className="mt-2 text-sm">Upload banner</p>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Restaurant Name"
              value={resturantName}
              onChange={(e) => setResturantName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            />

            <input
              type="text"
              placeholder="Owner Name"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            />

            <input
              type="text"
              placeholder="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            />

            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            />

            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            />

            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            />

            <input
              type="time"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            />

            <input
              type="time"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleUpdate}
              className="bg-orange-500 cursor-pointer text-white px-8 py-2.5 rounded-lg"
            >
              {loading ? "Updating..." : "Update Restaurant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRestaurant;
