"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Activity,
  Heart,
  AlertCircle,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { APP_CONFIG } from "../../constant.js";

const BookingForm = () => {
  const { name, colors } = APP_CONFIG;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "Male",
    date: "",
    time: "",
    bloodPressure: "",
    symptoms: "",
    isEmergency: false,
  });

  // Example slots based on your backend logic (9am-1pm, 2pm-9pm)
  const timeSlots = [
    "09:00 - 09:30",
    "10:00 - 10:30",
    "11:00 - 11:30",
    "12:00 - 12:30",
    "14:00 - 14:30",
    "15:00 - 15:30",
    "16:00 - 16:30",
    "18:00 - 18:30",
    "20:00 - 20:30",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Yahan aapki API call jayegi createBooking endpoint par
    console.log("Booking Data:", formData);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 pt-28 pb-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        {/* LEFT SIDE: Info Panel (Dark Blue/Red Theme) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="bg-red-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-600/20">
              <Heart className="text-white w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-4">
              Book Your <br />
              <span className="text-red-500">Checkup.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Fill in your vitals and preferred time. Our system will calculate
              your risk score automatically.
            </p>

            <ul className="space-y-4">
              {[
                {
                  icon: <Activity className="w-4 h-4" />,
                  text: "Real-time Slot Checking",
                },
                {
                  icon: <AlertCircle className="w-4 h-4" />,
                  text: "Emergency Prioritization",
                },
                {
                  icon: <ClipboardList className="w-4 h-4" />,
                  text: "Digital Prescriptions",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"
                >
                  <span className="text-red-500">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Background Decor */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        {/* RIGHT SIDE: Actual Form */}
        <div className="lg:col-span-8 bg-white p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Patient Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    required
                    placeholder="Enter name"
                    className="pl-10 h-12 border-slate-100 bg-slate-50 focus:bg-white transition-all rounded-xl"
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Age
                  </label>
                  <Input
                    type="number"
                    required
                    placeholder="Years"
                    className="h-12 border-slate-100 bg-slate-50 rounded-xl"
                    onChange={(e) =>
                      setFormData({ ...formData, patientAge: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Gender
                  </label>
                  <select
                    className="w-full h-12 border border-slate-100 bg-slate-50 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patientGender: e.target.value,
                      })
                    }
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Appointment Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="pl-10 h-12 border-slate-100 bg-slate-50 rounded-xl"
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Available Slots
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <select
                    required
                    className="w-full pl-10 h-12 border border-slate-100 bg-slate-50 rounded-xl text-sm appearance-none focus:outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Vitals (BP) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Blood Pressure (e.g. 120/80)
              </label>
              <Input
                placeholder="BP reading"
                className="h-12 border-slate-100 bg-slate-50 rounded-xl"
                onChange={(e) =>
                  setFormData({ ...formData, bloodPressure: e.target.value })
                }
              />
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Symptoms / Reason
              </label>
              <Textarea
                placeholder="Describe how you're feeling..."
                className="min-h-[100px] border-slate-100 bg-slate-50 rounded-xl resize-none"
                onChange={(e) =>
                  setFormData({ ...formData, symptoms: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <Button
              disabled={loading}
              className={`w-full h-14 rounded-xl text-md font-bold uppercase tracking-widest transition-all ${colors.primary} ${colors.primaryHover} text-white shadow-xl shadow-red-600/20 group flex items-center justify-center gap-2`}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Confirm Appointment
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-center text-[10px] text-slate-400 font-medium">
              By booking, you agree to our terms of medical service. Emergency
              cases are prioritized based on Risk Score.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
