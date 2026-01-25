"use client";

import { useEffect, useState } from "react";

export default function DriverPage() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    vehicleNumber: "",
    vehicleType: "EV",
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const res = await fetch("https://zep-it-back.onrender.com/api/drivers");
    const data = await res.json();
    setDrivers(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addDriver = async () => {
    await fetch("https://zep-it-back.onrender.com/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      vehicleNumber: "",
      vehicleType: "EV",
    });

    fetchDrivers();
  };

  return (
    <div className="p-6 space-y-8 bg-white text-black">
      <h1 className="text-2xl font-bold ">Drivers</h1>

      {/* Add Driver Form */}
      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl">
        {[
          "name",
          "phoneNumber",
          "address",
          "city",
          "state",
          "vehicleNumber",
        ].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            className="border p-2 rounded"
          />
        ))}

        <select
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="EV">EV</option>
          <option value="Petrol">Petrol</option>
        </select>

        <button
          onClick={addDriver}
          className="col-span-2 bg-green-600 text-white py-2 rounded-xl font-bold"
        >
          Add Driver
        </button>
      </div>

      {/* Driver List */}
      <div className="grid md:grid-cols-3 gap-4">
        {drivers.map((d) => (
          <div
            key={d._id}
            className="p-4 border rounded-xl bg-white dark:bg-zinc-900"
          >
            <h2 className="font-bold">{d.name}</h2>
            <p>{d.phoneNumber}</p>
            <p>{d.city}, {d.state}</p>
            <p>Vehicle: {d.vehicleNumber}</p>
            <p>Type: {d.vehicleType}</p>
            <p>⭐ {d.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
