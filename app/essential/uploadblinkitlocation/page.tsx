"use client";

import { useState } from "react";
import axios from "axios";

export default function AddStorePage() {
  const [form, setForm] = useState({
    storeName: "",
    state: "",
    city: "",
    locationName: "",
    address: "",
    lng: "",
    lat: "",
    deliveryRadiusKm: 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const payload = {
        ...form,
        geo: { type: "Point", coordinates: [parseFloat(form.lng), parseFloat(form.lat)] },
      };

      const res = await axios.post("http://localhost:5000/api/store/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert("✅ Store added successfully!");
        setForm({
          storeName: "",
          state: "",
          city: "",
          locationName: "",
          address: "",
          lng: "",
          lat: "",
          deliveryRadiusKm: 5,
        });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Failed to add store");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Add New Store
        </h2>

        {/* Store Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Store Name *</label>
            <input
              name="storeName"
              placeholder="e.g., Lokkhi Bhandar"
              value={form.storeName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">State *</label>
            <input
              name="state"
              placeholder="e.g., West Bengal"
              value={form.state}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">City *</label>
            <input
              name="city"
              placeholder="e.g., Kolkata"
              value={form.city}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Location Name *</label>
            <input
              name="locationName"
              placeholder="e.g., Behala"
              value={form.locationName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 font-medium text-gray-700">Full Address *</label>
            <input
              name="address"
              placeholder="Street, area, PIN code"
              value={form.address}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Longitude *</label>
            <input
              name="lng"
              placeholder="e.g., 88.3639"
              value={form.lng}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Latitude *</label>
            <input
              name="lat"
              placeholder="e.g., 22.5726"
              value={form.lat}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Delivery Radius (km)</label>
            <input
              name="deliveryRadiusKm"
              type="number"
              min={1}
              value={form.deliveryRadiusKm}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition"
        >
          Add Store
        </button>
      </form>
    </div>
  );
}
