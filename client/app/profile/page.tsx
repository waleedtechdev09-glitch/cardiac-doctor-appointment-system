"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock3, LoaderCircle, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingApi, type BookingRecord } from "@/lib/booking";

type AuthUser = {
  id: string;
  username: string;
  email: string;
};

const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem("authUser");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const formatBookingTime = (timeRange: string) => {
  const [start, end] = timeRange.split(" - ");

  if (!start || !end) {
    return timeRange;
  }

  const toLabel = (time: string) => {
    const [hourText, minuteText] = time.split(":");
    const hour = Number(hourText);
    const minute = Number(minuteText);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return time;
    }

    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
  };

  return `${toLabel(start)} - ${toLabel(end)}`;
};

const getStatusMeta = (status: BookingRecord["status"]) => {
  switch (status) {
    case "confirmed":
      return {
        label: "Accepted",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "cancelled":
      return {
        label: "Rejected",
        className: "bg-rose-50 text-rose-700 border-rose-200",
      };
    case "completed":
      return {
        label: "Completed",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    default:
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("authToken");
    const storedUser = getStoredUser();

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    let isActive = true;

    const loadBookings = async () => {
      setIsLoadingBookings(true);
      setBookingsError("");

      try {
        const response = await bookingApi.getMyBookings();

        if (isActive) {
          setBookings(response.bookings ?? []);
        }
      } catch (error) {
        if (isActive) {
          setBookingsError(
            error instanceof Error
              ? error.message
              : "Failed to load booking requests.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingBookings(false);
        }
      }
    };

    void loadBookings();

    return () => {
      isActive = false;
    };
  }, [router]);

  const handleLogout = () => {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("authUser");
    window.dispatchEvent(new Event("storage"));
    setUser(null);
    setBookings([]);
    router.push("/");
  };

  const requestSummary = useMemo(() => {
    if (!bookings.length) {
      return "No appointment requests yet.";
    }

    return `${bookings.length} request${bookings.length === 1 ? "" : "s"} found.`;
  }, [bookings.length]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#eef2ff_100%)] px-4 py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
            Account
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Profile
          </h1>
          <p className="text-base leading-7 text-slate-600">
            Review your account details and track every appointment request from here.
          </p>
        </div>

        <Card className="border-slate-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <CardHeader className="space-y-3 border-b border-slate-100 bg-white/80">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20">
                <User className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">
                  {user ? user.username : "Guest Profile"}
                </CardTitle>
                <CardDescription className="text-slate-500">
                  {user
                    ? "Your patient account is active."
                    : "You are not signed in yet."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-6 md:p-8">
            {user ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Username
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {user.username}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Email
                  </p>
                  <p className="mt-2 break-words text-lg font-semibold text-slate-900">
                    {user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                Please log in to view your profile details.
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Appointment Requests</h2>
                  <p className="mt-1 text-sm text-slate-500">{requestSummary}</p>
                </div>
                {isLoadingBookings ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Loading
                  </div>
                ) : null}
              </div>

              {bookingsError ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {bookingsError}
                </div>
              ) : null}

              {!isLoadingBookings && !bookings.length && !bookingsError ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                  You have not submitted any appointment requests yet.
                </div>
              ) : null}

              <div className="mt-5 space-y-4">
                {bookings.map((booking) => {
                  const statusMeta = getStatusMeta(booking.status);

                  return (
                    <div
                      key={booking._id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${statusMeta.className}`}
                            >
                              {statusMeta.label}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">
                              {booking.patientName || user?.username || "Appointment request"}
                            </span>
                          </div>

                           <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-red-600" />
                              <span>Appointment: {booking.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock3 className="h-4 w-4 text-red-600" />
                              <span>Slot: {formatBookingTime(booking.time)}</span>
                            </div>
                          </div>

                          {booking.status === "completed" && booking.prescription ? (
                            <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                                Digital Prescription
                              </p>
                              {booking.prescription.doctorNotes ? (
                                <p className="mt-2 text-sm text-blue-900">{booking.prescription.doctorNotes}</p>
                              ) : null}
                              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-blue-900">
                                {(booking.prescription.medicines ?? []).map((medicine, index) => (
                                  <li key={index}>
                                    <span className="font-semibold">{medicine.name}</span> — {medicine.dosage} | {medicine.timing} | {medicine.duration}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>

                        <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                            Request Date & Time
                          </p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {formatDateTime(booking.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-11 items-center gap-2 rounded-xl bg-red-600 px-6 text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-11 rounded-xl bg-red-600 px-6 text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
                >
                  <Link href="/login">Go to Login</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
