import React from "react";
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
import { HeartPulse, LockKeyhole } from "lucide-react";
import Image from "next/image";
import AuthBackButton from "@/components/AuthBackButton";

// Import your constants
import { APP_CONFIG } from "../../constant.js";

const LoginForm = () => {
  const { colors, sizing, name } = APP_CONFIG;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-0 md:p-6 lg:p-8">
      <AuthBackButton />
      {/* MAIN CONTAINER: Split Grid Layout */}
      <div className="w-full max-w-300 grid grid-cols-1 md:grid-cols-2 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden md:rounded-3xl min-h-175 border border-slate-100">
        {/* LEFT SIDE: Login Form */}
        <div className="w-full flex flex-col justify-center p-10 md:p-14 lg:p-20">
          <CardHeader className="p-0 space-y-3 mb-10">
            {/* Animated Icon */}
            <div
              className={`w-fit mx-auto md:mx-0 ${colors.iconBg} p-4 rounded-full mb-2 group cursor-pointer transition-all duration-300 shadow-sm`}
            >
              <HeartPulse
                className={`${sizing.iconSize} ${colors.textPrimary} transition-all duration-500 group-hover:fill-current group-hover:scale-110`}
              />
            </div>

            <CardTitle className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 text-center md:text-left">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-500 text-center md:text-left text-base leading-relaxed">
              Log in to your{" "}
              <span className="text-red-600 font-medium">{name}</span>{" "}
              professional portal.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[13px] uppercase tracking-wider font-bold text-slate-500 ml-1"
              >
                Medical Email
              </Label>
              <Input
                id="email"
                type="email"
                className={`w-full ${sizing.inputHeight} border-slate-200 focus:border-red-500 focus:ring-red-100 bg-slate-50/50 rounded-xl transition-all`}
                placeholder="doctor.smith@cardio-care.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label
                  htmlFor="password"
                  className="text-[13px] uppercase tracking-wider font-bold text-slate-500"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className={`text-xs ${colors.textPrimary} hover:underline font-semibold`}
                >
                  Forgot Password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                className={`w-full ${sizing.inputHeight} border-slate-200 focus:border-red-500 focus:ring-red-100 bg-slate-50/50 rounded-xl transition-all`}
                placeholder="••••••••••"
              />
            </div>
          </CardContent>

          <CardFooter className="p-0 mt-12 flex flex-col space-y-6">
            <Button
              className={`w-full ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight} text-white cursor-pointer text-md font-medium shadow-[0_10px_20px_rgba(220,38,38,0.2)] transition-all active:scale-[0.98] rounded-md flex gap-3`}
            >
              <LockKeyhole className="w-5 h-5" />
              Secure Login
            </Button>

            <p className="text-sm text-center md:text-left text-slate-500">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className={`${colors.textPrimary} hover:underline font-bold transition-all`}
              >
                Register for {name}
              </a>
            </p>
          </CardFooter>
        </div>

        {/* RIGHT SIDE: Visual Panel (Matches Signup) */}
        <div className="hidden md:flex relative bg-blue-950 overflow-hidden items-center justify-center p-12">
          {/* Medical Glow Effect */}
          <div className="absolute w-125 h-125 bg-red-600/10 rounded-full blur-[120px] animate-pulse" />

          <div className="relative w-full h-full max-w-112.5 aspect-square">
            {/* Using the same Cardiologist image for consistency */}
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
