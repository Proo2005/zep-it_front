"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "customer",
    password: "",
    state: "",
    city: "",
    fullAddress: "",
  });
  
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.state || !form.city || !form.fullAddress) {
      alert("Please fill address details");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-white text-xl font-bold">Signup</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="input"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="input"
        />

        <select name="type" onChange={handleChange} className="input">
          <option value="customer">Customer</option>
          <option value="shop">Shop</option>
        </select>

        <input
          name="state"
          placeholder="State"
          onChange={handleChange}
          className="input"
        />

        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="input"
        />

        <textarea
          name="fullAddress"
          placeholder="Full Address"
          onChange={handleChange}
          className="input resize-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="input"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-black py-2 rounded-lg font-semibold"
        >
          Signup
        </button>
        <p className="text-center text-xl text-gray-100">
          Have an account? <a href="/login" className="text-cyan">Login</a>
        </p>
        
      </form>
    </div>
  );
}
