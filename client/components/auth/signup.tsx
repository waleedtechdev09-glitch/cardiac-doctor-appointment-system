import React from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Removing the main Card wrapper import as we build a custom layout
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse } from "lucide-react";
import AuthBackButton from "@/components/AuthBackButton";

// Import your constants (verify this path is correct for your project)
import { APP_CONFIG } from "../../constant.js";
import Image from "next/image.js";

const SignupForm = () => {
  const { colors, sizing, name } = APP_CONFIG;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 p-0 md:p-6 lg:p-8">
      <AuthBackButton />
      {/* MAIN CONTAINER: We switch from a Shadcn <Card> to a custom div to manage the grid/flex layout easily.
        - Default (mobile): Flex column (stacked).
        - md+: Grid with 2 columns.
      */}
      <div className="w-full max-w-300 grid grid-cols-1 md:grid-cols-2 bg-white md:shadow-2xl md:border md:border-slate-100 overflow-hidden md:rounded-3xl min-h-150">
        {/* ==============================================
             LEFT SIDE: The Form
           ============================================== */}
        <div className="w-full flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <CardHeader className="p-0 space-y-2 mb-8">
            {/* Animated Icon Container */}
            <div
              className={`w-fit mx-auto md:mx-0 ${colors.iconBg} p-4 rounded-full mb-3 group cursor-pointer transition-all duration-300`}
            >
              <HeartPulse
                className={`${sizing.iconSize} ${colors.textPrimary} transition-all duration-500 group-hover:fill-current group-hover:scale-110`}
              />
            </div>

            {/* Align text to center on mobile, left on md+ */}
            <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-950 text-center md:text-left">
              Create {name} Account
            </CardTitle>
            <CardDescription className="text-slate-600 text-center md:text-left text-base">
              Join our professional medical network for advanced cardiovascular
              care and patient monitoring.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-5">
            <div className="space-y-2.5">
              <Label
                htmlFor="username"
                className="text-sm font-semibold text-slate-800"
              >
                Username
              </Label>
              <Input
                id="username"
                className={`w-full ${sizing.inputHeight} ${colors.ring} text-base border-slate-200 focus:border-red-600`}
                placeholder="Dr. John Smith or Clinic Name"
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
                className={`w-full ${sizing.inputHeight} ${colors.ring} text-base border-slate-200 focus:border-red-600`}
                placeholder="doctor.smith@cardio-care.com"
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
                className={`w-full ${sizing.inputHeight} ${colors.ring} text-base border-slate-200 focus:border-red-600`}
                placeholder="••••••••••"
              />
            </div>
          </CardContent>

          <CardFooter className="p-0 mt-10 flex flex-col space-y-5">
            <Button
              className={`w-full ${colors.primary} ${colors.primaryHover} ${sizing.inputHeight} text-white cursor-pointer text-md font-medium shadow-lg transition-all active:scale-[0.98] rounded-md`}
            >
              Register for {name}
            </Button>

            <p className="text-sm text-center md:text-left text-slate-600">
              Already have a professional account?{" "}
              <a
                href="/login"
                className={`${colors.textPrimary} hover:underline font-semibold`}
              >
                Sign in here
              </a>
            </p>
          </CardFooter>
        </div>

        {/* ==============================================
             RIGHT SIDE: The Image
            
           ============================================== */}
        <div className="hidden md:flex relative bg-blue-950 overflow-hidden items-center justify-center">
          {/* 1. 'hidden md:flex' - Mobile pe hide, desktop pe flexbox (centering ke liye).
      2. 'items-center justify-center' - Image ko center mein rakhne ke liye.
  */}

          <div className="relative w-75 h-75 lg:w-100 lg:h-100">
            <Image
              src="/Cardiologist.png"
              alt="Cardiologist"
              fill
              priority
              className="object-contain opacity-90 transition-all duration-500 hover:scale-105"
              /* 'object-contain' - Is se image apne box ke andar fit rehti hai, crop nahi hoti.
               */
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
