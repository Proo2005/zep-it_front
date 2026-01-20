"use client";

import { useRouter } from "next/navigation";

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">Need Help?</h1>
          <p className="text-zinc-400 mt-2">
            We’re here to help you with orders, payments, wallet & account issues
          </p>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <HelpCard
            title="Orders & Reorders"
            desc="Track orders, reorder items, or report missing items"
          />
          <HelpCard
            title="Payments & Refunds"
            desc="UPI, card payments, failed transactions & refunds"
          />
          <HelpCard
            title="Zepit Wallet"
            desc="Wallet balance, add money, deductions & issues"
          />
          <HelpCard
            title="Account & Security"
            desc="Login issues, password, and data security"
          />
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <FAQ
              q="Why is my wallet showing insufficient balance?"
              a="Please refresh the page once. Wallet balance is loaded from secure storage. If the issue continues, contact support."
            />
            <FAQ
              q="My payment failed but money was deducted"
              a="Don’t worry. Failed payments are automatically refunded within 3–5 working days."
            />
            <FAQ
              q="How do I reorder previous items?"
              a="Go to Payment History and tap the Reorder button to add items back to your cart."
            />
            <FAQ
              q="Which payment methods are supported?"
              a="UPI, Debit/Credit Cards, and Zepit Wallet are fully supported."
            />
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Contact Support</h2>

          <div className="space-y-3 text-zinc-300">
            <p>
              📧 <span className="font-medium">Email:</span> support@zepit.com
            </p>
            <p>
              📞 <span className="font-medium">Phone:</span> +91 9XXXX XXXXX
            </p>
            <p>
              🕒 <span className="font-medium">Support Hours:</span> 9 AM – 9 PM
            </p>
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

/* Components */

function HelpCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 hover:border-green-600 transition">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{desc}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
      <p className="font-semibold text-white">{q}</p>
      <p className="text-zinc-400 text-sm mt-1">{a}</p>
    </div>
  );
}
