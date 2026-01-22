"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { IoPersonCircleOutline, IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { Tooltip } from "@heroui/tooltip";
import { AcmeLogo } from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = () => setUserName(localStorage.getItem("name"));
    loadUser();
    window.addEventListener("authChanged", loadUser);

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalQty = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalQty);
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    // Detect cart changes in other tabs/components
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cart") updateCartCount();
    };
    window.addEventListener("storage", handleStorage);

    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("authChanged", loadUser);
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("cartUpdated"));
    window.location.href = "/navitems/login";
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-7xl z-50 shadow-lg rounded-2xl bg-white/90 backdrop-blur-md border border-green-200">
      <div className="flex items-center justify-between px-6 py-3">
        
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center shadow-lg">
            <AcmeLogo />
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent tracking-tight group-hover:opacity-90 transition">
            zep-it
          </span>
        </Link>

        

        {/* Right Items */}
        <div className="flex items-center gap-4">
          {/* Quick Links */}
          <div className="hidden md:flex gap-3">
            <Link href="/navitems/deals" className="px-4 py-2 rounded-full text-sm font-medium text-green-700 hover:bg-green-100 transition">
              Deals
            </Link>
            <Link href="/profileitems/history" className="px-4 py-2 rounded-full text-sm font-medium text-green-700 hover:bg-green-100 transition">
              Orders
            </Link>
          </div>

          {/* Cart */}
          <Link
            href="/navitems/cart"
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition shadow-md"
          >
            <Tooltip content="Proceed to Cart" className="text-gray-600">
              <IoCartOutline size={20} />
            </Tooltip>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition shadow-md"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-green-400 text-white font-bold flex items-center justify-center shadow">
                {userName ? userName[0].toUpperCase() : <IoPersonCircleOutline size={20} />}
              </div>
              <span className="text-sm font-medium">{userName || "Profile"}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md border border-green-200 rounded-xl shadow-lg overflow-hidden text-black">
                {!userName ? (
                  <>
                    <Link href="/navitems/login" className="block px-4 py-3 text-sm hover:bg-green-50 transition">
                      Login
                    </Link>
                    <Link href="/navitems/signup" className="block px-4 py-3 text-sm hover:bg-green-50 transition">
                      Signup
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/navitems/profile" className="block px-4 py-3 text-sm hover:bg-green-50 transition">
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
