"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthBackButton from "@/components/AuthBackButton";
import { authApi } from "@/lib/auth";
import { APP_CONFIG } from "../../constant.js";
import Image from "next/image.js";
import FullScreenLoader from "../Loader";

const PatientLoginForm = () => {
  const router = useRouter();
  const { colors, sizing, name } = APP_CONFIG;

  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      toast.error("Please fill in all fields.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.login({ email, password });

      window.localStorage.setItem("pendingOtpEmail", email);
      window.localStorage.setItem("pendingAuthRole", "user");

      toast.success(
        response.message || "OTP sent successfully. Please verify to continue.",
        {
          position: "top-right",
          autoClose: 1800,
          closeOnClick: true,
          pauseOnHover: false,
        },
      );

      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}&role=user`);
      }, 1800);
    } catch (submissionError) {
      toast.error(
        submissionError instanceof Error
          ? submissionError.message
          : "Login failed. Please try again.",
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
        <AuthBackButton />

        <ToastContainer
          position="top-right"
          theme="colored"
          newestOnTop
          closeOnClick
          pauseOnHover={false}
        />

        {/* Outer Split Card Container - Responsive mobile min-height protection applied */}
        <div className="grid min-h-0 md:min-h-170 w-full max-w-285 grid-cols-1 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:grid-cols-2">
          {/* Left Block: Interactive Form Side with optimized padding on mobile */}
          <div className="flex w-full flex-col justify-center overflow-y-auto px-5 py-10 sm:px-10 md:px-14 lg:px-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <form
              className="w-full max-w-105 mx-auto space-y-5 sm:space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Header Info - Center text on mobile screens for better aesthetics */}
              <div className="space-y-2 text-center md:text-left mb-6 md:mb-10">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Welcome Back
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-500 max-w-[320px] mx-auto md:mx-0">
                  Log in to your{" "}
                  <span className="font-medium text-red-600">{name}</span>{" "}
                  professional portal.
                </p>
              </div>

              {/* Data Input Fields Area */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-medium tracking-wide text-slate-700"
                  >
                    Medical Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className={`w-full ${sizing.inputHeight} rounded-md border-slate-200 bg-slate-50/30 text-sm transition-colors focus:border-slate-400 focus:bg-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0`}
                    placeholder="doctor.smith@cardio-care.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-xs font-medium tracking-wide text-slate-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange("password")}
                      className={`w-full ${sizing.inputHeight} rounded-md border-slate-200 bg-slate-50/30 pr-10 text-sm transition-colors focus:border-slate-400 focus:bg-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0`}
                      placeholder="Enter password"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* CTAs and Routing Links */}
              <div className="pt-1 space-y-4 text-center md:text-left">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full cursor-pointer rounded-md text-sm font-medium text-white transition-all duration-200 hover:opacity-95 active:scale-[0.99] ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight}`}
                >
                  {isSubmitting ? "Sending code..." : "Secure Login"}
                </Button>

                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className={`${colors.textPrimary} font-medium `}
                  >
                    Register for {name}
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Right Block: Fixed Banner Side matched to Signup layout */}
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

export default PatientLoginForm;
