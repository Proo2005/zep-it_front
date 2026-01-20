"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { IoPersonCircleOutline } from "react-icons/io5";
import {Tooltip} from "@heroui/tooltip";
import { AcmeLogo } from "./Logo";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load user
    const loadUser = () => setUserName(localStorage.getItem("name"));
    loadUser();
    window.addEventListener("authChanged", loadUser);

    // Load cart count
    const loadCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalQty = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalQty);
    };
    loadCartCount();
    window.addEventListener("cartUpdated", loadCartCount);

    // Click outside to close dropdown
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("authChanged", loadUser);
      window.removeEventListener("cartUpdated", loadCartCount);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChanged"));
    window.location.href = "/navitems/login";
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-7xl z-50">
      <div className="backdrop-blur-xl bg-white/55 border border-white/30 rounded-2xl px-6 py-3 flex justify-between items-center">
        {/* APP NAME */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0C831F] to-[#2ECC71] flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-lg"><AcmeLogo /></span>
          </div>
          
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#0C831F] to-[#2ECC71] bg-clip-text text-transparent group-hover:opacity-90 transition">
            zep-it
          </span>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* CART */}
          <Link
            href="/navitems/cart"
            className="relative px-5 py-2 rounded-xl font-semibold text-sm bg-white/60 backdrop-blur border border-white/40 shadow-md hover:shadow-lg hover:bg-white/80 transition text-black"
          >
           <Tooltip  className=" text-gray-600"content="Proceed to Cart">Cart</Tooltip>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </Link>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/60 backdrop-blur border border-white/40 shadow-md hover:bg-white/80 transition"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0C831F] to-[#2ECC71] text-white font-bold flex items-center justify-center shadow">
                {userName ? userName[0].toUpperCase() : <IoPersonCircleOutline />}
              </div>
              <span className="text-sm font-medium text-[#1C1C1C]">{userName || "Profile"}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] overflow-hidden text-black">
                {!userName ? (
                  <>
                    <Link href="/navitems/login" className="block px-4 py-3 text-sm hover:bg-white/80 transition">
                      Login
                    </Link>
                    <Link href="/navitems/signup" className="block px-4 py-3 text-sm hover:bg-white/80 transition">
                      Signup
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/navitems//profile" className="block px-4 py-3 text-sm hover:bg-white/80 transition">
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
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
