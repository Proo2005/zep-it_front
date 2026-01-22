"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://zep-it-back.onrender.com/api/auth/login",
        form
      );

      const { token, user } = res.data;

      /* ===============================
         🔐 AUTH STORAGE (MAIN)
      =============================== */
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      /* ===============================
         🔁 BACKWARD COMPAT (Navbar etc.)
      =============================== */
      localStorage.setItem("userId", user._id || user.id);
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("type", user.type);

      if (user.city) localStorage.setItem("city", user.city);
      if (user.state) localStorage.setItem("state", user.state);
      if (user.fullAddress) localStorage.setItem("Address", user.fullAddress);
      /* ===============================
         ✅ AUTH FLAGS
      =============================== */
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loggedInAt", new Date().toISOString());

      // Notify Navbar / Guards
      window.dispatchEvent(new Event("authChanged"));

      // Redirect based on role
      if (user.type === "customer") {
        router.push("/");
      } else {
        router.push("/shop-items");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0C831F]/20 to-[#2ECC71]/20 px-4 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6"
      >
        <h2 className="text-3xl font-bold text-[#0C831F] text-center">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600">
          Log in to continue to your account
        </p>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col relative">
          <label className="text-sm font-semibold mb-1 text-gray-700">Password</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500 text-sm hover:text-gray-800"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <a href="/forgot-password" className="text-green-600 font-semibold hover:underline text-sm">
            Forgot Password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0C831F] to-[#2ECC71] text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup link */}
        <p className="text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/navitems/signup" className="text-green-600 font-semibold hover:underline">
            Signup
          </a>
        </p>
      </form>
    </div>
  );
}
