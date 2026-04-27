"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Image from "next/image";

// Import your constants
import { APP_CONFIG } from "../../../constant.js";

const VerifyOtpForm = () => {
  const { colors, sizing, name } = APP_CONFIG;

  // State for 6 digits
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-0 md:p-6 lg:p-8">
      {/* MAIN CONTAINER: Aligned with Login/Signup */}
      <div className="w-full max-w-300 grid grid-cols-1 md:grid-cols-2 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden md:rounded-3xl min-h-175 border border-slate-100">
        {/* LEFT SIDE: OTP Form */}
        <div className="w-full flex flex-col justify-center p-10 md:p-14 lg:p-20">
          <CardHeader className="p-0 space-y-3 mb-10">
            <div
              className={`w-fit mx-auto md:mx-0 ${colors.iconBg} p-4 rounded-2xl mb-2 group cursor-pointer transition-all duration-300 shadow-sm`}
            >
              <ShieldCheck
                className={`${sizing.iconSize} ${colors.textPrimary} transition-all duration-500 group-hover:fill-current group-hover:scale-110`}
              />
            </div>

            <CardTitle className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 text-center md:text-left">
              Verify Identity
            </CardTitle>
            <CardDescription className="text-slate-500 text-center md:text-left text-base leading-relaxed">
              We've sent a 6-digit medical access code to your{" "}
              <span className="text-red-600 font-medium italic">
                registered email
              </span>
              .
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-8">
            <div className="space-y-4">
              <Label className="text-[13px] uppercase tracking-wider font-bold text-slate-500 block text-center md:text-left ml-1">
                Enter 6-Digit Code
              </Label>

              {/* OTP BOXES: Larger and modern */}
              <div className="flex justify-center md:justify-start gap-2.5 md:gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-11 h-14 md:w-14 md:h-16 text-center text-2xl font-black border-2 border-slate-200 focus:border-red-500 focus:ring-red-100 bg-slate-50 rounded-xl transition-all shadow-sm`}
                    placeholder="-"
                  />
                ))}
              </div>

              <p className="text-sm text-center md:text-left text-slate-500 pt-2">
                Didn't receive the code?{" "}
                <button
                  className={`${colors.textPrimary} font-bold hover:underline`}
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </CardContent>

          <CardFooter className="p-0 mt-12 flex flex-col space-y-6">
            <Button
              className={`w-full ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight} text-white cursor-pointer text-md font-medium shadow-lg transition-all active:scale-[0.98] rounded-md`}
            >
              Verify and Access
            </Button>

            <a
              href="/login"
              className="flex items-center justify-center md:justify-start gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Secure Login
            </a>
          </CardFooter>
        </div>

        {/* RIGHT SIDE: Visual Panel (Consistent with other forms) */}
        <div className="hidden md:flex relative bg-blue-950 overflow-hidden items-center justify-center p-12">
          {/* Pulse Glow */}
          <div className="absolute w-125 h-125 bg-red-600/10 rounded-full blur-[120px] animate-pulse" />

          <div className="relative w-full h-full max-w-112.5 aspect-square">
            <Image
              src="/Cardiologist.png"
              alt="Secure Verification"
              fill
              priority
              className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
