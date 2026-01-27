"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    type: "customer",
    password: "",
    authProvider: "local",
    address: {
      state: "",
      city: "",
      fullAddress: "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    try {
      await axios.post(
        "https://zep-it-back.onrender.com/api/auth/signup",
        form
      );

      alert("Signup successful");
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
      localStorage.setItem("isAuthenticated", "true");

      router.push("/");
    } catch {
      alert("Google signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow border space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-[#0C831F]">
          Create Account
        </h2>

        <input className="input" name="name" placeholder="Name" required onChange={handleChange} />
        <input className="input" type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input className="input" name="username" placeholder="Username" required onChange={handleChange} />
        <input className="input" type="tel" name="phone" placeholder="Phone" required onChange={handleChange} />

        <select name="type" className="input" required onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="shop">Shop</option>
        </select>

        <input className="input" name="address.state" placeholder="State" required onChange={handleChange} />
        <input className="input" name="address.city" placeholder="City" required onChange={handleChange} />
        <textarea className="input" name="address.fullAddress" placeholder="Full Address" required onChange={handleChange} />

        <input className="input" type="password" name="password" placeholder="Password" required onChange={handleChange} />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#0C831F] text-white font-bold"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <GoogleLogin
          onSuccess={(res) => handleGoogleLogin(res.credential!)}
          onError={() => alert("Google Login Failed")}
        />
      </form>
    </div>
  );
}
