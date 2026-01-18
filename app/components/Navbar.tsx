"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = () => {
      setUserName(localStorage.getItem("name"));
    };

    loadUser();
    window.addEventListener("authChanged", loadUser);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("authChanged", loadUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChanged"));
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50">
      <div className="bg-white border border-[#E0E0E0] rounded-2xl px-6 py-3 flex justify-between items-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">

        {/* LEFT: App Name */}
        <Link
          href="/"
          className="text-xl font-bold text-[#1C1C1C]"
        >
          zep-it
        </Link>

        {/* RIGHT: Cart + Profile */}
        <div className="flex items-center gap-4">

          {/* Cart Button */}
          <Link
            href="/cart"
            className="px-4 py-2 rounded-xl font-semibold border border-[#0C831F] text-[#0C831F] hover:bg-[#0C831F] hover:text-white transition"
          >
            Cart
          </Link>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-[#F4F6FB] px-4 py-2 rounded-xl hover:bg-[#EAECEF] transition"
            >
              <div className="w-8 h-8 rounded-full bg-[#0C831F] text-white font-bold flex items-center justify-center">
                {userName ? userName[0].toUpperCase() : "?"}
              </div>
              <span className="text-sm text-[#1C1C1C]">
                {userName || "Profile"}
              </span>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-44 bg-white text-black border border-[#E0E0E0] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">

                {!userName ? (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm hover:bg-[#F4F6FB]"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 text-sm hover:bg-[#F4F6FB]"
                    >
                      Signup
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-[#F4F6FB]"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-[#D32F2F] hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
