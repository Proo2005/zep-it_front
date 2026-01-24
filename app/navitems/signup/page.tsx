"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.state || !form.city || !form.fullAddress) {
      alert("Please fill in all address details");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://zep-it-back.onrender.com/api/auth/signup", form);
      alert("Signup successful!");
      router.push("/navitems/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      const res = await axios.post(
        "https://zep-it-back.onrender.com/api/auth/google-login",
        { credential }
      );

      localStorage.setItem("token", res.data.token);
      alert("Logged in with Google ✅");
      router.push("/");
    } catch (err: any) {
      alert("Google login failed");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black -mt-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-300 space-y-6 mt-24"
      >
        <h2 className="text-2xl font-bold text-[#0C831F] text-center mb-4">Create Account</h2>

        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Name</label>
          <input
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Account Type</label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
          >
            <option value="customer">Customer</option>
            <option value="shop">Shop</option>
          </select>
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">State</label>
          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">City</label>
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Full Address</label>
          <textarea
            name="fullAddress"
            placeholder="Street, Building, Landmark..."
            value={form.fullAddress}
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none resize-none"
            rows={3}
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter a strong password"
            value={form.password}
            onChange={handleChange}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) => handleGoogleLogin(res.credential!)}
            onError={() => alert("Google Login Failed")}
          />
        </div>

        <div className="text-center text-gray-400 text-sm">or</div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0C831F] to-[#2ECC71] text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Signup"}
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <a href="/navitems/login" className="text-green-600 font-semibold hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
