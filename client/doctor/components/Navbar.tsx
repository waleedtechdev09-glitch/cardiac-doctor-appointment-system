"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HeartPulse, Menu, X, User } from "lucide-react";
import { APP_CONFIG } from "../../constant.js";
import Link from "next/link.js";

const Navbar = () => {
  const { name } = APP_CONFIG;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-[#0f172a]/90 backdrop-blur-md border-b border-white/5 py-3 shadow-2xl"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-red-600 p-2 rounded-xl group-hover:scale-110 transition-all shadow-lg shadow-red-600/30">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase">
            {name}
            <span className="text-red-600">.</span>
          </span>
        </Link>

        {/* NAVIGATION with Left-to-Right Hover Bar */}
        <div className="hidden md:flex items-center gap-10">
          {["Home", "Services", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-[12px] uppercase tracking-[0.2em] text-slate-300 hover:text-white transition-colors group py-2"
            >
              {item}
              {/* The Hover Bar Logic */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-5">
          <Button className="bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-md font-bold px-6 h-11 shadow-[0_10px_20px_rgba(220,38,38,0.2)] flex gap-2 active:scale-95 transition-all">
            <User className="w-4 h-4" />
            Patient Login
          </Button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0f172a] border-b border-white/10 p-8 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          {["Home", "Services", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-lg font-bold text-white border-l-2 border-transparent hover:border-red-600 pl-4 transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Button className="bg-red-600 w-full h-12 rounded-md cursor-pointer">
            Patient Login
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
