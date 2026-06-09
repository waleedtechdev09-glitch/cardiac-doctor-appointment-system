"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HeartPulse } from "lucide-react";
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
import AuthBackButton from "@/components/AuthBackButton";
import Link from "next/link";
import { authApi } from "@/lib/auth";
import { APP_CONFIG } from "../../constant.js";
import FullScreenLoader from "../Loader";

const DoctorSignupForm = () => {
  const router = useRouter();
  const { colors, sizing, name } = APP_CONFIG;

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
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

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.registerDoctor({
        username,
        email,
        password,
      });

      toast.success(
        response.message || "Doctor account created successfully.",
        {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: false,
        },
      );

      setTimeout(() => {
        router.push("/doctor/login");
      }, 2000);
    } catch (submissionError) {
      toast.error(
        submissionError instanceof Error
          ? submissionError.message
          : "Registration failed. Please try again.",
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

      <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-50 p-0 md:p-6 lg:p-8">
        <AuthBackButton />

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
            <CardHeader className="mb-8 space-y-2 p-0">
              <div
                className={`mx-auto mb-3 w-fit cursor-pointer rounded-full p-4 transition-all duration-300 md:mx-0 ${colors.iconBg}`}
              >
                <HeartPulse
                  className={`${sizing.iconSize} ${colors.textPrimary} transition-all duration-500`}
                />
              </div>

              <CardTitle className="text-center text-3xl font-extrabold tracking-tight text-slate-950 md:text-left">
                Doctor Registration
              </CardTitle>
              <CardDescription className="text-center text-base text-slate-600 md:text-left">
                Create a separate doctor account to manage appointments and
                prescriptions.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-0">
              <div className="space-y-2.5">
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold text-slate-800"
                >
                  Full Name / Clinic Name
                </Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={handleChange("username")}
                  disabled={isSubmitting}
                  className={`w-full ${sizing.inputHeight} border-slate-200 text-base focus:border-red-600`}
                  placeholder="Dr. John Smith or Clinic Name"
                />
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-800"
                >
                  Professional Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  disabled={isSubmitting}
                  className={`w-full ${sizing.inputHeight} border-slate-200 text-base focus:border-red-600`}
                  placeholder="doctor.smith@clinic.com"
                />
              </div>

              <div className="space-y-2.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-800"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange("password")}
                  disabled={isSubmitting}
                  className={`w-full ${sizing.inputHeight} border-slate-200 text-base focus:border-red-600`}
                  placeholder="Create a strong password"
                />
              </div>
            </CardContent>

            <CardFooter className="mt-10 flex flex-col space-y-5 p-0">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full cursor-pointer rounded-md text-base font-medium text-white shadow-lg transition-all active:scale-[0.98] ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight}`}
              >
                {isSubmitting ? "Creating account..." : "Register as Doctor"}
              </Button>

              <p className="text-center text-sm text-slate-600 md:text-left">
                Already have a doctor account?{" "}
                <Link
                  href="/doctor/login"
                  className={`${colors.textPrimary} font-semibold hover:underline`}
                >
                  Sign in here
                </Link>
              </p>
            </CardFooter>
          </form>

          <div className="hidden items-center justify-center overflow-hidden bg-blue-950 md:flex">
            <div className="relative h-[300px] w-[300px] lg:h-[400px] lg:w-[400px]">
              <Image
                src="/Cardiologist.png"
                alt="Doctor Registration"
                fill
                priority
                className="object-contain opacity-90 transition-all duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorSignupForm;
