
"use client";
import Link from 'next/link';
import { ArrowRight, Menu, Heart, Users, Activity, Smile } from 'lucide-react';

export default function EternalCareers() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black -mt-24">
      
      

      {/* --- Hero Section --- */}
      <main className="pt-40 pb-20 px-6   pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-medium leading-tight mb-12 tracking-tight">
            Hiring is the most <br />
            <span className="text-neutral-500">important role at Eternal.</span>
          </h1>
          
          <div className="space-y-8 text-lg md:text-xl text-neutral-400 leading-relaxed font-light max-w-3xl">
            <p>
              Identifying, recruiting, and enabling the right people in the right teams is by far one of the highest leverage roles any of us play within the organization.
            </p>
            <p>
              We are always on the lookout for exceptional folks to join Eternal, no matter their experience. If you're passionate about what we're building, we'll find a place for you.
            </p>
            <p className="text-white font-medium">
              We create opportunities around great people, not the other way around.
            </p>
          </div>
        </div>
      </main>

      {/* --- The Checklist (Manifesto) --- */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-2xl font-medium mb-10">
            When we meet potential team members, <br />we ask ourselves:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Are they smarter than us?",
              "Are they more ambitious than us?",
              "Do they take full ownership of their lives?",
              "Are they comfortable saying, “I don't know”?"
            ].map((question, idx) => (
              <div key={idx} className="p-8 border border-white/10 rounded-2xl bg-neutral-900/20 hover:bg-neutral-900/40 transition-colors">
                <span className="text-neutral-600 block mb-4 text-sm font-mono">0{idx + 1}</span>
                <h3 className="text-xl text-neutral-200">{question}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Referral Note (Distinct UI Element) --- */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-white text-black rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-medium mb-6 tracking-tight">
              We only accept applications <br />through employee referrals.
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl">
              Find someone in our team who can vouch for you, and have a conversation with them. That's where it all starts.
            </p>
            <div className="inline-flex items-center gap-2 font-medium border-b border-black pb-0.5 hover:opacity-70 cursor-pointer transition-opacity">
              Learn why we do this <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          
          {/* Abstract Pattern Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-200 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
        </div>
      </section>

      {/* --- Benefits Section --- */}
      <section className="py-20 px-6 border-t border-white/10 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-medium mb-16">At Eternal, we care for each other</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard 
              icon={<Heart className="w-6 h-6" />}
              title="Period leave"
              desc="We offer 10 days of paid period leave in a year to women and trans employees to cater to their health when needed."
            />
            <BenefitCard 
              icon={<Users className="w-6 h-6" />}
              title="Equal parental leave"
              desc="Both mothers and fathers get 26 weeks of paid leave, which can be taken anytime within the first three years."
            />
            <BenefitCard 
              icon={<Activity className="w-6 h-6" />}
              title="Health and fitness"
              desc="Our in-house fitness coaches and nutritionists focus on creating a healthier work environment for all."
            />
            <BenefitCard 
              icon={<Smile className="w-6 h-6" />}
              title="Wellness support"
              desc="Eternals get access to a team of counsellors, to help navigate challenging situations in their lives."
            />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-20 px-6 border-t border-white/10 text-sm text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          
          <div className="space-y-6">
            <div className="text-2xl font-medium text-white tracking-tight">Eternal</div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-neutral-600">Our Businesses</span>
              <div className="flex flex-wrap gap-4 text-neutral-300">
                <span className="hover:text-white cursor-pointer">Zomato</span>
                <span className="hover:text-white cursor-pointer">Zep-It</span>
                <span className="hover:text-white cursor-pointer">District</span>
                <span className="hover:text-white cursor-pointer">Hyperpure</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="/footitems/about-us" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Culture</a></li>
                <li><a href="/footitems/eternal/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="" className="hover:text-white transition-colors">Investors</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="/footitems/eternal/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/footitems/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/footitems/account-privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/footitems/terms" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex justify-between items-center">
          <p>© 2026 Eternal Ltd.</p>
          <div className="flex gap-4">
             {/* Social Placeholders */}
             <div className="w-5 h-5 bg-neutral-800 rounded-full"></div>
             <div className="w-5 h-5 bg-neutral-800 rounded-full"></div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Helper Component for Benefits
function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group">
      <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-black transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
      <p className="text-neutral-400 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}