"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, LoaderCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bookingApi } from "@/lib/booking";
import { APP_CONFIG } from "../constant.js";

const WORKING_PERIODS = [
  { start: 9 * 60, end: 13 * 60 },
  { start: 14 * 60, end: 21 * 60 },
];

const formatClock = (minutes: number) => {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
};

const formatTimeRange = (slot: string) => {
  const [start, end] = slot.split(" - ");

  if (!start || !end) {
    return slot;
  }

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  if (
    Number.isNaN(startHour) ||
    Number.isNaN(startMinute) ||
    Number.isNaN(endHour) ||
    Number.isNaN(endMinute)
  ) {
    return slot;
  }

  return `${formatClock(startHour * 60 + startMinute)} - ${formatClock(endHour * 60 + endMinute)}`;
};

const generateTimeSlots = () => {
  const slots: string[] = [];

  for (const period of WORKING_PERIODS) {
    for (let start = period.start; start < period.end; start += 30) {
      const end = start + 30;

      if (end > period.end) {
        break;
      }

      const format = (minutes: number) => {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      };

      slots.push(`${format(start)} - ${format(end)}`);
    }
  }

  return slots;
};

const getTodayValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const BookingForm = () => {
  const { name } = APP_CONFIG;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "Male",
    date: "",
    time: "",
    bloodPressure: "",
    symptoms: "",
  });

  const timeSlots = generateTimeSlots();
  const todayValue = getTodayValue();

  useEffect(() => {
    const token = window.localStorage.getItem("authToken");
    const user = window.localStorage.getItem("authUser");

    if (!token || !user) {
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const loadingToastId = toast.loading(
      "Submitting your appointment request...",
    );
    const startedAt = Date.now();

    setLoading(true);

    try {
      const response = await bookingApi.createBooking({
        ...formData,
        isEmergency: false,
      });

      const elapsed = Date.now() - startedAt;
      if (elapsed < 6000) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, 6000 - elapsed),
        );
      }

      toast.update(loadingToastId, {
        render:
          response.message ||
          "Your appointment request has been submitted successfully.",
        type: "success",
        isLoading: false,
        autoClose: 1800,
        closeOnClick: true,
        pauseOnHover: false,
      });

      window.setTimeout(() => {
        router.push("/booking-successful");
      }, 1800);
    } catch (submissionError) {
      const elapsed = Date.now() - startedAt;
      if (elapsed < 6000) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, 6000 - elapsed),
        );
      }

      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Booking request failed.";

      toast.update(loadingToastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
      });

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-20 mt-12 flex items-center justify-center md:px-10">
      <ToastContainer position="top-right" theme="colored" />

      <div className="w-full max-w-5xl">
        <div className="mb-12 text-center lg:mt-8">
          <h1 className="mb-4 text-3xl font-light text-slate-900 md:text-5xl">
            Get Started <span className="font-bold text-red-600">Today</span>
          </h1>

          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-red-600" />

          <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base">
            Your heart health is our priority. Fill out the form below to book
            your appointment at{" "}
            <span className="font-semibold text-red-600">{name}</span>.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-md border border-slate-100 bg-slate-50 p-8 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Patient Full Name
              </label>
              <Input
                required
                value={formData.patientName}
                className="h-12 border-slate-200 bg-white focus-visible:ring-red-500"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    patientName: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Age
              </label>
              <Input
                type="number"
                required
                value={formData.patientAge}
                className="h-12 border-slate-200 bg-white focus-visible:ring-red-500"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    patientAge: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Gender
              </label>
              <select
                value={formData.patientGender}
                className="h-12 w-full rounded border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-red-500"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    patientGender: event.target.value,
                  }))
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Appointment Date
              </label>
              <Input
                type="date"
                required
                min={todayValue}
                value={formData.date}
                className="h-12 border-slate-200 bg-white focus-visible:ring-red-500"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Preferred Time Slot
              </label>
              <select
                required
                value={formData.time}
                className="h-12 w-full rounded border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-red-500"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    time: event.target.value,
                  }))
                }
              >
                <option value="">Select a slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatTimeRange(slot)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Blood Pressure (Optional)
              </label>
              <Input
                value={formData.bloodPressure}
                placeholder="e.g. 120/80"
                className="h-12 border-slate-200 bg-white focus-visible:ring-red-500"
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    bloodPressure: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-700">
              Symptoms
            </label>
            <Textarea
              value={formData.symptoms}
              className="min-h-[150px] border-slate-200 bg-white focus-visible:ring-red-500"
              placeholder="Briefly describe your condition..."
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  symptoms: event.target.value,
                }))
              }
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center cursor-pointer gap-3 rounded-md bg-red-600 px-12 py-6 font-bold uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 hover:bg-red-700"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                <>
                  Confirm Appointment
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Certified Cardiac Services - {name} - {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default BookingForm;
