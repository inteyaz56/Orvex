import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../config/socket";
import { IoArrowBack } from "react-icons/io5";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [riderLocation, setRiderLocation] = useState(null);

  useEffect(() => {
    socket.emit("join_order_room", orderId);

    socket.on("live_rider_location", (data) => {
      setRiderLocation(data);
    });

    return () => {
      socket.off("live_rider_location");
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#f5ede3] flex flex-col items-center">
      {/* Navbar */}
      <div className="w-full max-w-6xl sticky top-0 bg-[#f5ede3] border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <IoArrowBack size={22} />
        </button>

        <h2 className="text-lg font-semibold">Track Order</h2>
      </div>

      <div className="w-full max-w-6xl p-4 space-y-4">
        {/* Order Info Card */}
        <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-gray-500 text-sm">Order ID</p>
            <p className="font-semibold">{orderId}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <p className="font-semibold text-green-600">Rider On The Way 🚴</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Estimated Delivery</p>
            <p className="font-semibold">15 - 20 mins</p>
          </div>
        </div>

        {/* Map */}
        {riderLocation ? (
          <div className="h-[450px] w-full rounded-xl overflow-hidden shadow-lg border">
            <MapContainer
              center={[riderLocation.latitude, riderLocation.longitude]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker
                position={[riderLocation.latitude, riderLocation.longitude]}
              >
                <Popup>Rider is here 🚴</Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            Waiting for rider location...
          </div>
        )}

        {/* Delivery Progress */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">Delivery Progress</h3>

          <div className="space-y-2 text-sm">
            <p>✔ Order Confirmed</p>
            <p>✔ Rider Assigned</p>
            <p className="text-orange-500 font-semibold">🚴 Rider On The Way</p>
            <p className="text-gray-400">Delivery Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
