"use client";
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "../constant.js";

const ContactPage = () => {
  const { name } = APP_CONFIG;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Simple Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            Get In <span className="font-bold text-red-600">Touch</span>
          </h1>
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
            Have a question or need assistance? Our team at{" "}
            <span className="font-semibold text-red-600">{name}</span> is here
            to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Side: Contact Details */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 bg-slate-50 rounded border border-slate-100 flex items-center gap-4">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-100">
                <Phone className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                  Call Us
                </p>
                <p className="font-bold text-slate-900 text-[12px]">
                  +92 311 7248123
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded border border-slate-100 flex items-center gap-4">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-100">
                <Mail className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                  Email Us
                </p>
                <p className="font-bold text-slate-900 text-[12px]">
                  support@cardiocare.com
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded border border-slate-100 flex items-center gap-4">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-100">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                  Location
                </p>
                <p className="font-bold text-slate-900 text-sm leading-tight text-[12px]">
                  Wah Cantt, Punjab, Pakistan
                </p>
              </div>
            </div>

            <div className="pt-4 px-2">
              <p className="text-[12px] text-slate-500  flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                Response time: Within 2-4 business hours.
              </p>
            </div>
          </div>

          {/* Right Side: Simple Form (Wahi Style jo apko pasand ha) */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSendMessage}
              className="bg-slate-50 p-8 md:p-10 rounded border border-slate-100 shadow-sm space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                    Your Full Name
                  </label>
                  <Input
                    required
                    placeholder="Enter your name"
                    className="bg-white border-slate-200 h-12 rounded focus-visible:ring-2 focus-visible:ring-red-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="example@mail.com"
                    className="bg-white border-slate-200 h-12 rounded focus-visible:ring-red-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                  Subject
                </label>
                <select className="w-full bg-white border border-slate-200 h-12 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 transition-all">
                  <option>General Inquiry</option>
                  <option>Feedback</option>
                  <option>Support Request</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                  Message
                </label>
                <Textarea
                  required
                  placeholder="How can we help you?"
                  className="bg-white border-slate-200 min-h-[150px] rounded resize-none focus-visible:ring-red-200 p-4"
                />
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  disabled={isSubmitting}
                  className="bg-red-600 w-full hover:bg-red-700 text-white font-bold uppercase tracking-widest px-10 py-7 rounded-md cursor-pointer text-[12px] shadow-lg shadow-red-100 transition-all active:scale-95 flex items-center gap-3"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Minimal Footer Info */}
        <div className="mt-20 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-semibold">
            {name} • Wah Cantt • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
