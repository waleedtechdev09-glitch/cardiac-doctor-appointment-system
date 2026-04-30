"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { APP_CONFIG } from "../../constant.js";
import Image from "next/image.js";

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
                <button className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest group/btn">
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Updated CTA Card with rounded-md */}
        <div className="mt-20 bg-slate-900 rounded-md p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Start Your Cardiac Checkup
            </h3>
            <p className="text-slate-400">
              Reliable diagnosis and care at your fingertips.
            </p>
          </div>
          <button
            className={`relative z-10 px-8 py-4 ${colors.primary} ${colors.primaryHover} text-white rounded-md font-bold uppercase tracking-widest text-xs transition-all active:scale-95 whitespace-nowrap`}
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
