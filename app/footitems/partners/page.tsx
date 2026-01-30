"use client";


import Link from 'next/link';
import { ArrowRight, Store, Building2, Package, Truck, Menu } from 'lucide-react';

// --- Types for Data ---
interface Opportunity {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

// --- Data ---
const opportunities: Opportunity[] = [
  {
    title: "Partner Store",
    description: "Run partner stores for Blinkit. Manage inventory and operations efficiently to serve your neighborhood.",
    icon: <Store className="w-8 h-8 text-emerald-600" />,
    link: "#"
  },
  {
    title: "Rent your property",
    description: "Your property can become our next dark store. Steady rental income assured with long-term leases.",
    icon: <Building2 className="w-8 h-8 text-emerald-600" />,
    link: "#"
  },
  {
    title: "Seller",
    description: "List your products on Blinkit and reach customers instantly in your city without logistics hassles.",
    icon: <Package className="w-8 h-8 text-emerald-600" />,
    link: "#"
  },
  {
    title: "Deliver",
    description: "Deliver items from a Blinkit partner store to customers. Flexible hours and competitive payout.",
    icon: <Truck className="w-8 h-8 text-emerald-600" />,
    link: "#"
  }
];

const testimonials: Testimonial[] = [
  {
    quote: "I am working with a world class team... My orders have grown from ~100 per day to over 3500 orders per day.",
    author: "Ajay Ramani",
    role: "Store Partner"
  },
  {
    quote: "Working here has brought financial stability in my life. The best part is the flexibility in working hours.",
    author: "Vamshi Krishna",
    role: "Delivery Partner"
  },
  {
    quote: "We list thousands of items on Blinkit... This partnership has turned out to be a life saver during tough times.",
    author: "Kanchan Singh",
    role: "Local Partner"
  }
];

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-emerald-100 -mt-24">
      {/* --- Hero Section --- */}
      <section className="pt-20 pb-24 px-6 text-center max-w-4xl mx-auto pt-32">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          Shape the future of <br />
          <span className="text-emerald-600">instant commerce</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          We believe our tech stack can empower thousands of local entrepreneurs.
          Join the revolution and deliver groceries, medicines, and electronics to millions.
        </p>
        <button className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-200 transform hover:-translate-y-1">
          Partner with us
        </button>
      </section>

      {/* --- Opportunities Grid --- */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Opportunities to grow</h2>
            <p className="text-slate-500">Choose how you want to partner with us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {opportunities.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group cursor-pointer"
              >
                <div className="mb-6 p-3 bg-emerald-50 w-fit rounded-xl group-hover:bg-emerald-100 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
                <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Know more <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Partner Testimonials</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-2xl border-l-4 border-emerald-500 relative">
                <p className="text-slate-600 italic mb-6 leading-relaxed">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-slate-900">{t.author}</div>
                  <div className="text-emerald-600 text-xs font-bold uppercase tracking-wider mt-1">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-emerald-50/50 pt-16 pb-8 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              {[
                { label: "About", href: "/footitems/about-us" },
                { label: "Careers", href: "/careers" },
                { label: "Blog", href: "/blog" },
                { label: "Press", href: "/press" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-emerald-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">For Partners</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              {['Franchise', 'Seller', 'Warehouse', 'Deliver'].map(i => (
                <li key={i}><a href="#" className="hover:text-emerald-600 transition-colors">{i}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Help & Support</li>
              <li>Partner Support</li>
              <li>info@zep-it.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Social</h4>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">IG</div>
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">TW</div>
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs">LN</div>
            </div>
          </div>
        </div>
        <div className="text-center text-slate-400 text-sm border-t border-emerald-100/50 pt-8">
          © 2026 Zep-It. All rights reserved.
        </div>
      </footer>
    </div>
  );
}