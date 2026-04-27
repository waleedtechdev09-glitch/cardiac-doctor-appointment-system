"use client";
import React from "react";
import {
  Award,
  CheckCircle2,
  Zap,
  Target,
  FlaskConical,
  Stethoscope,
  BookOpenText,
  Star,
} from "lucide-react";

// Assuming APP_CONFIG constants might contain some colors/sizing, otherwise remove.
// import { APP_CONFIG } from "../../constant.js";

const Expertise = () => {
  // Enhanced expertises with better icons and descriptions
  const expertises = [
    {
      title: "Interventional Cardiology",
      detail:
        "Expertise in minimally invasive procedures such as angioplasty, stenting, and catheterizations.",
      icon: <Target className="w-6 h-6 text-red-600" />,
      color: "from-red-50 to-red-100", // Soft background for the icon
    },
    {
      title: "Heart Failure Specialist",
      detail:
        "Comprehensive management of complex heart failure cases, using state-of-the-art diagnostics.",
      icon: <Award className="w-6 h-6 text-blue-600" />,
      color: "from-blue-50 to-blue-100",
    },
    {
      title: "Hypertension Control",
      detail:
        "Clinical leadership in managing resistant high blood pressure and preventive cardiac strategies.",
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      color: "from-amber-50 to-amber-100",
    },
    {
      title: "Preventative Screening",
      detail:
        "Advanced cardiovascular risk assessment using modern screening technology and personalized plans.",
      icon: <FlaskConical className="w-6 h-6 text-emerald-600" />,
      color: "from-emerald-50 to-emerald-100",
    },
  ];

  const credentials = [
    {
      text: "MBBS, CCD, CCC, CMJ",
      icon: <BookOpenText className="w-4 h-4 text-slate-400" />,
    },
    {
      text: "PMDC Reg. No. 123456",
      icon: <Stethoscope className="w-4 h-4 text-slate-400" />,
    },
    {
      text: "15+ Years Experience",
      icon: <Zap className="w-4 h-4 text-slate-400" />,
    },
    {
      text: "Verified Specialist",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    },
  ];

  return (
    <div className="relative mt-20 md:mt-28 py-16 px-6 md:px-12 lg:px-20 bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden group">
      {/* Background Decor - Matches Login/Signup Glow theme */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none transition-all group-hover:bg-red-600/10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        {/* LEFT SIDE: Text & Professional Bio */}
        <div className="lg:col-span-4 space-y-10 text-center lg:text-left">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 shadow-inner">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                World-Class Care
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
              Clinical{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">
                Expertise.
              </span>
            </h3>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Dedicated to treating complex cardiovascular conditions with
              precision, using non-invasive and data-driven methods. Experience
              that saves lives.
            </p>
          </div>

          {/* Credentials Checklist */}
          <div className="pt-10 border-t border-slate-100 space-y-4">
            {credentials.map((cred, i) => (
              <div
                key={i}
                className="flex items-center gap-3 justify-center lg:justify-start"
              >
                {cred.icon}
                <span className="text-xs md:text-sm font-semibold tracking-wide text-slate-700">
                  {cred.text}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 opacity-60">
            {" "}
            Wah Institute of Cardiology{" "}
          </p>
        </div>

        {/* RIGHT SIDE: Interactive Expertise Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 md:pt-0">
          {expertises.map((exp, index) => (
            <div
              key={index}
              className="relative flex items-start gap-6 p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all duration-700 hover:shadow-2xl hover:shadow-slate-200/50 hover:bg-white hover:-translate-y-1.5 overflow-hidden group/card"
            >
              {/* Inner subtle glow matching the icon */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${exp.color} opacity-0 group-hover/card:opacity-30 rounded-full blur-2xl transition-all pointer-events-none`}
              />

              {/* Icon Holder */}
              <div
                className={`p-4 rounded-2xl bg-white shadow-inner border border-slate-100 group-hover/card:scale-110 transition-transform`}
              >
                {exp.icon}
              </div>

              {/* Text content */}
              <div className="relative z-10 flex-1">
                <h4 className="font-extrabold text-xl md:text-2xl text-slate-950 tracking-tight mb-2 group-hover/card:text-red-700 transition-colors">
                  {exp.title}
                </h4>
                <p className="text-sm text-slate-500 group-hover/card:text-slate-600 leading-relaxed font-medium">
                  {exp.detail}
                </p>
              </div>

              {/* Minimal decoration */}
              <div className="absolute top-4 right-4 text-xs font-bold text-red-600 opacity-10 uppercase tracking-widest pointer-events-none">
                Cardio Pro
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Expertise;
