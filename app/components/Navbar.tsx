"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  IoPersonCircleOutline,
  IoCartOutline,
  IoMenu,
  IoClose,
} from "react-icons/io5";
import { AcmeLogo } from "./Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ---------------- LOAD USER ---------------- */
  const loadUser = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setUserName(null);
      return;
    }
    try {
      setUserName(JSON.parse(user).name);
    } catch {
      setUserName(null);
    }
  };

  /* ---------------- UPDATE CART COUNT ---------------- */
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalQty = cart.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    setCartCount(totalQty);
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    loadUser();
    updateCartCount();

    window.addEventListener("authChanged", loadUser);
    window.addEventListener("cartUpdated", updateCartCount);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("authChanged", loadUser);
      window.removeEventListener("cartUpdated", updateCartCount);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("cartUpdated"));
    window.location.href = "/navitems/login";
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-7xl z-50 shadow-lg rounded-2xl bg-white/60 backdrop-blur-lg border border-green-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center shadow-lg">
            <AcmeLogo />
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            zep-it
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            href="/navitems/cart"
            className="relative px-4 py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 shadow-md"
          >
            <Tooltip>
              <TooltipTrigger>
                <IoCartOutline size={20} />
              </TooltipTrigger>
              <TooltipContent>Proceed to Cart</TooltipContent>
            </Tooltip>

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-green-50 text-green-700 shadow-md"
            >
              <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                {userName ? userName[0].toUpperCase() : <IoPersonCircleOutline />}
              </div>
              <span className="text-sm">{userName || "Profile"}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border text-black">
                {!userName ? (
                  <>
                    <Link href="/navitems/login" className="block px-4 py-3 hover:bg-green-50">
                      Login
                    </Link>
                    <Link href="/navitems/signup" className="block px-4 py-3 hover:bg-green-50">
                      Signup
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/navitems/profile" className="block px-4 py-3 hover:bg-green-50">
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 rounded-xl bg-green-50 text-green-700"
          >
            {mobileMenu ? <IoClose size={24} /> : <IoMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
