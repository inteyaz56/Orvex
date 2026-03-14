import { IoArrowBack } from "react-icons/io5";
import { FaPhoneAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
  const navigate = useNavigate();
  let { profile } = useSelector((state) => state.resturant);
  const address =
    typeof profile.address === "string"
      ? JSON.parse(profile.address)
      : profile.address;

  return (
    <div className="min-h-screen ">
      {/* Content */}
      <div className="max-w-6xl mx-auto ">
        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src={profile?.banner}
            alt="Restaurant Banner"
            className="w-full h-64 object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex items-end p-6">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {profile?.restaurantName}
              </h2>
              <p className="text-white/90">Owned by {profile?.owner}</p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Contact */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

            <div className="flex items-center gap-3 text-gray-700">
              <FaPhoneAlt className="text-orange-500" />
              <span>{profile?.phone}</span>
            </div>
          </div>

          {/* Timing */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>

            <div className="flex items-center gap-3 text-gray-700">
              <FaClock className="text-orange-500" />
              <span>
                {profile?.openingTime} - {profile?.closingTime}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
          <h3 className="text-lg font-semibold mb-4">Address</h3>

          <div className="flex items-start gap-3 text-gray-700">
            <FaMapMarkerAlt className="text-orange-500 mt-1" />
            <div>
              <p>{address?.street}</p>
              <p>
                {address?.city}, {address?.state}
              </p>
              <p>
                {address?.country} - {address?.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => navigate("/update/resturant")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
