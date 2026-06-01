"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { APP_CONFIG } from "../../constant.js";
import Image from "next/image.js";
import Link from "next/link.js";

const Services = () => {
  const { colors, name } = APP_CONFIG;

  const services = [
    {
      title: "Cardiovascular Consultation",
      desc: "Specialized heart care and consultation for chronic and acute cardiac conditions.",
      image:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
      category: "Specialist",
    },
    {
      title: "Real-time Monitoring",
      desc: "Advanced risk score calculation and vitals monitoring for every patient.",
      image:
        "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
      category: "Technology",
    },
    {
      title: "Emergency Prioritization",
      desc: "Immediate attention for high-risk patients based on our automated risk scoring.",
      image: "/emergencysituation.png",
      category: "Urgent",
    },
    {
      title: "Digital Prescriptions",
      desc: "Get your medical prescriptions delivered directly to your email in professional PDF format.",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      category: "Digital",
    },
    {
      title: "Diagnostic Reports",
      desc: "Comprehensive analysis of BP, symptoms, and heart health metrics.",
      image: "/repost.png",
      category: "Analysis",
    },
    {
      title: "Patient Care Portal",
      desc: "A secure and professional dashboard to manage your appointments and medical history.",
      image:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800",
      category: "Portal",
    },
  ];

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        {/* Header Section - Centered */}
        <div className="max-w-2xl mb-16 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl md:mt-6 font-bold text-slate-900 mb-2 tracking-tight">
            Our Cardiac <span className="text-red-600">Services</span>
          </h2>
          <div className="w-26 h-1 bg-red-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-slate-500 leading-relaxed">
            {name} offers a comprehensive range of heart care services, powered
            by advanced analytics and professional expertise.
          </p>
          {/* Optional: Choti si decorative line center mein */}
        </div>
        {/* Responsive Grid: 1 column on small, 3 on large */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-md overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={0}
                  height={0}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {service.desc}
                </p>

                {/* Smooth Button */}
                {/* <button className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest group/btn">
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button> */}
              </div>
            </div>
          ))}
        </div>

        {/* Updated CTA Card with rounded-md */}
        <div className="relative mt-20 overflow-hidden rounded-md bg-gradient-to-r from-red-600 via-red-500 to-rose-500 px-8 py-14 md:px-16 md:py-20">
          {/* Background Effects */}
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          {/* ECG Line Decoration */}
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 1200 200" className="h-full w-full" fill="none">
              <path
                d="M0 100 H250 L300 40 L350 160 L400 70 L450 100 H1200"
                stroke="white"
                strokeWidth="4"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <span className="mb-4 inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur">
                ❤️ Trusted Cardiac Care
              </span>

              <h3 className="max-w-xl text-3xl font-bold text-white md:text-5xl">
                Start Your Cardiac Health Journey Today
              </h3>

              <p className="mt-4 max-w-lg text-white/80">
                Get expert consultation, advanced diagnostics, and personalized
                treatment plans from experienced cardiologists.
              </p>
            </div>

            <button
              className="
        group relative overflow-hidden rounded-md
        bg-white px-8 py-4 font-bold text-red-600
        transition-all duration-300 cursor-pointer
        hover:scale-105 hover:shadow-2xl
      "
            >
              <Link href="/booking">
                <span className="relative z-10 ">Book Appointment →</span>
              </Link>
              <div
                className="
          absolute inset-0 -translate-x-full
          bg-gradient-to-r from-transparent via-white/60 to-transparent
          transition-transform duration-700
          group-hover:translate-x-full
        "
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
