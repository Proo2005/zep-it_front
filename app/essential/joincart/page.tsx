"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinCart() {
  const [code, setCode] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white shadow p-6 rounded-xl w-80">
        <h2 className="text-xl font-bold mb-4">Join Shared Cart</h2>

        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Enter cart code"
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={() => router.push(`/joincart/${code}`)}
          className="w-full bg-green-600 text-black py-2 rounded font-bold"
        >
          Join Cart
        </button>
      </div>
    </div>
  );
}
