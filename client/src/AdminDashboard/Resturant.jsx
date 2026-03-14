import { Hourglass, Store } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { toast } from "react-toastify";
import { setResturant } from "../redux/slice/adminSlice";

const Resturant = () => {
  const { resturant = [], pendingResturant = [] } = useSelector(
    (state) => state.admin,
  );

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const handleApprove = async (id) => {
    try {
      let result = await axios.patch(
        `${serverUrl}/admin/approve/resturant/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(setResturant(result.data));
      toast.success("Resturant Approved ✅");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Restaurant</p>
            <h2 className="text-3xl font-bold">
              {resturant.length + pendingResturant.length}
            </h2>
          </div>

          <Store className="text-orange-500" size={32} />
        </div>

        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500">Approved Restaurant</p>
            <h2 className="text-3xl font-bold">{resturant.length}</h2>
          </div>

          <Store className="text-green-500" size={32} />
        </div>

        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500">Pending Restaurant</p>
            <h2 className="text-3xl font-bold">{pendingResturant.length}</h2>
          </div>

          <Hourglass className="text-orange-500" size={32} />
        </div>
      </div>

      {/* Approved Restaurants */}
      <div className="bg-[#f7efe7] p-4 sm:p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Approved Restaurants
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="hidden md:table-header-group">
              <tr className="text-gray-500 border-b">
                <th className="py-3">Name</th>
                <th>Owner</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody className="space-y-4 md:space-y-0">
              {resturant.map((res, index) => (
                <tr
                  key={index}
                  className="border md:border-b-0 rounded-lg md:rounded-none p-4 md:p-0 flex flex-col md:table-row gap-2 bg-white/40 md:bg-transparent"
                >
                  {/* Name */}
                  <td className="flex items-center gap-3 py-2 md:py-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={res?.banner}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>

                    <span className="text-gray-700 font-medium">
                      {res?.resturantName}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="text-sm text-gray-600">
                    <span className="md:hidden font-semibold mr-2">Owner:</span>
                    {res?.owner}
                  </td>

                  {/* Phone */}
                  <td className="text-sm text-gray-600">
                    <span className="md:hidden font-semibold mr-2">Phone:</span>
                    {res?.phone}
                  </td>

                  {/* Status */}
                  <td>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
                      Approved
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Restaurants */}
      <div className="bg-[#f7efe7] p-4 sm:p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Pending Restaurants
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="hidden md:table-header-group">
              <tr className="text-gray-500 border-b">
                <th className="py-3">Name</th>
                <th>Owner</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="space-y-4 md:space-y-0">
              {pendingResturant.map((res, index) => (
                <tr
                  key={index}
                  className="border md:border-b-0 rounded-lg md:rounded-none p-4 md:p-0 flex flex-col md:table-row gap-2 bg-white/40 md:bg-transparent"
                >
                  {/* Name */}
                  <td className="flex items-center gap-3 py-2 md:py-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={res?.banner}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>

                    <span className="text-gray-700 font-medium">
                      {res?.resturantName}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="text-sm text-gray-600">
                    <span className="md:hidden font-semibold mr-2">Owner:</span>
                    {res?.owner}
                  </td>

                  {/* Phone */}
                  <td className="text-sm text-gray-600">
                    <span className="md:hidden font-semibold mr-2">Phone:</span>
                    {res?.phone}
                  </td>

                  {/* Status */}
                  <td>
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm">
                      Pending
                    </span>
                  </td>

                  {/* Action */}
                  <td className="flex gap-2 pt-2 md:py-4">
                    <button
                      onClick={() => handleApprove(res._id)}
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-sm cursor-pointer"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Resturant;
