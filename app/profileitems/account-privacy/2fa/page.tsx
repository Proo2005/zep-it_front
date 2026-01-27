"use client";

import { useState } from "react";
import axios from "axios";

export default function TwoFactorAuth() {
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"send" | "verify">("send");
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("token");

  const sendOtp = async () => {
    try {
      await axios.post(
        "https://zep-it-back.onrender.com/api/2fa/send-otp",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStep("verify");
      alert("OTP sent to your email");
    } catch {
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(
        "https://zep-it-back.onrender.com/api/2fa/verify-otp",
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch {
      alert("Invalid or expired OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-center text-[#0C831F]">
          Two-Factor Authentication
        </h2>

        {step === "send" && (
          <button
            onClick={sendOtp}
            className="w-full bg-[#0C831F] text-white py-2 rounded-lg"
          >
            Send OTP to Email
          </button>
        )}

        {step === "verify" && (
          <>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full border px-3 py-2 rounded-lg"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-[#0C831F] text-white py-2 rounded-lg"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>

      {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center space-y-3">
            <h3 className="text-lg font-bold text-green-600">
              ✅ 2FA Enabled
            </h3>
            <p>Your account is now protected with 2FA</p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-[#0C831F] text-white px-4 py-2 rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
