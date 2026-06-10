"use client";

import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import { authApi } from "@/lib/auth";
import { APP_CONFIG } from "../../constant.js";
import FullScreenLoader from "../Loader";

const OTP_LENGTH = 6;

const VerifyOtpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { colors, sizing } = APP_CONFIG;
  const loginRole = searchParams.get("role") === "doctor" ? "doctor" : "user";

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const email = searchParams.get("email") ?? "";
  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpValue = otp.join("");

  const handleChange = (value: string, index: number) => {
    if (value && !/^\d+$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedValue) return;

    event.preventDefault();

    const nextOtp = Array.from(
      { length: OTP_LENGTH },
      (_, index) => pastedValue[index] ?? "",
    );
    setOtp(nextOtp);

    const nextIndex = Math.min(pastedValue.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      toast.error(
        "We need the email from the login step before verifying the code.",
        {
          position: "top-right",
          autoClose: 2500,
        },
      );
      return;
    }

    if (otpValue.length !== OTP_LENGTH) {
      toast.error("Enter the full 6-digit code.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.verifyOtp({
        email,
        otp: otpValue,
      });

      window.localStorage.setItem("authToken", response.token);
      window.localStorage.setItem("authUser", JSON.stringify(response.user));
      window.localStorage.removeItem("pendingOtpEmail");
      window.localStorage.removeItem("pendingAuthRole");
      window.dispatchEvent(new Event("storage"));

      toast.success(response.message || "Login successful.", {
        position: "top-right",
        autoClose: 2800,
        closeOnClick: true,
        pauseOnHover: false,
      });

      setTimeout(() => {
        router.push(
          response.user?.role === "doctor" || loginRole === "doctor"
            ? "/doctor/dashboard"
            : "/",
        );
      }, 2800);
    } catch (submissionError) {
      toast.error(
        submissionError instanceof Error
          ? submissionError.message
          : "OTP verification failed. Please try again.",
        {
          position: "top-right",
          autoClose: 2500,
          closeOnClick: true,
          pauseOnHover: false,
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <FullScreenLoader />}

      {/* Main Base Wrapper - Fluid padding handling on mobile viewports */}
      <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-50/50 p-4 sm:p-6 md:p-8">
        <ToastContainer
          position="top-right"
          theme="colored"
          newestOnTop
          closeOnClick
          pauseOnHover={false}
        />

        {/* Outer Split Card Container - Fixed desktop max configurations matched */}
        <div className="grid min-h-0 md:min-h-170 w-full max-w-285 grid-cols-1 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:grid-cols-2">
          {/* Left Block: Interactive Form Side with clean mobile spacing alignment */}
          <div className="flex w-full flex-col justify-center px-5 py-10 sm:px-10 md:px-14 lg:px-16">
            <form
              className="w-full max-w-105 mx-auto space-y-5 sm:space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Card Header Section inside Form */}
              <CardHeader className="space-y-2 text-center md:text-left p-0 mb-4 md:mb-6">
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Verify Identity
                </CardTitle>

                <CardDescription className="text-xs sm:text-sm leading-relaxed text-slate-500 max-w-[340px] mx-auto md:mx-0">
                  We&apos;ve sent a 6-digit access code to{" "}
                  <span className="font-medium text-red-600">
                    {email || "your registered email"}
                  </span>
                  .
                </CardDescription>
              </CardHeader>

              {/* Card Content Data Entry Input Fields Area */}
              <CardContent className="p-0">
                <div className="space-y-3.5">
                  <Label className="block text-center text-xs font-medium tracking-wide text-slate-700 md:text-left">
                    Enter 6-Digit Code
                  </Label>

                  {/* OTP Grid Structure - Tailored beautifully for fluid widths on ultra thin screens */}
                  <div
                    className="flex justify-center gap-1.5 sm:gap-2.5 md:justify-start md:gap-3"
                    onPaste={handlePaste}
                  >
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        disabled={isSubmitting}
                        onChange={(event) =>
                          handleChange(event.target.value, index)
                        }
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        className="h-12 w-9 rounded-lg border border-slate-200 bg-slate-50/30 text-center text-xl font-bold text-slate-900 transition-colors focus:border-slate-400 focus:bg-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 sm:h-14 sm:w-11 md:h-16 md:w-14"
                        placeholder="-"
                      />
                    ))}
                  </div>

                  <p className="pt-2 text-center text-xs text-slate-500 md:text-left">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      className={`${colors.textPrimary} font-medium underline-offset-4 hover:underline`}
                      disabled={isSubmitting}
                      onClick={() =>
                        router.push(
                          email
                            ? `/login?email=${encodeURIComponent(email)}${loginRole === "doctor" ? "&role=doctor" : ""}`
                            : loginRole === "doctor"
                              ? "/login?role=doctor"
                              : "/login",
                        )
                      }
                    >
                      Request a new code
                    </button>
                  </p>
                </div>
              </CardContent>

              {/* Card Footer Section - Clean action buttons layout */}
              <CardFooter className="pt-2 flex flex-col space-y-4 p-0 text-center md:text-left">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full cursor-pointer rounded-md text-sm font-medium text-white transition-all duration-200 hover:opacity-95 active:scale-[0.99] ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight}`}
                >
                  {isSubmitting ? "Verifying..." : "Verify and Access"}
                </Button>

                <Link
                  href={
                    loginRole === "doctor" ? "/login?role=doctor" : "/login"
                  }
                  className="group flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-800 md:justify-start"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  Back to{" "}
                  {loginRole === "doctor" ? "Doctor Login" : "Secure Login"}
                </Link>
              </CardFooter>
            </form>
          </div>

          {/* Right Block: Minimal Corporate Banner matched to standard split design */}
          <div className="hidden h-full items-center justify-center bg-red-400 p-8 md:flex">
            <div className="relative flex h-full w-full max-w-[320px] items-center justify-center">
              <Image
                src="/Cardiologist.png"
                alt="Cardiologist Illustration"
                width={320}
                height={320}
                className="object-contain opacity-90 brightness-95 filter drop-shadow-sm"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtpForm;
