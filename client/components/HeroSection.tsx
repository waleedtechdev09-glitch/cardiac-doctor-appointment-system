"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Stethoscope, ArrowRight, Activity } from "lucide-react";
import { APP_CONFIG } from "../constant.js";
import Link from "next/link.js";

const HeroSection = () => {
  const { name, colors } = APP_CONFIG;

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#0f172a]">
      {/* 1. BACKGROUND VIDEO LAYER */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/cardio.mp4" type="video/mp4" />
          <div className="w-full h-full bg-[#0f172a]" />
        </video>

        {/* Overlay optimized for mobile (darker on bottom) */}
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent backdrop-blur-[1px]" />

        {/* Glow - slightly smaller on mobile */}
        <div className="absolute top-1/4 right-[-10%] md:right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-red-600/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
      </div>

      {/* 3. CONTENT LAYER */}
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-16">
        <div className="max-w-4xl space-y-8 md:space-y-10 text-center md:text-left">
          {/* Status Badge - Centered on mobile */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mx-auto md:mx-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-[9px] md:text-[10px] font-bold text-slate-200 uppercase tracking-[0.2em] md:tracking-[0.3em]">
              Now Accepting Appointments
            </span>
          </div>

          {/* Main Heading - Adjusted for small screens */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1] md:leading-[0.9]">
              Advanced <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                Heart Care.
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg lg:text-xl max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium">
              Experience world-class cardiology with{" "}
              <span className="text-white border-b-2 border-red-600 pb-0.5">
                {name}
              </span>
              . Precision diagnostics and compassionate treatment for your
              heart.
            </p>
          </div>

          {/* 4. BUTTONS SECTION - Stacked on mobile, side-by-side on desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 md:gap-6 pt-4">
            <Button
              className={`h-14 w-full sm:w-auto px-10 cursor-pointer ${colors.primary} ${colors.primaryHover} text-white rounded-md text-md font-bold shadow-[0_20px_40px_rgba(220,38,38,0.2)] transition-all active:scale-95 group flex items-center justify-center gap-3`}
            >
              <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <Link href="/booking">
                <span className="text-white">Book Appointment</span>
              </Link>
            </Button>

            {/* <Button
              variant="outline"
              className="h-14 w-full sm:w-auto px-10 cursor-pointer bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-md rounded-xl text-md font-bold flex items-center justify-center gap-3 group"
            >
              <Stethoscope className="w-5 h-5 text-red-500" />
              Our Services
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all hidden sm:flex" />
            </Button> */}
          </div>

          {/* Trust Line - More compact on mobile */}
          <div className="flex items-center justify-center md:justify-start gap-6 md:gap-10 pt-8 md:pt-10 border-t border-white/10">
            <div className="space-y-0.5 md:space-y-1">
              <p className="text-xl md:text-2xl font-black text-white ">5k+</p>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold md:text-slate-500 text-white">
                Happy Patients
              </p>
            </div>
            <div className="w-[1px] h-8 md:h-10 bg-white/10" />
            <div className="space-y-0.5 md:space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Activity className="w-3.5 h-3.5 md:w-4 h-4 text-red-600 animate-pulse" />
                <p className="text-xl md:text-2xl font-black text-white">
                  24/7
                </p>
              </div>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold md:text-slate-500 text-white">
                Emergency Support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Side Accent Line - Hidden on very small screens for cleanliness */}
      <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-red-600 to-transparent opacity-50 shadow-[0_0_15px_rgba(220,38,38,0.5)] hidden md:block" />
    </section>
  );
};

export default HeroSection;
