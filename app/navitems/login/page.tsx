"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const router = useRouter();
  const [alertData, setAlertData] = useState<{
    type: "success" | "error";
    title: string;
    description: string;
  } | null>(null);

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

  /* ===============================
      NORMAL LOGIN
  =============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://zep-it-back.onrender.com/api/auth/login",
        form
      );

      handleAuthSuccess(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
      GOOGLE LOGIN
  =============================== */
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
      localStorage.setItem("email", user.email);
      localStorage.setItem("type", user.type || "customer");
      localStorage.setItem("username", user.username);
      localStorage.setItem("phone", user.phone);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("fullAddress", user.fullAddress);
      window.dispatchEvent(new Event("authChanged"));

      setAlertData({
        type: "success",
        title: "Login successful",
        description: `Welcome ${user.name}!`,
      });
      setTimeout(() => {
        router.push("/");
      }, 1200
      );

    } catch {
      setAlertData({
        type: "error",
        title: "Google login failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };


  /* ===============================
      SHARED AUTH STORAGE
  =============================== */
  const handleAuthSuccess = ({ token, user }: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    localStorage.setItem("userId", user._id || user.id);
    localStorage.setItem("name", user.name);
    localStorage.setItem("email", user.email);
    localStorage.setItem("type", user.type);
    localStorage.setItem("username", user.username);
    localStorage.setItem("phone", user.phone);
    if (user.city) localStorage.setItem("city", user.city);
    if (user.state) localStorage.setItem("state", user.state);
    if (user.fullAddress) localStorage.setItem("fullAddress", user.fullAddress);

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("loggedInAt", new Date().toISOString());

    window.dispatchEvent(new Event("authChanged"));

    toast.success(`Welcome back, ${user.name}!`);

    if (user.type === "customer") {
      router.push("/");
    } else {
      router.push("/essential/shop-items");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black -mt-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-300 space-y-6"
      >
        <h2 className="text-3xl font-bold text-[#0C831F] text-center">
          Welcome Back
        </h2>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col relative">
          <label className="text-sm font-semibold mb-1">Password</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-sm text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0C831F] to-[#2ECC71] text-white font-bold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) => handleGoogleLogin(res.credential!)}
            onError={() => toast.error("Google login failed")}
            theme="outline"
            size="large"
          />
        </div>

        <p className="text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/navitems/signup" className="text-green-600 font-semibold">
            Signup
          </a>
        </p>
      </form>
    </div>
  );
}
