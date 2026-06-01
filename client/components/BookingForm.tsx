"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";
import { APP_CONFIG } from "../constant.js";

const BookingForm = () => {
  const { name } = APP_CONFIG;
  const router = useRouter();

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

  // ✅ FIXED TYPE HERE
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log("Booking Data:", formData);

    setTimeout(() => {
      setLoading(false);
      router.push("/booking-successful");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white py-20 px-4 md:px-10 flex items-center justify-center mt-12">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 lg:mt-8">
          <h1 className="text-3xl md:text-5xl font-light text-slate-900 mb-4">
            Get Started <span className="font-bold text-red-600">Today</span>
          </h1>

          <div className="w-20 h-1 bg-red-600 mx-auto mb-6 rounded-full" />

          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
            Your heart health is our priority. Fill out the form below to book
            your appointment at{" "}
            <span className="font-semibold text-red-600">{name}</span>.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-slate-50 p-8 rounded-md border border-slate-100 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Patient Full Name
              </label>
              <Input
                required
                className="h-12 bg-white border-slate-200 focus-visible:ring-red-500"
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
              />
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Age
              </label>
              <Input
                type="number"
                required
                className="h-12 bg-white border-slate-200 focus-visible:ring-red-500"
                onChange={(e) =>
                  setFormData({ ...formData, patientAge: e.target.value })
                }
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Gender
              </label>
              <select
                className="w-full h-12 bg-white border border-slate-200 rounded px-3 text-sm focus:ring-2 focus:ring-red-500"
                onChange={(e) =>
                  setFormData({ ...formData, patientGender: e.target.value })
                }
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Appointment Date
              </label>
              <Input
                type="date"
                required
                className="h-12 bg-white border-slate-200 focus-visible:ring-red-500"
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Preferred Time Slot
              </label>
              <select
                required
                className="w-full h-12 bg-white border border-slate-200 rounded px-3 text-sm focus:ring-2 focus:ring-red-500"
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

            {/* Blood Pressure */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Blood Pressure (Optional)
              </label>
              <Input
                placeholder="e.g. 120/80"
                className="h-12 bg-white border-slate-200 focus-visible:ring-red-500"
                onChange={(e) =>
                  setFormData({ ...formData, bloodPressure: e.target.value })
                }
              />
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-700">
              Symptoms
            </label>
            <Textarea
              className="min-h-[150px] bg-white border-slate-200 focus-visible:ring-red-500"
              placeholder="Briefly describe your condition..."
              onChange={(e) =>
                setFormData({ ...formData, symptoms: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest px-12 py-6 rounded-md shadow-lg flex items-center gap-3 active:scale-95"
            >
              {loading ? (
                "Booking..."
              ) : (
                <>
                  Confirm Appointment
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
