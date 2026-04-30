"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ChevronRight } from "lucide-react";
import { APP_CONFIG } from "../../constant.js";
import Link from "next/link.js";

const BookingForm = () => {
  const { name } = APP_CONFIG;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "Male",
    date: "",
    time: "",
    bloodPressure: "",
    symptoms: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Booking Data:", formData);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    // Red and White Theme Container
    <div className="min-h-screen bg-white py-20 px-4 md:px-10 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Header Section - Red Accent */}
        <div className="text-center mb-12 lg:mt-8">
          <h1 className="text-3xl md:text-5xl font-light text-slate-900 mb-4">
            Get Started <span className="font-bold text-red-600">Today</span>
          </h1>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
            Your heart health is our priority. Fill out the form below to book
            your appointment at{" "}
            <span className="font-semibold text-red-600">{name}</span>.
          </p>
        </div>

        {/* Form Section with subtle Red borders */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-slate-50 p-8 rounded-md border border-slate-100 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-5">
            {/* Row 1: Basic Info */}
            <div className="space-y-1.5">
              <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                Patient Full Name
              </label>
              <Input
                required
                className="bg-white border-slate-200 h-12 rounded focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-red-500"
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                Age
              </label>
              <Input
                type="number"
                required
                className="bg-white border-slate-200 h-12 rounded focus-visible:ring-red-500"
                onChange={(e) =>
                  setFormData({ ...formData, patientAge: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                Gender
              </label>
              <select
                className="w-full bg-white border border-slate-200 h-12 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, patientGender: e.target.value })
                }
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Row 2: Timing */}
            <div className="space-y-1.5">
              <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                Appointment Date
              </label>
              <Input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="bg-white border-slate-200 h-12 rounded focus-visible:ring-red-500"
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                Preferred Time Slot
              </label>
              <select
                required
                className="w-full bg-white border border-slate-200 h-12 rounded px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              >
                <option value="">Select a slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                Blood Pressure (Optional)
              </label>
              <Input
                placeholder="e.g. 120/80"
                className="bg-white border-slate-200 h-12 rounded focus-visible:ring-red-500"
                onChange={(e) =>
                  setFormData({ ...formData, bloodPressure: e.target.value })
                }
              />
            </div>
          </div>

          {/* Row 3: Symptoms & Reports */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="space-y-1.5">
              <label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">
                Symptoms
              </label>
              <Textarea
                className="bg-white border-slate-200 min-h-[150px] rounded resize-none focus-visible:ring-red-500"
                placeholder="Briefly describe your condition..."
                onChange={(e) =>
                  setFormData({ ...formData, symptoms: e.target.value })
                }
              />
            </div>
          </div>

          {/* Red Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest px-12 py-7 rounded-md cursor-pointer text-sm shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center gap-3"
            >
              {loading ? (
                "Booking..."
              ) : (
                <>
                  <Link href="/booking-successful">Confirm Appointment</Link>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center mt-10 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-semibold">
          Certified Cardiac Services • {name} • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default BookingForm;
