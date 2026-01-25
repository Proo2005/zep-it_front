"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

type Driver = {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  vehicleNumber: string;
  vehicleType: "ev" | "petrol";
  rating: number;
};

export default function DriverPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<Driver>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    vehicleNumber: "",
    vehicleType: "petrol",
    rating: 5,
  });

  /* Fetch drivers (API later) */
  useEffect(() => {
    // TODO: replace with API call
    setDrivers([]);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: POST to backend
    setDrivers((prev) => [...prev, form]);

    setShowForm(false);
    setForm({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      vehicleNumber: "",
      vehicleType: "petrol",
      rating: 5,
    });
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Drivers</h1>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold transition"
        >
          <FiPlus /> Add Driver
        </button>
      </div>

      {/* Driver List */}
      {drivers.length === 0 ? (
        <div className="text-gray-500 text-center mt-20">
          No drivers added yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drivers.map((driver, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <h2 className="text-lg font-bold">{driver.name}</h2>
              <p className="text-sm text-gray-600">{driver.phone}</p>

              <div className="mt-3 text-sm space-y-1">
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {driver.address}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {driver.city},{" "}
                  {driver.state}
                </p>
                <p>
                  <span className="font-semibold">Vehicle:</span>{" "}
                  {driver.vehicleNumber} ({driver.vehicleType})
                </p>
                <p>
                  <span className="font-semibold">Rating:</span> ⭐{" "}
                  {driver.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Driver Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">Add Driver</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Driver Name"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2"
                required
              />
              <input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2"
                required
              />
              <input
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2"
                required
              />
              <div className="flex gap-3">
                <input
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2"
                  required
                />
                <input
                  name="state"
                  placeholder="State"
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2"
                  required
                />
              </div>
              <input
                name="vehicleNumber"
                placeholder="Vehicle Number"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2"
                required
              />
              <select
                name="vehicleType"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2"
              >
                <option value="petrol">Petrol</option>
                <option value="ev">EV</option>
              </select>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded-xl font-bold hover:bg-gray-900 transition"
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
