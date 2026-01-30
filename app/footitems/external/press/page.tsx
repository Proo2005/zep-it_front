import React from 'react';
import Link from 'next/link';
import { Download, ArrowRight, Mail, Calendar, ExternalLink, Menu, Search } from 'lucide-react';

// --- Types ---
interface PressRelease {
  id: number;
  title: string;
  source: string;
  date: string;
  link: string;
  category: "Corporate" | "Product" | "Expansion";
}

interface BrandAsset {
  title: string;
  format: string;
  size: string;
}

// --- Mock Data ---
const releases: PressRelease[] = [
  {
    id: 1,
    title: "Blinkit partners with Sony to deliver PlayStation 5 Slim in 10 minutes",
    source: "Economic Times",
    date: "April 05, 2024",
    link: "#",
    category: "Product"
  },
  {
    id: 2,
    title: "Zomato-owned Blinkit aims to add 100 more dark stores by FY25 end",
    source: "LiveMint",
    date: "March 22, 2024",
    link: "#",
    category: "Expansion"
  },
  {
    id: 3,
    title: "Blinkit launches 'Print Store' for document printing delivered in minutes",
    source: "TechCrunch",
    date: "Jan 15, 2024",
    link: "#",
    category: "Product"
  },
  {
    id: 4,
    title: "How quick commerce is changing the festive shopping behavior in India",
    source: "Forbes India",
    date: "Oct 10, 2023",
    link: "#",
    category: "Corporate"
  }
];

const assets: BrandAsset[] = [
  { title: "Blinkit Logo Pack (Primary & Monochrome)", format: "ZIP (SVG/PNG)", size: "2.4 MB" },
  { title: "Leadership Team Photos", format: "ZIP (JPG)", size: "15.8 MB" },
  { title: "B-Roll Footage (Warehouse & Delivery)", format: "MP4 (1080p)", size: "145 MB" },
];

export default function BlinkitPress() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-emerald-500">
            blinkit<span className="text-slate-900">press</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#" className="hover:text-emerald-600">News</Link>
            <Link href="#" className="hover:text-emerald-600">Media Kit</Link>
            <Link href="#" className="hover:text-emerald-600">Contact</Link>
            <div className="h-4 w-px bg-slate-300"></div>
            <Link href="/" className="text-emerald-600">Go to blinkit.com &rarr;</Link>
          </div>
          
          <button className="md:hidden p-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* --- Header / Hero --- */}
      <header className="bg-white py-20 px-6 border-b border-slate-200">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Newsroom & Media Resources
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Updates on our journey to build the future of instant commerce in India. 
            Find press releases, media assets, and contact details here.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- Left Column: News Feed (8 cols) --- */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Latest News</h2>
            <div className="flex gap-2">
               {/* Simple Category Filter Mockup */}
               {['All', 'Corporate', 'Product'].map((cat, idx) => (
                 <button key={cat} className={`px-3 py-1 text-xs font-semibold rounded-full border ${idx === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500'}`}>
                   {cat}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-6">
            {releases.map((item) => (
              <div key={item.id} className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-2">
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{item.category}</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {item.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <div className="text-sm text-slate-500">
                      Source: <span className="font-medium text-slate-700">{item.source}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <a href={item.link} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-colors">
              Load older releases
            </button>
          </div>
        </div>

        {/* --- Right Column: Sidebar (4 cols) --- */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Contact Card */}
          <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Media Inquiries</h3>
            <p className="text-slate-600 text-sm mb-6">
              For interviews, comments, or specific data requests, please reach out to our communications team.
            </p>
            <a href="mailto:press@blinkit.com" className="flex items-center gap-3 text-emerald-700 font-bold hover:underline">
              <Mail className="w-5 h-5" />
              press@blinkit.com
            </a>
          </div>

          {/* Media Kit / Assets */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Brand Assets</h3>
            <div className="space-y-4">
              {assets.map((asset, idx) => (
                <div key={idx} className="flex items-start justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm mb-1">{asset.title}</div>
                    <div className="text-xs text-slate-400">{asset.format} • {asset.size}</div>
                  </div>
                  <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 text-sm font-semibold text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
              View All Guidelines
            </button>
          </div>

          {/* About Blurb */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">About Blinkit</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Blinkit is India's leading instant delivery service. We deliver everything from groceries to electronics in minutes. We are on a mission to empower local businesses and simplify daily life for millions of Indians.
            </p>
            <Link href="/about" className="text-sm font-semibold text-emerald-600 hover:underline flex items-center gap-1">
              Read full story <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </main>

      {/* --- Simple Footer --- */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold text-slate-300 mb-4">blinkit</div>
          <p className="text-slate-400 text-sm">
            © 2026 Blink Commerce Private Limited. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}