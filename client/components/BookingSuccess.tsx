"use client";

import React from "react";
import {
  CheckCircle2,
  Mail,
  BellRing,
  ArrowLeft,
  ShieldCheck,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "../constant.js";

const BookingSuccessPage = () => {
  const { name } = APP_CONFIG;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-red-50/30 to-white pt-32 pb-20">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-red-100/40 blur-[140px]" />
      <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-red-50 blur-[120px]" />

      <div className="container relative z-10 mx-auto max-w-3xl px-6">
        {/* Success Card */}
        <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-xl shadow-red-100/40 md:p-12">
          {/* Success Icon */}
          <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-red-50">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <CheckCircle2 className="h-10 w-10 text-red-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-10 text-center">
            <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600">
              Appointment Submitted
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Booking Request
              <span className="block text-red-600">Successfully Sent</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500">
              Thank you for choosing {name}. Our cardiac specialists will review
              your request and contact you shortly regarding your appointment.
            </p>
          </div>

          {/* Timeline */}
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8">
            <h3 className="mb-8 text-left text-lg font-bold text-slate-900">
              What Happens Next?
            </h3>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <CheckCircle2 className="h-6 w-6 text-red-600" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Request Submitted
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Your appointment request has been successfully received and
                    added to our system.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <BellRing className="h-6 w-6 text-red-600" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Doctor Review
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Our specialists will review your information and check
                    appointment availability.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <Mail className="h-6 w-6 text-red-600" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Email Confirmation
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    You&apos;ll receive an email containing your appointment status
                    and complete details.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    Estimated Response Time
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Most appointment requests are reviewed within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 rounded-2xl bg-red-50 p-5">
            <div className="flex items-center justify-center gap-3 text-center">
              <ShieldCheck className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-slate-700">
                Your medical information is securely protected and handled with
                complete confidentiality.
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-10 flex justify-center">
            <Link href="/">
              <Button className="h-12 cursor-pointer rounded-xl bg-red-600 px-10 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 flex items-center justify-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            {name} | Secure Cardiac Care | 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
