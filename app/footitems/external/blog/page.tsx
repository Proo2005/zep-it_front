"use client";
import Link from 'next/link';
import { Search, Menu, Twitter, Linkedin, Facebook, Instagram, ChevronRight, Clock, User } from 'lucide-react';

// --- Types ---
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string; // Using colors/placeholders for demo
}

// --- Mock Data ---
const categories = ["Everything", "Technology", "Culture", "Humans of Zep-It", "Newsroom", "Sustainability"];

const posts: BlogPost[] = [
  {
    id: 1,
    title: "Data Warehouse Journey With dbt",
    excerpt: "The data team has grown tremendously at Zep-It in the past 12 months; with increasing demands of optimisations, growth and efficiencies...",
    author: "Team Zep-It",
    date: "July 16, 2024",
    readTime: "6 mins read",
    category: "Technology",
    imageUrl: "bg-yellow-400" 
  },
  {
    id: 2,
    title: "Blinkit at WWDC 24: A Dream Come True",
    excerpt: "When I told Tim Cook about the 10 minute iPhone delivery by Zep-It his reaction was, 'that's crazy', and all I could think about was...",
    author: "Nupur Bharadwaj",
    date: "July 8, 2024",
    readTime: "5 mins read",
    category: "Culture",
    imageUrl: "bg-green-600"
  },
  {
    id: 3,
    title: "How we implemented continuous corners using squircles",
    excerpt: "In 1981, Xerox PARC introduced the first Graphical User Interface (GUI), marking a significant shift in computing. Here is how we...",
    author: "Kanishka Chaudhry",
    date: "March 7, 2024",
    readTime: "4 mins read",
    category: "Technology",
    imageUrl: "bg-blue-500"
  },
  {
    id: 4,
    title: "India's First Instant Print Delivery Store",
    excerpt: "A geeky walk through on what made Zep-It's print services a reality, and how we set up our infrastructure to create this quick application.",
    author: "Ritik Harchani",
    date: "May 19, 2023",
    readTime: "5 mins read",
    category: "Product",
    imageUrl: "bg-yellow-300"
  },
  {
    id: 5,
    title: "Meet Recipe Rover: Zep-It's generative AI engine",
    excerpt: "Zep-It introduces Recipe Rover, an AI-powered feature that revolutionizes the culinary experience for customers by providing personalized...",
    author: "Vaibhav Bhutani",
    date: "May 12, 2023",
    readTime: "5 mins read",
    category: "AI",
    imageUrl: "bg-emerald-500"
  },
  {
    id: 6,
    title: "In Focus: Sumanth Reddy",
    excerpt: "Sumanth Reddy is helping us build a resilient application platform at Zep-It. He currently works as a part of Software Resilience Engineering...",
    author: "Team Zep-It",
    date: "March 16, 2023",
    readTime: "4 mins read",
    category: "Humans of Zep-It",
    imageUrl: "bg-slate-800"
  }
];

export default function BlinkitBlog() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans - selection:bg-emerald-100 -mt-24 selection:text-green-800">

      

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <span className="text-green-600 font-bold tracking-widest text-sm uppercase mb-2 block">
            Lambda
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Learn about everything <br /> we do at Zep-It.
          </h1>
          
          {/* Categories Scrollable Bar */}
          <div className="flex overflow-x-auto gap-2 py-4 no-scrollbar border-b border-slate-100 mt-8">
            {categories.map((cat, idx) => (
              <button 
                key={cat}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  idx === 0 
                    ? 'bg-black text-white' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- Blog Grid --- */}
      <section className="py-12 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts.map((post) => (
            <article key={post.id} className="group cursor-pointer flex flex-col h-full">
              {/* Image Placeholder */}
              <div className={`w-full aspect-[16/9] rounded-2xl mb-6 overflow-hidden shadow-sm relative ${post.imageUrl}`}>
                {/* Overlay for hover effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow">
                {/* Meta Data */}
                <div className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 gap-2">
                  <span className="text-green-600">{post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-green-600 transition-colors">
                  {post.title}
                </h2>

                <p className="text-slate-500 text-base leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center text-xs text-slate-400 font-medium pt-4">
                  <Clock className="w-3 h-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-16">
          <button className="px-8 py-3 border border-slate-200 rounded-full text-slate-600 font-semibold hover:border-green-600 hover:text-green-600 transition-all">
            Load More Articles
          </button>
        </div>
      </section>

      {/* --- Newsletter --- */}
      <section className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Subscribe to our newsletter</h3>
          <p className="text-slate-500 mb-8">Get the latest updates on technology, culture, and business delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-5 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3 text-slate-500">
                <li><a href="/footitems/about-us" className="hover:text-green-600">About</a></li>
                <li><a href="/footitems/eternal/careers" className="hover:text-green-600">Careers</a></li>
                <li><a href="/footitems/eternal/blog" className="hover:text-green-600">Blog</a></li>
                <li><a href="/footitems/eternal/press" className="hover:text-green-600">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">For Partners</h4>
              <ul className="space-y-3 text-slate-500">
                <li><a href="#" className="hover:text-green-600">Franchise</a></li>
                <li><a href="#" className="hover:text-green-600">Seller</a></li>
                <li><a href="#" className="hover:text-green-600">Warehouse</a></li>
                <li><a href="#" className="hover:text-green-600">Deliver</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-3 text-slate-500">
                <li><a href="/footitems/account-privacy" className="hover:text-green-600">Privacy Policy</a></li>
                <li><a href="/footitems/terms" className="hover:text-green-600">Terms of Use</a></li>
                <li><a href="#" className="hover:text-green-600">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Follow us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:border-green-600 hover:text-green-600 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:border-green-600 hover:text-green-600 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:border-green-600 hover:text-green-600 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              <div className="mt-6">
                <p className="text-slate-400 text-xs">Download App</p>
                <div className="flex gap-2 mt-2">
                   <div className="w-24 h-8 bg-slate-200 rounded"></div>
                   <div className="w-24 h-8 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs">
             <p>© 2026 Zep-It Commerce Private Limited</p>
             <p className="mt-2 md:mt-0">“Zep-It” is owned & managed by "Blink Commerce Private Limited"</p>
          </div>
        </div>
      </footer>

    </div>
  );
}