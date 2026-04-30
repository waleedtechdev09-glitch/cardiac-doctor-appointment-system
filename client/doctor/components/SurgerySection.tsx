"use client";
import React from "react";

const FullWidthVideoSection = () => {
  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-slate-900">
      {/* Video Container */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Apni surgery ya procedure ki video ka path yahan dein */}
          <source src="/surgery.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Subtle Overlay - Ye video ko thora professional look deta hai */}
        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
      </div>

      {/* Optional: Bottom Gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Aesthetic Border/Label Style (Aapki theme ke mutabiq) */}
      <div className="absolute top-10 left-10 z-10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-red-600 rounded-full" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] drop-shadow-md">
            Live Procedure Preview
          </span>
        </div>
      </div>
    </section>
  );
};

export default FullWidthVideoSection;
