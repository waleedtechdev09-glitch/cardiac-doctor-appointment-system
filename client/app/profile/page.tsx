"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock3, LoaderCircle, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const [user, setUser] = useState<AuthUser | null>(null);
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

    setUser(storedUser);

    let isActive = true;

    const loadProfile = async () => {
      const storedToken = window.localStorage.getItem("authToken");
      if (!storedToken) {
        if (isActive) {
          router.replace("/login");
        }
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/user/profile`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          },
        );

        if (!res.ok) {
          throw new Error("Session expired. Please log in again.");
        }

        const data = await res.json();

        if (isActive && data.user) {
          setUser({
            id: data.user.id || storedUser.id,
            username: data.user.username || storedUser.username,
            email: data.user.email || storedUser.email,
          });
        }
      } catch {
        if (isActive) {
          router.replace("/login");
        }
      }
    };

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

    void loadProfile();
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#eef2ff_100%)] px-4 py-12 sm:py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
        {/* Top Header Panel */}
        <div className="max-w-2xl space-y-2 text-center md:text-left px-1">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            Account Management
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
            Profile Settings
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-slate-500">
            Review your verified account details and track every active
            appointment medical status dynamically.
          </p>
        </div>

        {/* Core Main Base Card */}
        <Card className="rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          <CardHeader className="space-y-4 p-5 sm:p-6 md:p-8 border-b border-slate-50 bg-slate-50/20">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500 text-white shadow-md shadow-red-500/10">
                <User className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                  {user ? user.username : "Guest Profile"}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-400">
                  {user
                    ? "Your secure patient dashboard is active."
                    : "You are currently not signed into any session."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {/* User Details Grid */}
            {user ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="rounded-md border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
                  <p className="text-[10px] font-normal uppercase tracking-wider text-red-400">
                    Registered Username
                  </p>
                  <p className="mt-1.5 text-[14px] sm:text-md font-medium text-slate-500">
                    {user.username}
                  </p>
                </div>
                <div className="rounded-md border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
                  <p className="text-[10px] font-normal uppercase tracking-wider text-red-400">
                    Email Address
                  </p>
                  <p className="mt-1.5 break-words text-[14px] sm:text-md font-normal text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-center text-slate-500">
                Please authenticate your credentials to view secure details.
              </div>
            )}

            {/* Appointment Tracker Block */}
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-4 sm:p-5">
                <div>
                  <h2 className="text-md sm:text-lg font-bold text-slate-900">
                    Appointment Requests
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
                    {requestSummary}
                  </p>
                </div>
                {isLoadingBookings && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin text-red-500" />
                    Syncing
                  </div>
                )}
              </div>

              {bookingsError && (
                <div className="m-4 rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-xs sm:text-sm text-rose-600">
                  {bookingsError}
                </div>
              )}

              {!isLoadingBookings && !bookings.length && !bookingsError && (
                <div className="py-12 text-center text-xs sm:text-sm text-slate-400">
                  No medical checkup requests filed under this account profile
                  yet.
                </div>
              )}

              {/* Dynamic Responsive Table Wrapper */}
              {bookings.length > 0 && (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="hidden sm:table-row border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="p-4 pl-5">Patient & Status</th>
                        <th className="p-4">Schedule Details</th>
                        <th className="p-4 pr-5">Submission Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 block sm:table-row-group">
                      {bookings.map((booking) => {
                        const statusMeta = getStatusMeta(booking.status);

                        return (
                          <tr
                            key={booking._id}
                            className="block sm:table-row transition-all hover:bg-slate-50/30 p-4 sm:p-0 border-b border-slate-100 sm:border-none"
                          >
                            {/* Column 1: Patient Status & Identity */}
                            <td className="block sm:table-cell p-0 sm:p-4 sm:pl-5 pb-2 sm:pb-4 align-top">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusMeta.className}`}
                                >
                                  {statusMeta.label}
                                </span>
                                <span className="text-sm font-semibold text-slate-800">
                                  {booking.patientName ||
                                    user?.username ||
                                    "Patient Request"}
                                </span>
                              </div>
                            </td>

                            {/* Column 2: Date, Slot & Prescriptions */}
                            <td className="block sm:table-cell p-0 sm:p-4 py-2 sm:py-4 align-top">
                              <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                  <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
                                  <span>
                                    Date:{" "}
                                    <strong className="text-slate-700 font-medium">
                                      {booking.date}
                                    </strong>
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock3 className="h-4 w-4 text-slate-400 shrink-0" />
                                  <span>
                                    Slot:{" "}
                                    <strong className="text-slate-700 font-medium">
                                      {formatBookingTime(booking.time)}
                                    </strong>
                                  </span>
                                </div>
                              </div>

                              {/* Nested Prescription Render Engine */}
                              {booking.status === "completed" &&
                                booking.prescription && (
                                  <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4 space-y-2 max-w-xl">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                      Official Digital Prescription Notes
                                    </p>
                                    {booking.prescription.doctorNotes && (
                                      <p className="text-xs text-blue-900/90 leading-relaxed font-medium">
                                        {booking.prescription.doctorNotes}
                                      </p>
                                    )}
                                    {booking.prescription.medicines &&
                                      booking.prescription.medicines.length >
                                        0 && (
                                        <ul className="mt-2 space-y-1.5 border-t border-blue-100/50 pt-2 text-xs text-blue-900/80 list-none">
                                          {booking.prescription.medicines.map(
                                            (medicine, index) => (
                                              <li
                                                key={index}
                                                className="flex items-start gap-1"
                                              >
                                                <span className="text-blue-500 mt-0.5">
                                                  •
                                                </span>
                                                <div>
                                                  <strong className="font-semibold text-blue-950">
                                                    {medicine.name}
                                                  </strong>
                                                  <span className="text-blue-800/70">
                                                    {" "}
                                                    — {medicine.dosage} |{" "}
                                                    {medicine.timing} |{" "}
                                                    {medicine.duration}
                                                  </span>
                                                </div>
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      )}
                                  </div>
                                )}
                            </td>

                            {/* Column 3: Created Timestamp Column */}
                            <td className="block sm:table-cell p-0 sm:p-4 pt-1 sm:pt-4 sm:pr-5 align-top text-xs text-slate-500">
                              <span className="sm:hidden font-bold text-slate-400 uppercase text-[9px] tracking-wider block mb-0.5">
                                Requested Timestamp
                              </span>
                              <span className="font-medium sm:font-normal text-slate-700 sm:text-slate-500">
                                {formatDateTime(booking.createdAt)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bottom Actions Router Control Buttons */}
            <div className="flex flex-col sm:flex-row pt-2 gap-3">
              {user ? (
                <Button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-11 items-center justify-center gap-2 cursor-pointer rounded-lg bg-red-600 px-6 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.99] w-full sm:w-auto"
                >
                  <LogOut className="h-4 w-4" />
                  Logout Account
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-11 items-center justify-center cursor-pointer rounded-lg bg-red-600 px-6 text-sm font-medium text-white transition-all hover:bg-red-700 w-full sm:w-auto"
                >
                  <Link href="/login">Navigate to Login</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
