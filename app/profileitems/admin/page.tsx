"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MonthlyAnalysisPage from "../admin/page";
import API from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  /* ------------------ Admin Verification ------------------ */
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await API.get("/user/me"); // must return req.user

        if (res.data.type !== "admin") {
          router.replace("/"); // or /unauthorized
          return;
        }
      } catch (err) {
        router.replace("/login");
        return;
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Loading admin dashboard...
      </div>
    );
  }

  /* ------------------ Admin Dashboard ------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 -mt-24 text-black">
      <div className="max-w-7xl mx-auto pt-32">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[600px]">
          {/* Sidebar */}
          <aside className="col-span-1 bg-white rounded-2xl shadow-md p-6 space-y-4 sticky top-32 h-[calc(100vh-128px)]">
            <h2 className="text-xl font-semibold mb-4">Tabs</h2>
            <ul className="space-y-2">
              <li className="px-3 py-2 rounded-xl hover:bg-green-50">
                <a href="/essential/contact-messages">Contact</a>
              </li>
              <li className="px-3 py-2 rounded-xl hover:bg-green-50">
                <a href="/essential/driver">Driver</a>
              </li>
              <li className="px-3 py-2 rounded-xl hover:bg-green-50">
                <a href="/essential/joincart">Join Cart</a>
              </li>
              <li className="px-3 py-2 rounded-xl hover:bg-green-50">
                <a href="/essential/shop-items">Shop Items</a>
              </li>
              <li className="px-3 py-2 rounded-xl hover:bg-green-50">
                <a href="/essential/uploadblinkitlocation">
                  Blinkit Locations
                </a>
              </li>
            </ul>
          </aside>

          {/* Content */}
          <main className="col-span-4 bg-white rounded-2xl shadow-md p-6 overflow-y-auto max-h-[calc(100vh-128px)]">
            <MonthlyAnalysisPage />
          </main>
        </div>
      </div>
    </div>
  );
}
