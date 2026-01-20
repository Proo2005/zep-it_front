"use client";

import Link from "next/link";
import {
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-[#0C831F]">Zep-It</h2>
          <p className="text-sm text-gray-600 mt-2">
            Fast, reliable local shopping delivered to your doorstep.
          </p>
        </div>

        {/* ACCOUNT */}
        <div>
          <h3 className="font-semibold mb-3  text-black">Account</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/navitems/profile" className="hover:text-[#0C831F]">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/profileitems/history" className="hover:text-[#0C831F]">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/profileitems/wallet" className="hover:text-[#0C831F]">
                Wallet
              </Link>
            </li>
            
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="font-semibold mb-3 text-black">Company</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/footitems/about-us" className="hover:text-[#0C831F]">
                About Us
              </Link>
            </li>
            
            <li>
              <Link href="/footitems/account-privacy" className="hover:text-[#0C831F]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/footitems/terms" className="hover:text-[#0C831F]">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="font-semibold mb-3  text-black">Support</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/footitems/need-help" className="hover:text-[#0C831F]">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/footitems/contact" className="hover:text-[#0C831F]">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/footitems/contact" className="hover:text-[#0C831F]">
                Report an Issue
              </Link>
            </li>
            
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-200 py-6 px-6 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Zep-It. All rights reserved.
        </p>

        <div className="flex gap-4 mt-4 sm:mt-0 text-gray-500 text-lg">
          <a href="#" className="hover:text-[#0C831F]">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-[#0C831F]">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-[#0C831F]">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
