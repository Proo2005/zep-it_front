"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    setUser({
      name: localStorage.getItem("name") || "User",
      email: localStorage.getItem("email") || "user@email.com",
      phone: localStorage.getItem("phone") || "+91 XXXXX XXXXX",
      type: localStorage.getItem("type") || "customer",
    });
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#1C1C1C] px-6 py-6">
      {/* USER INFO */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-[#666666]">{user.email}</p>
        <p className="text-[#666666]">{user.phone}</p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <ActionBox title="Order History" onClick={() => router.push("/history")} />
        <ActionBox title="Zep-It Money" onClick={() => router.push("/wallet")} />
        <ActionBox title="Need Help?" onClick={() => router.push("/support")} />
      </div>

      {/* YOUR INFORMATION */}
      <Section title="Your Information">
        <ListItem text="Order History" onClick={() => router.push("/history")} />

        {user.type === "shop" && (
          <ListItem
            text="Shop Monthly Analysis"
            onClick={() => router.push("/analysis")}
          />
        )}
      </Section>

      {/* PAYMENT & COUPONS */}
      <Section title="Payments & Coupons">
        <ListItem text="Wallet" onClick={() => router.push("/wallet")} />
        <DropdownItem title="Payment Settings">
          <DropdownOption
            text="Add Payment Method"
            onClick={() => router.push("/payment-details")}
          />
          <DropdownOption
            text="Payment Info"
            onClick={() => router.push("/paymentinfo")}
          />
        </DropdownItem>
      </Section>

      {/* OTHER INFORMATION */}
      <Section title="Other Information">
        <ListItem text="Share the App" />
        <ListItem text="About Us" />
        <ListItem text="Account Privacy" />
        <ListItem text="Logout" danger onClick={logout} />
      </Section>
    </div>
  );


  /* ---------- COMPONENTS ---------- */
  function ActionBox({ title, onClick }: any) {
    return (
      <div
        onClick={onClick}
        className="bg-white hover:bg-[#F4F6FB] cursor-pointer rounded-xl p-4 text-center font-semibold transition shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      >
        {title}
      </div>
    );
  }

  function Section({ title, children }: any) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">{title}</h2>
        <div className="bg-white rounded-xl divide-y divide-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {children}
        </div>
      </div>
    );
  }

  function ListItem({ text, onClick, danger }: any) {
    return (
      <div
        onClick={onClick}
        className={`p-4 cursor-pointer flex justify-between items-center hover:bg-[#F4F6FB] transition ${danger ? "text-[#D32F2F] font-semibold" : ""
          }`}
      >
        {text}
        <span className="text-[#666666]">›</span>
      </div>
    );
  }

  function DropdownItem({ title, children }: any) {
    return (
      <details className="group">
        <summary className="p-4 cursor-pointer flex justify-between items-center hover:bg-[#F4F6FB]">
          {title}
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
        className="p-4 pl-8 cursor-pointer hover:bg-[#EAECEF] text-[#666666]"
      >
        {text}
      </div>
    );
  }
}