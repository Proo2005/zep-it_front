"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

const API = "https://zep-it-back.onrender.com"; // hardcoded backend

type Driver = {
  _id?: string;
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  vehicleNumber: string;
  vehicleType: "EV" | "Petrol";
  rating?: number;
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [form, setForm] = useState<Driver>({
    name: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    vehicleNumber: "",
    vehicleType: "Petrol",
    rating: 5,
  });
  const [showForm, setShowForm] = useState(false);

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API}/api/drivers`);
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/drivers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save driver");

      setForm({
        name: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        vehicleNumber: "",
        vehicleType: "Petrol",
        rating: 5,
      });

      setShowForm(false);
      fetchDrivers();
    } catch (err) {
      alert("Error saving driver");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Drivers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-600 transition"
        >
          <FiPlus /> Add Driver
        </button>
      </div>

      {/* Drivers List */}
      {drivers.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">No drivers available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map(d => (
            <div
              key={d._id}
              className="border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold mb-1">{d.name}</h2>
              <p className="text-gray-700">{d.phoneNumber}</p>
              <div className="mt-3 text-sm space-y-1">
                <p>
                  <span className="font-semibold">Address:</span> {d.address}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {d.city}, {d.state}
                </p>
                <p>
                  <span className="font-semibold">Vehicle:</span> {d.vehicleNumber} ({d.vehicleType})
                </p>
                <p>
                  <span className="font-semibold">Rating:</span> ⭐ {d.rating ?? 5}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-5">Add Driver</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <div className="flex gap-3">
                <input
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
                <input
                  name="state"
                  placeholder="State"
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>
              <input
                name="vehicleNumber"
                placeholder="Vehicle Number"
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <select
                name="vehicleType"
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="Petrol">Petrol</option>
                <option value="EV">EV</option>
              </select>

              <button
                type="submit"
                className="w-full bg-green-500 text-black py-2 rounded-lg font-bold hover:bg-green-600 transition"
              >
                Save Driver
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
