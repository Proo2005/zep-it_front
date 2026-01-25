"use client";

import { useEffect, useState } from "react";

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

      fetchDrivers();
    } catch (err) {
      alert("Error saving driver");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Drivers</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <input name="city" placeholder="City" onChange={handleChange} required />
        <input name="state" placeholder="State" onChange={handleChange} required />
        <input name="vehicleNumber" placeholder="Vehicle Number" onChange={handleChange} required />
        <select name="vehicleType" onChange={handleChange}>
          <option value="Petrol">Petrol</option>
          <option value="EV">EV</option>
        </select>
        <button type="submit">Save Driver</button>
      </form>

      <hr />

      {drivers.map(d => (
        <div key={d._id}>
          <b>{d.name}</b> — {d.phoneNumber} — {d.vehicleType}
        </div>
      ))}
    </div>
  );
}
