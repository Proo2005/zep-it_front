"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    type: "customer",
    password: "",
    address: {
      state: "",
      city: "",
      fullAddress: "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { state, city, fullAddress } = form.address;
    if (!state || !city || !fullAddress) {
      alert("Please fill complete address");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://zep-it-back.onrender.com/api/auth/signup",
        form
      );

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

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("name", user.name);
      localStorage.setItem("username", user.username || "");
      localStorage.setItem("phone", user.phone || "");
      localStorage.setItem("email", user.email);
      localStorage.setItem("type", user.type || "customer");
      localStorage.setItem("isAuthenticated", "true");

      window.dispatchEvent(new Event("authChanged"));

      alert(`Welcome ${user.name}`);
      router.push("/");
    } catch {
      alert("Google signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black -mt-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-lg border space-y-5 pt-24 bg-white text-black border-b-gray-500"
      >
        <h2 className="text-2xl font-bold text-[#0C831F] text-center">
          Create Account
        </h2>

        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="input"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />

        {/* Username */}
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="input"
          required
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          className="input"
          required
        />

        {/* Account Type */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="input"
        >
          <option value="customer">Customer</option>
          <option value="shop">Shop</option>
        </select>

        {/* Address */}
        <input
          name="address.state"
          placeholder="State"
          value={form.address.state}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          name="address.city"
          placeholder="City"
          value={form.address.city}
          onChange={handleChange}
          className="input"
          required
        />

        <textarea
          name="address.fullAddress"
          placeholder="Full address"
          value={form.address.fullAddress}
          onChange={handleChange}
          className="input resize-none"
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
          className="input"
          required
        />

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) => handleGoogleLogin(res.credential!)}
            onError={() => toast.error("Google login failed")}
            theme="outline"
            size="large"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#0C831F] text-white font-bold"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}
