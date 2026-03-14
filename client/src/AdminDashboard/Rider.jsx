import { CheckCircle, Hourglass, Bike } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";

import { toast } from "react-toastify";
import { setRider } from "../redux/slice/adminSlice";

const Rider = () => {
  const { rider = [], pendingRider = [] } = useSelector((state) => state.admin);
  let token = localStorage.getItem("token");
  let dispatch = useDispatch();

  const handleApprove = async (id) => {
    try {
      let result = await axios.patch(
        `${serverUrl}/admin/approve/rider/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(setRider(result.data));
      toast.success("Rider Approved ✅");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Riders</p>
            <h2 className="text-3xl font-bold">
              {rider.length + pendingRider.length}
            </h2>
          </div>

          <Bike className="text-orange-500" size={32} />
        </div>

        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500">Approved Riders</p>
            <h2 className="text-3xl font-bold">{rider.length}</h2>
          </div>

          <CheckCircle className="text-green-500" size={32} />
        </div>

        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500">Pending Riders</p>
            <h2 className="text-3xl font-bold">{pendingRider.length}</h2>
          </div>

          <Hourglass className="text-orange-500" size={32} />
        </div>
      </div>

      {/* Approved Riders Table */}
      <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Approved Riders
        </h2>

        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full text-left">
            <thead className="hidden md:table-header-group">
              <tr className="text-gray-500 border-b">
                <th className="py-3">Name</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {rider?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b flex flex-col md:table-row gap-2 md:gap-0 p-4 md:p-0"
                >
                  <td className="flex items-center gap-3 py-2 md:py-4">
                    <div className="w-8 h-8 bg-orange-300 rounded-full"></div>

                    <span className="text-gray-700 font-medium">
                      {item?.name}
                    </span>
                  </td>

                  <td className="text-sm text-gray-600">
                    <span className="md:hidden font-semibold mr-2">Phone:</span>
                    {item?.phone}
                  </td>

                  <td className="text-sm text-gray-600">
                    <span className="md:hidden font-semibold mr-2">
                      Vehicle:
                    </span>
                    {item?.vehicle?.type}
                  </td>

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

      {/* Pending Riders Table */}
      <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Pending Riders
        </h2>

        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full text-left">
            <thead className="hidden md:table-header-group">
              <tr className="text-gray-500 border-b">
                <th className="py-3">Name</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingRider?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b flex flex-col md:table-row gap-2 md:gap-0 p-4 md:p-0"
                >
                  <td className="flex items-center gap-3 py-2 md:py-4">
                    <div className="w-8 h-8 bg-orange-300 rounded-full"></div>

                    <span className="text-gray-700 font-medium">
                      {item?.name}
                    </span>
                  </td>

                  <td className="text-sm text-gray-600">
                    <span className="md:hidden font-semibold mr-2">Phone:</span>
                    {item?.phone}
                  </td>

                  <td className="text-sm text-gray-600">
                    <span className="md:hidden font-semibold mr-2">
                      Vehicle:
                    </span>
                    {item?.vehicle?.type}
                  </td>

                  <td>
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm">
                      Pending
                    </span>
                  </td>

                  <td className="flex gap-2 pt-2 md:py-4">
                    <button
                      onClick={() => {
                        handleApprove(item._id);
                      }}
                      className="bg-gray-200 cursor-pointer hover:bg-gray-300 px-3 py-1 rounded-lg text-sm"
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

export default Rider;
