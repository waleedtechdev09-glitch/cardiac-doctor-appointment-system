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
      {/* Full screen loader shows during submission */}
      {isSubmitting && <FullScreenLoader />}

      <div className="flex min-h-screen w-full items-center justify-center bg-[#f8fafc] p-0 md:p-6 lg:p-8">
        <ToastContainer
          position="top-right"
          theme="colored"
          newestOnTop
          closeOnClick
          pauseOnHover={false}
        />

        <div className="grid min-h-[720px] w-full max-w-[1200px] grid-cols-1 overflow-hidden border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:grid-cols-2 md:rounded-3xl">
          <form
            className="flex w-full flex-col justify-center p-10 md:p-14 lg:p-20"
            onSubmit={handleSubmit}
          >
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
                We&apos;ve sent a 6-digit access code to{" "}
                <span className="font-medium text-red-600">
                  {email || "your registered email"}
                </span>
                .
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 p-0">
              <div className="space-y-4">
                <Label className="ml-1 block text-center text-[13px] font-bold uppercase tracking-wider text-slate-500 md:text-left">
                  Enter 6-Digit Code
                </Label>

                <div
                  className="flex justify-center gap-2.5 md:justify-start md:gap-3"
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
                      className="h-14 w-11 rounded-xl border-2 border-slate-200 bg-slate-50 text-center text-2xl font-black shadow-sm transition-all focus:border-red-500 focus:ring-red-100 disabled:opacity-50 md:h-16 md:w-14"
                      placeholder="-"
                    />
                  ))}
                </div>

                <p className="pt-2 text-center text-sm text-slate-500 md:text-left">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    className={`${colors.textPrimary} font-bold hover:underline`}
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

            <CardFooter className="mt-12 flex flex-col space-y-6 p-0">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full cursor-pointer rounded-md text-base font-medium text-white shadow-lg transition-all active:scale-[0.98] ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight}`}
              >
                {isSubmitting ? "Verifying..." : "Verify and Access"}
              </Button>

              <Link
                href={loginRole === "doctor" ? "/login?role=doctor" : "/login"}
                className="group flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 md:justify-start"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to{" "}
                {loginRole === "doctor" ? "Doctor Login" : "Secure Login"}
              </Link>
            </CardFooter>
          </form>

          <div className="relative hidden items-center justify-center overflow-hidden bg-blue-950 p-12 md:flex">
            <div className="absolute h-[500px] w-[500px] animate-pulse rounded-full bg-red-600/10 blur-[120px]" />

            <div className="relative aspect-square h-[450px] w-[450px]">
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
    </>
  );
};

export default VerifyOtpForm;
