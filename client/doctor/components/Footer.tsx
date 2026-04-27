"use client";
import React from "react";
import { 
  HeartPulse, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowUpRight,
  Heart
} from "lucide-react";
import { APP_CONFIG } from "../../constant.js";

const Footer = () => {
  const { name, colors } = APP_CONFIG;
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: ["Services", "Expertise", "Risk Calculator", "Specialists"],
    },
    {
      title: "Support",
      links: ["Help Center", "Book Appointment", "Privacy Policy", "Terms of Service"],
    },
    {
      title: "Contact",
      links: ["+92 300 1234567", "support@cardiocare.com", "Wah Cantt, Punjab", "Clinic Locator"],
    },
  ];

  return (
    <footer className="bg-[#0f172a] pt-24 pb-12 overflow-hidden relative">
      {/* Background Decor - Red/Blue Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/5">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20 transition-transform group-hover:scale-110">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
                {name}
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              Revolutionizing cardiac care with data-driven diagnosis and 
              personalized medical expertise. Your heart health, our priority.
            </p>

            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="lg:col-span-2 space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a 
                      href="#" 
                      className="text-slate-400 text-sm font-medium hover:text-red-500 hover:translate-x-1 flex items-center gap-1 transition-all group"
                    >
                      {link}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          ))}

          {/* Newsletter / Contact Card */}
          <div className="lg:col-span-2 flex flex-col gap-6">
             <div className="p-6 rounded-3xl bg-gradient-to-br from-red-600 to-red-900 shadow-xl shadow-red-600/10">
                <h4 className="text-white font-black text-lg mb-2 leading-tight">Need Urgent Help?</h4>
                <p className="text-red-100 text-[10px] uppercase font-bold tracking-widest mb-4">Available 24/7</p>
                <button className="w-full py-3 bg-white text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                  Contact Us
                </button>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-xs font-medium tracking-wide">
            © {currentYear} {name}. All rights reserved. Designed with <Heart className="w-3 h-3 inline-block text-red-600 mx-1 fill-red-600" /> by 
            <span className="text-slate-300 ml-1">Mudassar & Team</span>
          </p>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Server: Online</span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">v1.0.4 - Production</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;