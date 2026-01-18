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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      const { token, user } = res.data;

      // Save everything in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("type", user.type);
      localStorage.setItem("loggedInAt", new Date().toISOString());

      window.dispatchEvent(new Event("authChanged"));


      alert("Login successful");
      if (user.type === "customer") {
        router.push("/"); // forward to home page
      } else {
        router.push("/shop-items"); // forward to add-item page
      }

    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-white text-xl font-bold">Login</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="input"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="input"
          required
        />

        <button className="w-full bg-green-500 text-black py-2 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
}
