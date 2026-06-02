"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "Simply select your preferred date and time slot, fill in your details, and submit the appointment request. Our team will review and confirm your booking.",
    },
    {
      question: "Will I receive a booking confirmation?",
      answer:
        "Yes. Once your appointment request is reviewed, you will receive a confirmation email with all appointment details.",
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer:
        "Yes, appointments can be canceled or rescheduled before the scheduled consultation time.",
    },
    {
      question: "What information do I need to provide?",
      answer:
        "You'll need to provide your name, age, gender, preferred appointment date, and any symptoms or medical concerns you want to discuss.",
    },
    {
      question: "Are online consultations available?",
      answer:
        "Depending on doctor availability, both in-person and online consultations may be offered.",
    },
    {
      question: "Is my medical information secure?",
      answer:
        "Absolutely. We use secure systems and industry-standard practices to protect your personal and medical information.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
            Got Questions?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Find answers to the most common questions about appointments,
            consultations, and cardiac care services.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left"
              >
                <h3 className="pr-4 text-base font-semibold text-slate-900 md:text-lg">
                  {faq.question}
                </h3>

                <ChevronDown
                  className={`h-5 w-5 text-red-600 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl bg-red-600 p-8 text-center text-white">
          <h3 className="text-2xl font-bold">Still Have Questions?</h3>

          <p className="mt-2 text-red-100">
            Contact our support team and we'll help you with any concerns.
          </p>

          <button className="mt-6 rounded-lg bg-white px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
