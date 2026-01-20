"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FiMapPin, FiHome, FiClock, FiCheckCircle, FiXCircle, FiShoppingCart } from "react-icons/fi";

type Store = {
  _id: string;
  storeName: string;
  state: string;
  city: string;
  locationName: string;
  address: string;
  deliveryRadiusKm: number;
  isActive: boolean;
  itemsCount?: number; // Optional: can be fetched from backend later
};

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get("https://zep-it-back.onrender.com/api/store");
      if (res.data.success) {
        // Add dummy itemsCount for now
        const storesWithItems = res.data.stores.map((s: Store) => ({
          ...s,
          itemsCount: Math.floor(Math.random() * 50) + 10, // random items count
        }));
        setStores(storesWithItems);
      } else {
        alert(res.data.message || "Failed to fetch stores");
      }
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading stores...</p>;
  if (stores.length === 0) return <p className="text-center mt-20 text-gray-500">No stores found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-[#0C831F]">All Stores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div
            key={store._id}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition relative overflow-hidden"
          >
            {/* Status Badge */}
            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                store.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-600"
              }`}
            >
              {store.isActive ? <FiCheckCircle /> : <FiXCircle />}
              {store.isActive ? "Active" : "Inactive"}
            </div>

            {/* Store Name */}
            <h2 className="text-xl font-bold mb-3 text-[#1C1C1C]">{store.storeName}</h2>

            {/* Location */}
            <p className="flex items-center gap-2 text-gray-600 mb-1">
              <FiMapPin /> {store.locationName}, {store.city}, {store.state}
            </p>

            {/* Address */}
            <p className="flex items-center gap-2 text-gray-600 mb-1">
              <FiHome /> {store.address}
            </p>

            {/* Delivery Radius */}
            <p className="flex items-center gap-2 text-gray-600 mb-1">
              <FiClock /> {store.deliveryRadiusKm} km radius
            </p>

            {/* Items Count */}
            <p className="flex items-center gap-2 text-gray-600 font-semibold mt-3">
              <FiShoppingCart /> {store.itemsCount} items available
            </p>

            {/* Visit Store Button */}
            <button
              onClick={() => alert("Redirect to store page")}
              className="mt-4 w-full py-2 rounded-xl bg-[#0C831F] text-white font-semibold hover:bg-[#14B8A6] transition"
            >
              Visit Store
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
