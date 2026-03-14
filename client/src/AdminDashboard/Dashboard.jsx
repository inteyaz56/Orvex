import React from "react";
import { Store } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { MdDirectionsBike } from "react-icons/md";
import { setActive } from "../redux/slice/userSlice";
const Dashboard = () => {
  let { rider, resturant, pendingResturant } = useSelector(
    (state) => state.admin,
  );

  let dispatch = useDispatch();
  return (
    <div className=" space-y-6 bg-[#f1e7de] min-h-screen">
      {/* Welcome */}
      <h1 className="text-2xl font-semibold text-gray-700">Welcome Admin!</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Resturants</p>
            <h2 className="text-3xl font-bold text-gray-700 mt-1">
              {resturant?.length || 0}
            </h2>
          </div>

          <div className="bg-orange-100 p-3 rounded-lg">
            <Store />
          </div>
        </div>

        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500">Pending Resturants</p>
            <h2 className="text-3xl font-bold text-gray-700 mt-1">
              {pendingResturant?.length || 0}
            </h2>
          </div>

          <div className="bg-orange-100 p-3 rounded-lg">
            <Store />
          </div>
        </div>

        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Rides</p>
            <h2 className="text-3xl font-bold text-gray-700 mt-1">
              {rider?.length || 0}
            </h2>
          </div>

          <div className="bg-orange-100 p-3 rounded-lg">
            <MdDirectionsBike size={22} />
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Restaurants */}
        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Recent Restaurants</h2>

            <button
              onClick={() => {
                dispatch(setActive("Resturant"));
              }}
              className="text-orange-500 cursor-pointer text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Restaurant</span>
              <span>Status</span>
            </div>

            {resturant?.map((r, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-t pt-3"
              >
                <p className="text-gray-700">{r?.resturantName}</p>

                <span
                  className={`px-3 py-1 rounded-lg text-sm ${
                    r?.isApproved
                      ? "bg-green-200 text-green-800"
                      : "bg-orange-200 text-orange-800"
                  }`}
                >
                  {r.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Riders */}
        <div className="bg-[#f7efe7] p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Recent Riders</h2>

            <button
              onClick={() => {
                dispatch(setActive("Riders"));
              }}
              className="text-orange-500 cursor-pointer text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Rider</span>
              <span>Status</span>
            </div>

            {rider?.map((r, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-t pt-3"
              >
                <p className="text-gray-700">{r.name}</p>

                <div className="flex gap-2">
                  {r?.isApproved ? (
                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
                      Approved
                    </button>
                  ) : (
                    <>
                      <span className="bg-gray-200 px-3 py-1 rounded-lg text-sm">
                        Pending
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
