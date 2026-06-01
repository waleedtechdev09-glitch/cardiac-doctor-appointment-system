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
  ChevronRight,
  Hospital,
} from "lucide-react";

const Expertise = () => {
  const expertises = [
    {
      title: "Interventional Cardiology",
      detail:
        "Expertise in minimally invasive procedures such as angioplasty, stenting, and catheterizations.",
      icon: <Target className="w-6 h-6 text-red-600" />,
      tag: "Surgery",
    },
    {
      title: "Heart Failure Specialist",
      detail:
        "Comprehensive management of complex heart failure cases, using state-of-the-art diagnostics.",
      icon: <Award className="w-6 h-6 text-blue-600" />,
      tag: "Critical",
    },
    {
      title: "Hypertension Control",
      detail:
        "Clinical leadership in managing resistant high blood pressure and preventive cardiac strategies.",
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      tag: "Chronic",
    },
    {
      title: "Preventative Screening",
      detail:
        "Advanced cardiovascular risk assessment using modern screening technology.",
      icon: <FlaskConical className="w-6 h-6 text-emerald-600" />,
      tag: "Wellness",
    },
  ];

  const credentials = [
    { text: "MBBS, CCD, CCC, CMJ", icon: <BookOpenText className="w-4 h-4" /> },
    { text: "PMDC Reg. No. 123456", icon: <Stethoscope className="w-4 h-4" /> },
    { text: "15+ Years Experience", icon: <Zap className="w-4 h-4" /> },
    {
      text: "Verified Specialist",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* HEADER SECTION: Centered (Like Services) */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
            Clinical <span className="text-red-600">Expertise</span> &
            Experience.
          </h2>

          <p className="text-slate-500 text-lg leading-relaxed mb-10">
            Dedicated to treating complex cardiovascular conditions with
            precision and care in <strong>Wah Cantt</strong>.
          </p>

          {/* CREDENTIALS BAR: Horizontal/Centered */}
          <div className="flex flex-wrap justify-center gap-6 py-6 border-y border-slate-100">
            {credentials.map((cred, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-slate-400">{cred.icon}</div>
                <span className="text-xs md:text-sm font-bold text-slate-700 whitespace-nowrap">
                  {cred.text}
                </span>
              </div>
            ))}
          </div>

          {/* AFFILIATION: Small centered badge */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
              <span>
                <Hospital className="text-red-500" />
              </span>
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none">
                Affiliation
              </p>
              <p className="text-sm font-bold text-slate-900">
                Wah Institute of Cardiology
              </p>
            </div>
          </div>
        </div>

        {/* CARDS SECTION: Below the header */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {expertises.map((exp, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded border border-slate-200 hover:border-red-200 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-md bg-slate-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                    {exp.icon}
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter border border-slate-100 px-2 py-1 rounded">
                    {exp.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                  {exp.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {exp.detail}
                </p>
              </div>

              {/* <div className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-red-600 transition-all cursor-pointer">
                <span>View Details</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
