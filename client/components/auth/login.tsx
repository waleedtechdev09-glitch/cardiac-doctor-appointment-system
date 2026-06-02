"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HeartPulse, LoaderCircle, LockKeyhole } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

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
import AuthBackButton from "@/components/AuthBackButton";
import { authApi } from "@/lib/auth";
import { APP_CONFIG } from "../../constant.js";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { colors, sizing, name } = APP_CONFIG;

  const [form, setForm] = useState({
    email: searchParams.get("email") ?? "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
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
      const response = await authApi.login({
        email,
        password,
      });

      window.localStorage.setItem("pendingOtpEmail", email);
      toast.update(loadingToastId, {
        render: response.message || "OTP sent successfully. Please verify to continue.",
        type: "success",
        isLoading: false,
        autoClose: 1800,
        closeOnClick: true,
        pauseOnHover: false,
      });

      window.setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 1800);
    } catch (submissionError) {
      toast.update(loadingToastId, {
        render:
          submissionError instanceof Error
            ? submissionError.message
            : "Login failed",
        type: "error",
        isLoading: false,
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
      });
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Login failed",
      );
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
          <CardHeader className="mb-10 space-y-3 p-0">
            <div
              className={`mx-auto mb-2 w-fit rounded-full p-4 shadow-sm transition-all duration-300 md:mx-0 ${colors.iconBg}`}
            >
              <HeartPulse className={`${sizing.iconSize} ${colors.textPrimary}`} />
            </div>

            <CardTitle className="text-center text-3xl font-black tracking-tight text-slate-900 md:text-left md:text-4xl">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-base leading-relaxed text-slate-500 md:text-left">
              Log in to your <span className="font-medium text-red-600">{name}</span> professional portal.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-0">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="ml-1 text-[13px] font-bold uppercase tracking-wider text-slate-500"
              >
                Medical Email
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
              <div className="ml-1 flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-[13px] font-bold uppercase tracking-wider text-slate-500"
                >
                  Password
                </Label>
                <Link href="#" className={`text-xs ${colors.textPrimary} font-semibold hover:underline`}>
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                className={`w-full ${sizing.inputHeight} rounded-xl border-slate-200 bg-slate-50/50 transition-all focus:border-red-500 focus:ring-red-100`}
                placeholder="Enter password"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </CardContent>

          <CardFooter className="mt-12 flex flex-col space-y-6 p-0">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full gap-3 rounded-md text-base font-medium text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)] transition-all active:scale-[0.98] ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight}`}
            >
              {isSubmitting ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                <LockKeyhole className="h-5 w-5" />
              )}
              {isSubmitting ? "Sending code..." : "Secure Login"}
            </Button>

            <p className="text-center text-sm text-slate-500 md:text-left">
              Don&apos;t have an account?{" "}
              <Link href="/register" className={`${colors.textPrimary} font-bold transition-all hover:underline`}>
                Register for {name}
              </Link>
            </p>
          </CardFooter>
        </form>

        <div className="relative hidden items-center justify-center overflow-hidden bg-blue-950 p-12 md:flex">
          <div className="relative aspect-square h-[450px] w-[450px]">
            <Image
              src="/Cardiologist.png"
              alt="Secure Cardiovascular Access"
              fill
              priority
              className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
