"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiCreditCard,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiUser,
  FiShoppingBag,
  FiDollarSign,
} from "react-icons/fi";
import { Snippet } from "@heroui/snippet";
import { GoShareAndroid } from "react-icons/go";
import { FcAbout } from "react-icons/fc";
import { RiAccountCircle2Line } from "react-icons/ri"
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTwitter } from "react-icons/fa";
import { Tooltip } from "@heroui/tooltip";
import { Divider } from "@heroui/divider";
import { MdAdminPanelSettings } from "react-icons/md";
export default function ProfilePage() {
  const router = useRouter();
  const appLink = "https://zep-it-front.vercel.app/";

  const [shareOpen, setShareOpen] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    type: "customer",

  });

  useEffect(() => {
    setUser({
      name: localStorage.getItem("name") || "User",
      email: localStorage.getItem("email") || "user@email.com",
      username: localStorage.getItem("username") || "user012",
      phone: localStorage.getItem("phone") || "+91 XXXXX XXXXX",
      type: localStorage.getItem("type") || "customer",
    });
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push("/navitems/login");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(appLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24 text-black">
      <div className="max-w-6xl mx-auto  pt-32 ">

        {/* USER INFO CARD */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0C831F] to-[#2ECC71] text-white font-bold flex items-center justify-center text-2xl shadow">
              {user.name[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>

              <p className="text-gray-600 text-sm">
                @{user.username}
              </p>

              <p className="text-gray-500 text-xs">
                📞 {user.phone}
              </p>
            </div>

          </div>
          <button
            onClick={logout}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
          >
            <FiLogOut /> <Tooltip className=" text-gray-600" content="Logout">Logout</Tooltip>
          </button>

        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-8">
          <ActionBox
            icon={<FiShoppingBag />}
            title="Order History"
            onClick={() => router.push("/profileitems/history")}

          />
          <ActionBox
            icon={<FiDollarSign />}
            title="Zep-It Money"
            onClick={() => router.push("/profileitems/wallet")}
          />
          <ActionBox
            icon={<FiHelpCircle />}
            title="Need Help?"
            onClick={() => router.push("/profileitems/need-help")}
          />
        </div>


        {/* MAIN SECTIONS */}
        <Section title="Your Information">
          <ListItem
            icon={<FiShoppingBag />}
            text="Order History"
            onClick={() => router.push("/profileitems/history")}

          />
          <ListItem
            icon={<FiUser />}
            text="Stores Near Me"
            onClick={() => router.push("/profileitems/store")}
          />
          {user.type === "shop" && (
            <>
              <ListItem
                icon={<FiSettings />}
                text="Shop Monthly Analysis"
                onClick={() => router.push("/profileitems/analysis")}
              />
              <ListItem
                icon={<FiShoppingBag />}
                text="Add Item"
                onClick={() => router.push("/profileitems/add-item")}
              />
            </>
          )}
        </Section>
        <Divider className="my-4 text-gray-200" />
        <Section title="Payments & Coupons">
          <ListItem
            icon={<FiDollarSign />}
            text="Wallet"
            onClick={() => router.push("/profileitems/wallet")}
          />
          <ListItem
            icon={<FiDollarSign />}
            text="Split with friends"
            onClick={() => router.push("/profileitems/split")}
          />

          <DropdownItem title="Payment Settings" icon={<FiCreditCard />}>
            <DropdownOption
              text="Add Payment Method"
              onClick={() => router.push("/profileitems/payment-details")}
            />
            <DropdownOption
              text="Payment Info"
              onClick={() => router.push("/components/hovercard")}
            />
          </DropdownItem>

        </Section>
        <Divider className="my-4 text-gray-200" />

        <Section title="Other Information">
          <ListItem icon={<GoShareAndroid />} text="Share the App" onClick={() => setShareOpen(true)} />
          <ListItem icon={<FcAbout />} text="About Us" onClick={() => router.push("/profileitems/about-us")} />
          <ListItem icon={<RiAccountCircle2Line />} text="Account Privacy" onClick={() => router.push("/profileitems/account-privacy")} />
          <ListItem icon={<MdAdminPanelSettings />} text="Admin" onClick={() => router.push("/profileitems/admin")} />
        </Section>

        {/* SHARE MODAL */}
        {shareOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-80 p-6 relative text-black">
              <h2 className="text-xl font-bold mb-4">Share Zep-It</h2>
              <p className="text-sm text-gray-600 mb-4">
                Share the app with your friends and family!
              </p>

              {/* Snippet input field */}
              <div className="flex text-black">

                <a >{appLink}</a>
              </div>

              {/* Optional social share buttons */}
              <div className="flex justify-around mt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(appLink)}`}
                  target="_blank"
                  rel="noopener noreferrer" onClick={handleCopy}
                  className="bg-green-500 px-4 py-2 rounded-xl text-white font-semibold hover:bg-green-600 transition"
                >
                  <div className="flex gap-1 "> WhatsApp
                    <IoLogoWhatsapp />
                  </div>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(appLink)}&text=Check%20out%20Zep-It!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 px-4 py-2 rounded-xl text-white font-semibold hover:bg-blue-600 transition"
                >
                  <div className="flex gap-1 "> Twitter
                    <FaTwitter />
                  </div>

                </a>
              </div>

              <button
                onClick={() => setShareOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* ---------- COMPONENTS ---------- */}
      </div>
    </div>
  );

  /* ---------- REUSABLE COMPONENTS ---------- */
  function ActionBox({ title, onClick, icon }: any) {
    return (
      <div
        onClick={onClick}
        className="bg-white hover:bg-[#F4F6FB] cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center gap-2 font-semibold transition shadow-md"
      >
        <div className="text-2xl text-[#0C831F]">{icon}</div>
        <span className="text-sm">{title}</span>
      </div>
    );
  }

  function Section({ title, children }: any) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">{title}</h2>
        <div className="bg-white rounded-2xl divide-y divide-gray-200 shadow-md">{children}</div>
      </div>
    );
  }

  function ListItem({ text, onClick, danger, icon }: any) {
    return (
      <div
        onClick={onClick}
        className={`p-4 cursor-pointer flex items-center justify-between hover:bg-[#F4F6FB] transition ${danger ? "text-red-600 font-semibold" : ""
          }`}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-[#0C831F] text-lg">{icon}</div>}
          <span>{text}</span>
        </div>
        <span className="text-gray-400">›</span>
      </div>
    );
  }

  function DropdownItem({ title, children, icon }: any) {
    return (
      <details className="group">
        <summary className="p-4 cursor-pointer flex items-center justify-between hover:bg-[#F4F6FB]">
          <div className="flex items-center gap-3">
            {icon && <div className="text-[#0C831F] text-lg">{icon}</div>}
            <span>{title}</span>
          </div>
          <span className="group-open:rotate-180 transition">⌄</span>
        </summary>
        <div className="bg-[#F4F6FB]">{children}</div>
      </details>
    );
  }

  function DropdownOption({ text, onClick }: any) {
    return (
      <div
        onClick={onClick}
        className="p-4 pl-10 cursor-pointer hover:bg-[#EAECEF] text-gray-600"
      >
        {text}
      </div>
    );
  }
}
