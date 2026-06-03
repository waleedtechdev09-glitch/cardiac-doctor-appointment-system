"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthBackButton from "@/components/AuthBackButton";
import { authApi } from "@/lib/auth";
import { APP_CONFIG } from "../../constant.js";
import Image from "next/image.js";

const DoctorLoginForm = () => {
  const router = useRouter();
  const { colors, sizing } = APP_CONFIG;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("authToken");
    const storedUser = window.localStorage.getItem("authUser");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === "doctor") {
          router.replace("/doctor/dashboard");
        }
      } catch {}
    }
  }, [router]);

  const handleChange = (field: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Verifying credentials...");

    try {
      const response = await authApi.loginDoctor({ email, password });

      window.localStorage.setItem("pendingOtpEmail", email);
      window.localStorage.setItem("pendingAuthRole", "doctor");
      toast.update(loadingToastId, {
        render: response.message || "OTP sent successfully. Please verify to continue.",
        type: "success",
        isLoading: false,
        autoClose: 1800,
        closeOnClick: true,
        pauseOnHover: false,
      });

      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}&role=doctor`);
      }, 1800);
    } catch (submissionError) {
      toast.update(loadingToastId, {
        render: submissionError instanceof Error ? submissionError.message : "Login failed",
        type: "error",
        isLoading: false,
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
      });
      setError(submissionError instanceof Error ? submissionError.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#f8fafc] p-0 md:p-6 lg:p-8">
      <AuthBackButton />
      <ToastContainer position="top-right" theme="colored" />

      <div className="grid min-h-[720px] w-full max-w-[1200px] grid-cols-1 overflow-hidden border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:grid-cols-2 md:rounded-3xl">
        <form className="flex w-full flex-col justify-center p-10 md:p-14 lg:p-20" onSubmit={handleSubmit}>
          <div className="mb-10 space-y-3 p-0">
            <div className={`mx-auto mb-2 w-fit rounded-full p-4 shadow-sm transition-all duration-300 md:mx-0 ${colors.iconBg}`}>
              <span className={`${sizing.iconSize} ${colors.textPrimary}`}></span>
            </div>

            <h2 className="text-center text-3xl font-black tracking-tight text-slate-900 md:text-left md:text-4xl">
              Doctor Login
            </h2>
            <p className="text-center text-base leading-relaxed text-slate-500 md:text-left">
              Log in to your doctor dashboard and manage appointment requests.
            </p>
          </div>

          <div className="space-y-6 p-0">
            <div className="space-y-2">
              <Label htmlFor="email" className="ml-1 text-[13px] font-bold uppercase tracking-wider text-slate-500">
                Doctor Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className={`w-full ${sizing.inputHeight} rounded-xl border-slate-200 bg-slate-50/50 transition-all focus:border-red-500 focus:ring-red-100`}
                placeholder="doctor.smith@cardio-care.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="ml-1 text-[13px] font-bold uppercase tracking-wider text-slate-500">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  className={`w-full ${sizing.inputHeight} rounded-xl border-slate-200 bg-slate-50/50 transition-all focus:border-red-500 focus:ring-red-100 pr-12`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>

          <div className="mt-12 flex flex-col space-y-6 p-0">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full gap-3 rounded-md text-base font-medium text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)] transition-all active:scale-[0.98] ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight}`}
            >
              {isSubmitting ? "Sending code..." : "Secure Login"}
            </Button>
          </div>
        </form>

        <div className="relative hidden items-center justify-center overflow-hidden bg-blue-950 p-12 md:flex">
          <div className="relative aspect-square h-[450px] w-[450px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image src="/Cardiologist.png" alt="Doctor Login" width={400} height={400} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLoginForm;
