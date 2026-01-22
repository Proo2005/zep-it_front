"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinCartPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (!code) return alert("Enter a cart code");
    router.push(`/navitems/cart/${code}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Join a Shared Cart</h1>
        <input
          type="text"
          placeholder="Enter Cart Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4 text-black"
        />
        <button
          onClick={handleJoin}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-xl font-bold transition"
        >
          Join Cart
        </button>
      </div>
    </div>
  );
}
