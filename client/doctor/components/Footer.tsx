"use client";

import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaHeartbeat,
  FaHeart,
} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { APP_CONFIG } from "../../constant.js";

const Footer = () => {
  const { name } = APP_CONFIG;
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: ["Services", "Expertise", "Booking", "Specialists"],
    },
    {
      title: "Support",
      links: [
        "Help Center",
        "Book Appointment",
        "Privacy Policy",
        "Terms of Service",
      ],
    },
    {
      title: "Contact",
      links: [
        "+92 311 7248123",
        "waleedtechdev09@gmail.com",
        "Wah Cantt, Punjab",
        "Clinic Locator",
      ],
    },
  ];

  const socialIcons = [FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn];

  return (
    <footer className="relative overflow-hidden bg-[#0f172a] py-16 sm:py-20 lg:pt-24 lg:pb-12">
      {/* Background Effects */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-red-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-blue-600/5 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/5 pb-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-4">
            <div className="group flex items-center gap-3">
              <div className="rounded-2xl bg-red-600 p-3 shadow-lg shadow-red-600/20 transition-transform duration-300 group-hover:scale-110">
                <FaHeartbeat className="text-2xl text-white" />
              </div>

              <span className="text-xl font-black uppercase italic tracking-tighter text-white sm:text-2xl">
                {name}
              </span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed font-medium text-slate-400">
              Revolutionizing cardiac care through advanced diagnostics,
              personalized treatment plans, and expert medical guidance. Your
              heart health is our highest priority.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap items-center gap-3">
              {socialIcons.map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label="social-link"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/20"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Navigation */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="space-y-4 sm:col-span-1 lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                {section.title}
              </h4>

              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="group flex items-center gap-1 text-sm font-medium text-slate-400 transition-all duration-300 hover:translate-x-1 hover:text-red-500"
                    >
                      <span>{link}</span>
                      <FiArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-6 pt-10 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="max-w-md text-center text-xs leading-relaxed font-medium tracking-wide text-slate-500 md:text-left">
            © {currentYear} {name}. All rights reserved. Designed with
            <FaHeart className="mx-1 inline text-red-600" />
            by
            <span className="ml-1 text-slate-300">Mudassar & Team</span>
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Server Online
              </span>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              v1.0.4 — Production
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
