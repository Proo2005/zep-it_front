"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    type: "customer",
    password: "",
    state: "",
    city: "",
    fullAddress: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await axios.post(
        "https://zep-it-back.onrender.com/api/auth/signup",
        {
          ...form,
          authProvider: "local",
        }
      );

      alert("Signup successful!");
      localStorage.setItem("name", form.name);
      localStorage.setItem("email", form.email);
      localStorage.setItem("username", form.username);
      localStorage.setItem("phone", form.phone);
      localStorage.setItem("type", form.type);
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

      const { token, user } = res.data;

      // ✅ SAVE BACKEND DATA, NOT FORM DATA
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      localStorage.setItem("name", user.name || "");
      localStorage.setItem("email", user.email || "");
      localStorage.setItem("username", user.username || "");
      localStorage.setItem("phone", user.phone || "");
      localStorage.setItem("type", user.type || "customer");

      window.dispatchEvent(new Event("authChanged"));

      router.push("/");
    } catch (err) {
      alert("Google signup failed");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black -mt-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-300 space-y-6 mt-24"
      >
        <h2 className="text-2xl font-bold text-[#0C831F] text-center mb-4">
          Create Account
        </h2>

        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        {/* Username */}
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        {/* Account Type */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
        >
          <option value="customer">Customer</option>
          <option value="shop">Shop</option>
          <option value="admin">Admin</option>
        </select>

        {/* Address */}
        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        <textarea
          name="fullAddress"
          placeholder="Full Address"
          value={form.fullAddress}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          rows={3}
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        <GoogleLogin
          onSuccess={(res) => handleGoogleLogin(res.credential!)}
          onError={() => alert("Google Login Failed")}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0C831F] to-[#2ECC71] text-white font-bold"
        >
          {loading ? "Signing Up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}
