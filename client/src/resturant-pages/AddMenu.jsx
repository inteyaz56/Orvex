import { useEffect, useState } from "react";
import { IoArrowBack, IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../main";
import { getCategories } from "../hooks/resturantHooks";
import { useDispatch, useSelector } from "react-redux";
import { setMenu } from "../redux/slice/resturantSlice";

const AddMenu = () => {
  getCategories();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  let dispatch = useDispatch();
  let { categories } = useSelector((state) => state.resturant);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      if (imageFile) formData.append("image", imageFile);

      const result = await axios.post(
        `${serverUrl}/resturants/menu/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(setMenu(result.data));
      toast.success("Menu added successfully");
      navigate(-1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Navbar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl text-orange-500 hover:scale-110 transition"
          >
            <IoArrowBack />
          </button>
          <h1 className="text-lg font-semibold ml-4">Add Menu Item</h1>
        </div>
      </div>

      {/* Card */}
      <div className="flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
          {/* 🔥 IMAGE ON TOP */}
          <div className="mb-8">
            <label className="block font-medium mb-3">Menu Image</label>

            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-52 object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <IoCloudUploadOutline size={40} />
                  <p className="mt-2 text-sm">Click to upload menu image</p>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Menu Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
              placeholder="Enter menu name"
            />
          </div>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
              placeholder="Enter price"
            />
          </div>

          {/* Category Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-300 outline-none"
              placeholder="Short description..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition"
            >
              {loading ? "Adding..." : "Add Menu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
