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
import { APP_CONFIG } from "../../constant.js";

const VerifyOtpForm = () => {
  const { colors, sizing } = APP_CONFIG;

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (value !== "" && isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);

    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f8fafc] p-0 md:p-6 lg:p-8">
      <div className="grid min-h-[700px] w-full max-w-7xl grid-cols-1 overflow-hidden border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:grid-cols-2 md:rounded-3xl">
        {/* Left Side */}
        <div className="flex w-full flex-col justify-center p-10 md:p-14 lg:p-20">
          <CardHeader className="mb-10 space-y-3 p-0">
            <div
              className={`mx-auto mb-2 w-fit rounded-2xl p-4 shadow-sm transition-all duration-300 md:mx-0 ${colors.iconBg}`}
            >
              <ShieldCheck
                className={`${sizing.iconSize} ${colors.textPrimary}`}
              />
            </div>

            <CardTitle className="text-center text-3xl font-black tracking-tight text-slate-900 md:text-left md:text-4xl">
              Verify Identity
            </CardTitle>

            <CardDescription className="text-center text-base leading-relaxed text-slate-500 md:text-left">
              We've sent a 6-digit medical access code to your{" "}
              <span className="font-medium italic text-red-600">
                registered email
              </span>
              .
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 p-0">
            <div className="space-y-4">
              <Label className="ml-1 block text-center text-[13px] font-bold uppercase tracking-wider text-slate-500 md:text-left">
                Enter 6-Digit Code
              </Label>

              <div className="flex justify-center gap-2.5 md:justify-start md:gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="h-14 w-11 rounded-xl border-2 border-slate-200 bg-slate-50 text-center text-2xl font-black shadow-sm transition-all focus:border-red-500 focus:ring-red-100 md:h-16 md:w-14"
                    placeholder="-"
                  />
                ))}
              </div>

              <p className="pt-2 text-center text-sm text-slate-500 md:text-left">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className={`${colors.textPrimary} font-bold hover:underline`}
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </CardContent>

          <CardFooter className="mt-12 flex flex-col space-y-6 p-0">
            <Button
              className={`w-full cursor-pointer rounded-md text-md font-medium text-white shadow-lg transition-all active:scale-[0.98] ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight}`}
            >
              Verify and Access
            </Button>

            <a
              href="/login"
              className="group flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 md:justify-start"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Secure Login
            </a>
          </CardFooter>
        </div>

        {/* Right Side */}
        <div className="relative hidden items-center justify-center overflow-hidden bg-blue-950 p-12 md:flex">
          <div className="absolute h-[500px] w-[500px] animate-pulse rounded-full bg-red-600/10 blur-[120px]" />

          <div className="relative h-full w-full max-w-[450px] aspect-square">
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
