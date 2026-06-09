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
      {/* Full screen loader shows during submission */}
      {isSubmitting && <FullScreenLoader />}

      <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-50 p-0 md:p-6 lg:p-8">
        <AuthBackButton />

        {/* Toast container for all notifications */}
        <ToastContainer
          position="top-right"
          theme="colored"
          newestOnTop
          closeOnClick
          pauseOnHover={false}
        />

        <div className="grid min-h-[720px] w-full max-w-[1200px] grid-cols-1 overflow-hidden bg-white md:grid-cols-2 md:rounded-3xl md:border md:border-slate-100 md:shadow-2xl">
          <form
            className="flex w-full flex-col justify-center p-8 md:p-12 lg:p-16"
            onSubmit={handleSubmit}
          >
            <div className="mb-8 space-y-2 p-0">
              <div
                className={`mx-auto mb-3 w-fit cursor-pointer rounded-full p-4 transition-all duration-300 md:mx-0 ${colors.iconBg}`}
              >
                <span
                  className={`${sizing.iconSize} ${colors.textPrimary}`}
                ></span>
              </div>

              <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-950 md:text-left">
                Create {name} Account
              </h2>
              <p className="text-center text-base text-slate-600 md:text-left">
                Join our professional medical network for advanced
                cardiovascular care and patient monitoring.
              </p>
            </div>

            <div className="space-y-5 p-0">
              <div className="space-y-2.5">
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold text-slate-800"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={handleChange("username")}
                  className={`w-full ${sizing.inputHeight} border-slate-200 text-base focus:border-red-600`}
                  placeholder="Dr. John Smith or Clinic Name"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-800"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className={`w-full ${sizing.inputHeight} border-slate-200 text-base focus:border-red-600`}
                  placeholder="doctor.smith@cardio-care.com"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-800"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange("password")}
                    className={`w-full ${sizing.inputHeight} border-slate-200 text-base focus:border-red-600 pr-12`}
                    placeholder="Enter password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col space-y-5 p-0">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full cursor-pointer rounded-md text-base font-medium text-white shadow-lg transition-all active:scale-[0.98] ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight}`}
              >
                {isSubmitting ? "Creating account..." : `Register for ${name}`}
              </Button>

              <p className="text-center text-sm text-slate-600 md:text-left">
                Already have a professional account?{" "}
                <Link
                  href="/login"
                  className={`${colors.textPrimary} font-semibold hover:underline`}
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>

          <div className="hidden items-center justify-center overflow-hidden bg-blue-950 md:flex">
            <div className="relative h-[300px] w-[300px] lg:h-[400px] lg:w-[400px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/Cardiologist.png"
                  alt="Cardiologist"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientSignupForm;
