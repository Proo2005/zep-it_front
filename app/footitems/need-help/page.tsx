"use client";

import { useRouter } from "next/navigation";
import {Accordion, AccordionItem} from "@heroui/accordion";

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-14">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Need Help?
          </h1>
          <p className="text-zinc-400 mt-3 max-w-xl mx-auto">
            Get quick answers for orders, payments, wallet issues, and account security
          </p>
        </div>

        {/* HELP CATEGORIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HelpCard
            title="Orders & Reorders"
            desc="Track orders, reorder items, or report missing products"
          />
          <HelpCard
            title="Payments & Refunds"
            desc="UPI, cards, failed transactions & refund timelines"
          />
          <HelpCard
            title="Zepit Wallet"
            desc="Balance issues, add money, deductions & errors"
          />
          <HelpCard
            title="Account & Security"
            desc="Login problems, password reset & data protection"
          />
        </div>

        {/* FAQ ACCORDION */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">
            Frequently Asked Questions
          </h2>

          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-2">
            <Accordion variant="splitted">
              <AccordionItem
                key="1"
                title="Why is my wallet showing insufficient balance?"
                subtitle="Wallet & balance issues"
              >
                Wallet balance loads from secure storage. Please refresh once.
                If the issue continues, contact support for manual verification.
              </AccordionItem>

              <AccordionItem
                key="2"
                title="Payment failed but money was deducted"
                subtitle="Refund & transaction safety"
              >
                Failed payments are automatically reversed within 3–5 working days.
                You’ll receive a confirmation once refunded.
              </AccordionItem>

              <AccordionItem
                key="3"
                title="How do I reorder previous items?"
                subtitle="Order history & reorders"
              >
                Go to Order History and tap the Reorder button to add items
                back into your cart instantly.
              </AccordionItem>

              <AccordionItem
                key="4"
                title="Which payment methods are supported?"
                subtitle="UPI, cards & wallet"
              >
                We support UPI, Debit/Credit Cards, Net Banking,
                and Zepit Wallet across all regions.
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* CONTACT SUPPORT */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">
            <a href="/footitems/contact">Contact Support</a>
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 text-zinc-300">
            <p>📧 <span className="font-medium">support@zepit.com</span></p>
            <p>📞 <span className="font-medium">+91 9XXXX XXXXX</span></p>
            <p>🕒 <span className="font-medium">9 AM – 9 PM</span></p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-2 rounded-xl transition"
          >
            Go Back Home
          </button>
        </div>

      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function HelpCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 hover:border-green-600 hover:scale-[1.02] transition">
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-zinc-400 text-sm">
        {desc}
      </p>
    </div>
  );
}
