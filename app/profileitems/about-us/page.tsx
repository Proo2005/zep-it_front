"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24 text-black">
      <div className="max-w-7xl mx-auto  gap-8 pt-32">

        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            About Zepit
          </h1>
          <p className="text-zinc-400 max-w-3xl mx-auto text-lg">
            Zepit is a modern, fast and reliable platform designed to simplify
            everyday shopping, payments, and wallet management — all in one
            seamless experience.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8">
          <InfoCard
            title="Our Mission"
            text="To make daily shopping and payments effortless by combining
                  smart technology, secure transactions, and lightning-fast
                  service."
          />
          <InfoCard
            title="Our Vision"
            text="To become a trusted digital companion for millions by building
                  a transparent, secure, and user-first ecosystem."
          />
        </section>

        {/* What We Do */}
        <section>
          <h2 className="text-3xl font-bold mb-6">
            What We Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Smart Shopping"
              desc="Discover nearby stores, browse products, and reorder
                    instantly with just a few clicks."
            />
            <FeatureCard
              title="Secure Payments"
              desc="Pay safely using UPI, cards, or Zepit Wallet with bank-grade
                    security."
            />
            <FeatureCard
              title="Zepit Wallet"
              desc="Add money, track balance, and enjoy quick checkout without
                    repeated payments."
            />
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-3xl font-bold mb-6">
            How Zepit Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StepCard step="1" title="Sign Up" />
            <StepCard step="2" title="Choose Store & Items" />
            <StepCard step="3" title="Pay Securely" />
            <StepCard step="4" title="Fast Delivery" />
          </div>
        </section>

        {/* Trust & Security */}
        <section className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Trust & Security
          </h2>
          <p className="text-zinc-400 max-w-3xl mx-auto">
            We prioritize your privacy and security. All transactions are
            encrypted, sensitive data is protected, and wallet operations are
            handled with strict validation and monitoring.
          </p>
        </section>

        {/* Closing */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-bold">
            Built for Speed. Designed for Trust.
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Zepit is built with a single goal — to make your daily shopping and
            payments smooth, safe, and stress-free.
          </p>
        </section>

      </div>
    </div>
  );
}

/* Components */

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white border border-zinc-800 rounded-2xl p-8">
      <h3 className="text-2xl font-semibold text-black mb-3">{title}</h3>
      <p className="text-zinc-400">{text}</p>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white border border-zinc-800 rounded-2xl p-6 hover:border-green-600 transition">
      <h4 className="text-xl font-semibold text-black mb-2">{title}</h4>
      <p className="text-zinc-400 text-sm">{desc}</p>
    </div>
  );
}

function StepCard({ step, title }: { step: string; title: string }) {
  return (
    <div className="bg-white border border-zinc-800 rounded-2xl p-6 text-center">
      <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-green-600 text-black font-bold flex items-center justify-center">
        {step}
      </div>
      <p className="font-semibold text-black">{title}</p>
    </div>
  );
}
