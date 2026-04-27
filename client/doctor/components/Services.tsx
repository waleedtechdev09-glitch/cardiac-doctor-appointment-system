"use client";
import React from "react";
import {
  Heart,
  Stethoscope,
  Activity,
  Clock,
  ShieldCheck,
  Microscope,
  ArrowRight,
} from "lucide-react";
import { APP_CONFIG } from "../../constant.js";

const Services = () => {
  const { colors, name } = APP_CONFIG;

  const services = [
    {
      title: "Cardiovascular Consultation",
      desc: "Specialized heart care and consultation for chronic and acute cardiac conditions.",
      icon: <Stethoscope className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Real-time Monitoring",
      desc: "Advanced risk score calculation and vitals monitoring for every patient.",
      icon: <Activity className="w-6 h-6" />,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Emergency Prioritization",
      desc: "Immediate attention for high-risk patients based on our automated risk scoring.",
      icon: <Clock className="w-6 h-6" />,
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Digital Prescriptions",
      desc: "Get your medical prescriptions delivered directly to your email in professional PDF format.",
      icon: <ShieldCheck className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Diagnostic Reports",
      desc: "Comprehensive analysis of BP, symptoms, and heart health metrics.",
      icon: <Microscope className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Patient Care Portal",
      desc: "A secure and professional dashboard to manage your appointments and medical history.",
      icon: <Heart className="w-6 h-6" />,
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <section id="services" className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-[2px] bg-red-600"></div>
            <span className="text-red-600 font-bold uppercase tracking-[0.2em] text-xs">
              Our Excellence
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            Specialized Care for Your{" "}
            <span className="text-red-600">Heart Health.</span>
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            {name} provides world-class cardiac services using modern technology
            and data-driven diagnosis to ensure your heart is always in safe
            hands.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Background Glow */}
              <div
                className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${service.color} opacity-[0.03] group-hover:opacity-10 rounded-full blur-2xl transition-all`}
              />

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-500`}
              >
                {service.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors">
                {service.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {service.desc}
              </p>

              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest cursor-pointer group/link">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-20 bg-blue-950 rounded-md p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white mb-4">
              Ready to start your checkup?
            </h3>
            <p className="text-blue-200 text-lg opacity-80">
              Book an appointment in less than 2 minutes.
            </p>
          </div>

          <button
            className={`relative z-10 px-8 py-5 ${colors.primary} ${colors.primaryHover} text-white rounded-md font-black uppercase tracking-widest text-sm shadow-xl shadow-red-600/20 transition-all active:scale-95`}
          >
            Book Appointment Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
