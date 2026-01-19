"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Store = {
  _id: string;
  storeName: string;
  state: string;
  city: string;
  locationName: string;
  address: string;
  deliveryRadiusKm: number;
  isActive: boolean;
};

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/store");
      if (res.data.success) {
        setStores(res.data.stores);
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

  if (loading) return <p className="text-center mt-10">Loading stores...</p>;

  if (stores.length === 0) return <p className="text-center mt-10">No stores found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Stores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store._id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{store.storeName}</h2>
            <p><span className="font-semibold">Location:</span> {store.locationName}, {store.city}, {store.state}</p>
            <p><span className="font-semibold">Address:</span> {store.address}</p>
            <p><span className="font-semibold">Delivery Radius:</span> {store.deliveryRadiusKm} km</p>
            <p><span className="font-semibold">Status:</span> {store.isActive ? "Active" : "Inactive"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
