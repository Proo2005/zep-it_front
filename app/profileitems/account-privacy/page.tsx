"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiShield, FiSmartphone, FiEyeOff, FiTrash2 } from "react-icons/fi";
import Footer from "@/app/components/Footer";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


export default function AccountPrivacyPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    type: "customer",
  });
  const [twoFA, setTwoFA] = useState(false);
  const [tracking, setTracking] = useState(true);

  useEffect(() => {
    setUser({
      name: localStorage.getItem("name") || "User",
      email: localStorage.getItem("email") || "user@email.com",
      phone: localStorage.getItem("phone") || "+91 XXXXX XXXXX",
      type: localStorage.getItem("type") || "customer",
    });
    // Example: load user settings from API in real app
    setTwoFA(localStorage.getItem("2fa") === "true");
    setTracking(localStorage.getItem("tracking") !== "false");

    const handleTwoFAEnabled = () => setTwoFA(true);
    window.addEventListener("twoFAEnabled", handleTwoFAEnabled);

    return () => {
      window.removeEventListener("twoFAEnabled", handleTwoFAEnabled);
    };

  }, []);

  const handleTwoFAChange = () => {
    if (!twoFA) {
      // Redirect to 2FA setup page
      router.push("/profileitems/tfa");
    } else {
      // Optionally: disable 2FA
      setTwoFA(false);
      localStorage.setItem("2fa", "false");
    }
  };

  const handleTrackingChange = () => {
    setTracking(!tracking);
    localStorage.setItem("tracking", (!tracking).toString());
  };

  const logout = () => {
    localStorage.clear();
    router.push("/navitems/login");
  };


  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Login required");

      const res = await fetch("https://zep-it-back.onrender.com/api/user/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to delete account");

      alert("Account deleted successfully!");
      localStorage.clear();
      router.push("/signup");
    } catch (err: any) {
      alert(err.message || "Error deleting account");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24 text-black">

      <div className="max-w-7xl mx-auto  gap-8 pt-32 ">
        <h1 className="text-3xl font-bold mb-6">Account Privacy</h1>

        {/* Account Info */}
        <Section title="Account Information" icon={<FiLock />}>
          <ListItem label="Name" value={user.name} />
          <ListItem label="Email" value={user.email} />
          <ListItem label="Phone" value={user.phone} />
        </Section>

        {/* Security Settings */}
        <Section title="Security Settings" icon={<FiShield />}>
          <ToggleItem
            label="Two-Factor Authentication"
            value={twoFA}
            onChange={handleTwoFAChange}
          />
          <ToggleItem
            label="Allow Tracking & Analytics"
            value={tracking}
            onChange={handleTrackingChange}
          />
        </Section>

        {/* Connected Devices */}
        <Section title="Connected Devices" icon={<FiSmartphone />}>
          <p className="p-4 text-gray-600">Devices currently logged in:</p>
          <ul className="divide-y divide-gray-200">
            <li className="px-4 py-3 flex justify-between items-center">
              <span>Chrome on Windows 10</span>
              <button className="text-red-500 hover:underline">Logout</button>
            </li>

          </ul>
        </Section>

        {/* Privacy Options */}
        <Section title="Privacy Preferences" icon={<FiEyeOff />}>
          <ToggleItem
            label="Hide Profile from Public"
            value={false}
            onChange={() => alert("Feature coming soon")}
          />
          <ToggleItem
            label="Limit Ads Personalization"
            value={true}
            onChange={() => alert("Feature coming soon")}
          />
        </Section>

        {/* Danger Zone */}
        <Section title="Danger Zone" icon={<FiTrash2 />}>
          <button
            onClick={logout}
            className="w-full py-2 px-4 mb-3 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
          >
            Logout
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="w-full py-2 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 transition"
              >
                Delete Account
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-black">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={deleteAccount}
                  className="bg-red-600 hover:bg-red-500 text-white"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </Section>
        <Footer />
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */
function Section({ title, children, icon }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-200 font-semibold text-lg">
        {icon && <div className="text-green-600 text-xl">{icon}</div>}
        <span>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ListItem({ label, value }: any) {
  return (
    <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
      <span>{label}</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

function ToggleItem({ label, value, onChange }: any) {
  return (
    <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
      <span>{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={value} onChange={onChange} className="sr-only" />
        <div className={`w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition`}></div>
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition peer-checked:translate-x-5`}
        ></div>
      </label>
    </div>
  );
}
