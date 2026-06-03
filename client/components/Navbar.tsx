"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Current page check karne ke liye
import { Button } from "@/components/ui/button";
import { HeartPulse, Menu, User, X } from "lucide-react";
import { APP_CONFIG } from "../constant.js";
import Link from "next/link";

const Navbar = () => {
  const { name } = APP_CONFIG;
  const pathname = usePathname(); // Path check karega (e.g., "/", "/contact")
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Home page check logic
  const isHomePage = pathname === "/";
  const isDoctorRoute = pathname.startsWith("/doctor");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const syncAuthState = () => {
      const rawUser = window.localStorage.getItem("authUser");

      setIsAuthenticated(
        Boolean(window.localStorage.getItem("authToken")) &&
          Boolean(rawUser),
      );
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", syncAuthState);
    syncAuthState();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  // Background color logic
  const navBg =
    isDoctorRoute || !isHomePage || isScrolled
      ? "bg-white border-b border-slate-100 py-3 shadow-md"
      : "bg-transparent py-6";

  const textColor = isDoctorRoute || !isHomePage || isScrolled ? "text-slate-900" : "text-white";
  const linkColor =
    !isHomePage || isScrolled
      ? "text-slate-600 hover:text-red-600"
      : "text-slate-300 hover:text-white";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${navBg}`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-red-600 p-2 rounded-xl group-hover:scale-110 transition-all shadow-lg shadow-red-600/30">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <span
            className={`text-2xl font-black tracking-tighter uppercase ${textColor}`}
          >
            {name}
            <span className="text-red-600">.</span>
          </span>
        </Link>

        {/* NAVIGATION */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { name: "Home", path: "/" },
            { name: "Services", path: "/service" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`relative text-[11px] font-bold uppercase tracking-[0.2em] transition-colors group py-2 ${linkColor}`}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        {isDoctorRoute ? (
          <div className="hidden md:flex items-center gap-5">
            <Button asChild className="bg-slate-900 cursor-pointer hover:bg-slate-800 text-white rounded-lg font-bold px-6 h-11 shadow-lg shadow-slate-900/20 flex gap-2 active:scale-95 transition-all">
              <Link href="/doctor/login" className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4" />
                Doctor Login
              </Link>
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-5">
            <Button asChild className="bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-lg font-bold px-6 h-11 shadow-lg shadow-red-600/20 flex gap-2 active:scale-95 transition-all">
              <Link href={isAuthenticated ? "/profile" : "/login"} className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {isAuthenticated ? "Profile" : "Patient Login"}
              </Link>
            </Button>
          </div>
        )}

        {/* MOBILE TOGGLE */}
        <button
          className={`md:hidden ${textColor}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-8 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          {[
            { name: "Home", path: "/" },
            { name: "Services", path: "/service" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="text-[11px] font-medium text-slate-900 border-l-4 border-transparent hover:border-red-600 pl-4 transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Button asChild className="bg-red-600 w-full h-12 rounded-lg font-bold shadow-lg shadow-red-600/20">
            <Link href={isAuthenticated ? "/profile" : "/login"} className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              {isAuthenticated ? "Profile" : "Patient Login"}
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
