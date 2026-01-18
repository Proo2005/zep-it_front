"use client";

import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "customer",
    password: "",
  });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/auth/signup", form);
    alert("Signup successful");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-white text-xl font-bold">Signup</h2>

        <input name="name" placeholder="Name" onChange={handleChange} className="input" />
        <input name="email" placeholder="Email" onChange={handleChange} className="input" />

        <select name="type" onChange={handleChange} className="input">
          <option value="customer">Customer</option>
          <option value="shop">Shop</option>
        </select>

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="input"
        />

        <button className="w-full bg-green-500 text-black py-2 rounded-lg">
          Signup
        </button>
      </form>
    </div>
  );
}
