"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

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

export default function DriverPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

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

  /* Fetch drivers */
  const fetchDrivers = async () => {
    try {
      const res = await fetch("https://zep-it-back.onrender.com/api/drivers");
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error("Failed to fetch drivers");
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://zep-it-back.onrender.com/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      await fetchDrivers();
      setShowForm(false);
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
    } catch (err) {
      alert("Error adding driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Drivers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold"
        >
          <FiPlus /> Add Driver
        </button>
      </div>

      {/* Driver List */}
      {drivers.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">
          No drivers added yet
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drivers.map((driver) => (
            <div
              key={driver._id}
              className="border rounded-2xl p-5 shadow-sm"
            >
              <h2 className="text-lg font-bold">{driver.name}</h2>
              <p className="text-sm text-gray-600">
                {driver.phoneNumber}
              </p>

              <div className="mt-3 text-sm space-y-1">
                <p>
                  <b>Address:</b> {driver.address}
                </p>
                <p>
                  <b>City:</b> {driver.city}, {driver.state}
                </p>
                <p>
                  <b>Vehicle:</b> {driver.vehicleNumber} (
                  {driver.vehicleType})
                </p>
                <p>
                  <b>Rating:</b> ⭐ {driver.rating ?? 5}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">Add Driver</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" placeholder="Name" onChange={handleChange} required className="input" />
              <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className="input" />
              <input name="address" placeholder="Address" onChange={handleChange} required className="input" />
              <div className="flex gap-3">
                <input name="city" placeholder="City" onChange={handleChange} required className="input" />
                <input name="state" placeholder="State" onChange={handleChange} required className="input" />
              </div>
              <input name="vehicleNumber" placeholder="Vehicle Number" onChange={handleChange} required className="input" />
              <select name="vehicleType" onChange={handleChange} className="input">
                <option value="Petrol">Petrol</option>
                <option value="EV">EV</option>
              </select>

              <button
                disabled={loading}
                className="w-full bg-gray-900 text-white py-2 rounded-xl font-bold"
              >
                {loading ? "Saving..." : "Save Driver"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
