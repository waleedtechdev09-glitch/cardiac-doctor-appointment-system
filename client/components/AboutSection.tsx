import React from "react";
import { Heart, ShieldCheck, Stethoscope, Award } from "lucide-react";
import Image from "next/image";

const AboutSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="relative w-full">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-md shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1200"
                alt="Cardiology Specialist"
                width={1200}
                height={800}
                className="h-[320px] sm:h-[400px] lg:h-[500px] w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Floating Badge - Trusted Care */}
            <div className="absolute left-4 top-4 sm:left-6 sm:top-6 rounded-full bg-white px-4 py-2 shadow-lg flex items-center gap-2 group cursor-pointer transition-all duration-300 hover:shadow-xl">
              <Heart
                className="
      h-5 w-5
      text-red-600
      transition-all duration-300
      group-hover:text-red-600
      group-hover:fill-red-600
      group-hover:scale-110
    "
              />

              <span className="text-sm font-semibold text-slate-800">
                Trusted Care
              </span>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 right-4 sm:right-8 bg-red-600 text-white rounded-xl p-4 shadow-xl">
              <h3 className="text-2xl font-bold">15+</h3>
              <p className="text-xs text-red-100">
                Years of Cardiac Excellence
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900">
              Caring For Every Heart,
              <span className="block text-red-600">Every Step Of The Way</span>
            </h2>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              We are committed to providing world-class cardiac care through
              advanced diagnostics, personalized treatment plans, and a team of
              experienced specialists dedicated to your well-being.
            </p>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              From preventive heart screenings to complex cardiovascular
              treatments, our mission is to help patients live healthier,
              longer, and more confident lives.
            </p>

            {/* FEATURES */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-xl border border-red-100 hover:shadow-lg transition bg-white">
                <ShieldCheck className="h-8 w-8 text-red-600 mb-3" />
                <h4 className="font-bold text-slate-900">
                  Advanced Technology
                </h4>
                <p className="text-sm text-slate-600">
                  State-of-the-art diagnostic and treatment facilities.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-red-100 hover:shadow-lg transition bg-white">
                <Stethoscope className="h-8 w-8 text-red-600 mb-3" />
                <h4 className="font-bold text-slate-900">Expert Specialists</h4>
                <p className="text-sm text-slate-600">
                  Experienced cardiologists providing care.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-red-100 hover:shadow-lg transition bg-white">
                <Heart className="h-8 w-8 text-red-600 mb-3" />
                <h4 className="font-bold text-slate-900">
                  Patient-Centered Care
                </h4>
                <p className="text-sm text-slate-600">
                  Personalized treatment plans focused on you.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-red-100 hover:shadow-lg transition bg-white">
                <Award className="h-8 w-8 text-red-600 mb-3" />
                <h4 className="font-bold text-slate-900">Proven Excellence</h4>
                <p className="text-sm text-slate-600">
                  Trusted by thousands of patients worldwide.
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 border-t pt-6 border-slate-200">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-red-600">
                  10K+
                </h3>
                <p className="text-xs md:text-sm text-slate-500">
                  Happy Patients
                </p>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-red-600">
                  25+
                </h3>
                <p className="text-xs md:text-sm text-slate-500">Specialists</p>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-red-600">
                  98%
                </h3>
                <p className="text-xs md:text-sm text-slate-500">
                  Success Rate
                </p>
              </div>
            </div>

            {/* CTA */}
            <button className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-xl">
              Learn More About Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
