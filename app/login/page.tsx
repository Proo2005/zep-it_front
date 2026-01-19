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
        "http://localhost:5000/api/auth/login",
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
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 w-full max-w-sm p-6 rounded-2xl space-y-5 shadow-lg"
      >
        <h2 className="text-white text-2xl font-semibold text-center">
          Welcome Back
        </h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-black py-2 rounded-lg font-semibold hover:bg-green-400 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-xl text-gray-100">
          Have an account? <a href="/signup" className="text-cyan">Signup</a>
        </p>
      </form>
    </div>
  );
}
