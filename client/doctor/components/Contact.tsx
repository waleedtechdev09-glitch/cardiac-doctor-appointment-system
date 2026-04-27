"use client";
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { APP_CONFIG } from "../../constant.js";

const ContactPage = () => {
  const { name, colors } = APP_CONFIG;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us Anytime",
      detail: "+92 300 1234567",
      subDetail: "Available Mon-Sat, 9am - 9pm",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Support",
      detail: "support@cardiocare.com",
      subDetail: "Response within 24 hours",
      color: "bg-red-500/10 text-red-600",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Visit Clinic",
      detail: "Wah Institute of Cardiology",
      subDetail: "Wah Cantt, Punjab, Pakistan",
      color: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20">
      <div className="container mx-auto px-6">
        {/* HEADER SECTION */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-[2px] bg-red-600"></div>
            <span className="text-red-600 font-bold uppercase tracking-[0.2em] text-xs">
              Get In Touch
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
            We’re here to help you <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">
              stay heart-healthy.
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {contactInfo.map((info, i) => (
                <div
                  key={i}
                  className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex items-start gap-5"
                >
                  <div
                    className={`p-4 rounded-2xl ${info.color} group-hover:scale-110 transition-transform`}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      {info.title}
                    </h4>
                    <p className="text-lg font-bold text-slate-900 mb-1">
                      {info.detail}
                    </p>
                    <p className="text-sm text-slate-500">{info.subDetail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Map Placeholder */}
            <div className="relative h-64 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner group">
              <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                <Globe className="w-12 h-12 text-slate-400" />
                <span className="absolute bottom-4 text-[10px] font-black uppercase text-slate-500">
                  Interactive Map Loading...
                </span>
              </div>
              {/* Actual Iframe would go here */}
              <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors" />
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
              {/* Background Decor */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Send a Message
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Dr. Waleed's team will get back to you shortly.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Your Name
                      </label>
                      <Input
                        placeholder="John Doe"
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Subject
                    </label>
                    <select className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20">
                      <option>General Inquiry</option>
                      <option>Appointment Issue</option>
                      <option>Feedback</option>
                      <option>Medical Records Request</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Message
                    </label>
                    <Textarea
                      placeholder="How can we assist you today?"
                      className="min-h-[150px] rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all resize-none p-4"
                    />
                  </div>

                  <Button
                    disabled={isSubmitting}
                    className={`w-full h-16 rounded-2xl text-sm font-black uppercase tracking-[0.2em] ${colors.primary} ${colors.primaryHover} text-white shadow-xl shadow-red-600/20 group flex items-center justify-center gap-3 transition-all active:scale-95`}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
