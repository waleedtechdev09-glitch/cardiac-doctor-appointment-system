"use client";
import React from "react";
import {
  CheckCircle2,
  Mail,
  Clock,
  ArrowLeft,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APP_CONFIG } from "../../constant.js";

const BookingSuccessPage = () => {
  const { name } = APP_CONFIG;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-50 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 max-w-2xl text-center">
        {/* Success Icon */}
        <div className="relative inline-block mb-8">
          <div className="w-54 h-54 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle2 className="w-22 h-22 text-red-500" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Your Booking Request <br />
            <span className="text-red-600">Has Been Sent!</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-lg mx-auto">
            Our cardiac experts are now reviewing your request. You will receive
            a confirmation via email shortly.
          </p>
        </div>

        {/* Action/Instruction Box */}
        <div className="bg-slate-50 border border-slate-100 rounded p-8 md:p-10 mb-10 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <BellRing className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">
                Status Update
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                A doctor will **Accept** or **Reject** your request. You will be
                notified immediately of the decision.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <Mail className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tighter">
                Check Your Email
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Please keep an eye on your inbox and **Spam folder**. Your
                confirmation details will be sent there.
              </p>
            </div>
          </div>

          {/* Subtle Progress Bar */}
          <div className="mt-8 pt-6 border-t border-slate-200/60">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Current Progress
              </span>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest ">
                Pending Review
              </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 animate-pulse w-1/2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #dc2626 0%, #ef4444 50%, #dc2626 100%)",
                  backgroundSize: "200% 100%",
                }}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full h-12 px-10 cursor-pointer rounded bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-widest text-xs flex items-center gap-3 transition-all active:scale-95">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            {name} • Secure Cardiac Care • 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
