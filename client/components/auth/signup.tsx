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

const PatientSignupForm = () => {
  const router = useRouter();
  const { colors, sizing, name } = APP_CONFIG;

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!username || !email || !password) {
      toast.error("Please fill in all fields.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.register({ username, email, password });

      toast.success(response.message || "Registration successful!", {
        position: "top-right",
        autoClose: 1800,
      });

      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(email)}`);
      }, 1800);
    } catch (submissionError) {
      toast.error(
        submissionError instanceof Error
          ? submissionError.message
          : "Registration failed. Please try again.",
        {
          position: "top-right",
          autoClose: 2500,
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <FullScreenLoader />}

      {/* Main Base Wrapper - Beautiful fluid padding handling on mobile viewports */}
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
          {/* Left Block: Interactive Form with optimized padding rhythm on mobile */}
          <div className="flex w-full flex-col justify-center px-5 py-10 sm:px-10 md:px-16 lg:px-20">
            <form
              className="w-full max-w-105 mx-auto space-y-5 sm:space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Header Info - Clean center alignment on mobile devices */}
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Create {name} Account
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-500 max-w-[340px] mx-auto md:mx-0">
                  Join our professional medical network for advanced
                  cardiovascular care.
                </p>
              </div>

              {/* Data Input Fields Area */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="username"
                    className="text-xs font-medium tracking-wide text-slate-700"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={form.username}
                    onChange={handleChange("username")}
                    className={`w-full ${sizing.inputHeight} rounded-md border-slate-200 bg-slate-50/30 text-sm transition-colors focus:border-slate-400 focus:bg-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0`}
                    placeholder="Dr. John Smith or Clinic Name"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-medium tracking-wide text-slate-700"
                  >
                    Email Address
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
                      className={`w-full ${sizing.inputHeight} rounded-md border-slate-200 bg-slate-50/30 pr-11 text-sm transition-colors focus:border-slate-400 focus:bg-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0`}
                      placeholder="Enter password"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
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
                  {isSubmitting
                    ? "Creating account..."
                    : `Register for ${name}`}
                </Button>

                <p className="text-sm text-slate-500">
                  Already have a professional account?{" "}
                  <Link
                    href="/login"
                    className={`${colors.textPrimary} font-medium `}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Right Block: Minimal Corporate Banner - Cleanly hidden on low screen breakpoints */}
          <div className="hidden items-center justify-center bg-red-400 p-12 md:flex">
            <div className="relative flex h-full w-full max-w-[360px] items-center justify-center">
              <Image
                src="/Cardiologist.png"
                alt="Cardiologist Illustration"
                width={360}
                height={360}
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

export default PatientSignupForm;
