"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  LogOut,
  Minus,
  Plus,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  bookingApi,
  type BookingRecord,
  type PrescriptionMedicine,
} from "@/lib/booking";

type AuthUser = {
  id: string;
  username: string;
  email: string;
  role?: string;
};

const emptyMedicine = (): PrescriptionMedicine => ({
  name: "",
  dosage: "",
  timing: "",
  duration: "",
});

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

const formatRequestDate = (value: string) =>
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

const statusMeta = (status: BookingRecord["status"]) => {
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
        label: "Checkup Done",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    default:
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
  }
};

const resolveSelectedBooking = (
  bookings: BookingRecord[],
  currentId: string | null,
) => {
  if (currentId) {
    const currentBooking = bookings.find(
      (booking) => booking._id === currentId,
    );
    if (currentBooking) {
      return currentBooking;
    }
  }

  return bookings[0] ?? null;
};

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [doctor] = useState<AuthUser | null>(() => getStoredUser());
  const [isMounted, setIsMounted] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [reviewNote, setReviewNote] = useState("");
  const [prescriptionNote, setPrescriptionNote] = useState("");
  const [medicineRows, setMedicineRows] = useState<PrescriptionMedicine[]>([
    emptyMedicine(),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [error, setError] = useState("");

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking._id === selectedBookingId) ?? null,
    [bookings, selectedBookingId],
  );

  const resetPrescriptionForm = () => {
    setMedicineRows([emptyMedicine()]);
    setPrescriptionNote("");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("authToken");
    const storedDoctor = getStoredUser();

    if (!token || !storedDoctor || storedDoctor.role !== "doctor") {
      router.replace("/login?role=doctor");
      return;
    }

    let active = true;

    const loadBookings = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await bookingApi.getDoctorBookings();

        if (!active) {
          return;
        }

        const nextBookings = response.bookings ?? [];
        const nextSelected = resolveSelectedBooking(nextBookings, null);

        setBookings(nextBookings);
        setSelectedBookingId(nextSelected?._id ?? null);
        setReviewNote(nextSelected?.decisionReason ?? "");
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load booking requests.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadBookings();

    return () => {
      active = false;
    };
  }, [router]);

  const refreshBookings = async () => {
    const response = await bookingApi.getDoctorBookings();
    const nextBookings = response.bookings ?? [];
    const nextSelected = resolveSelectedBooking(
      nextBookings,
      selectedBookingId,
    );

    setBookings(nextBookings);
    setSelectedBookingId(nextSelected?._id ?? null);
    setReviewNote(nextSelected?.decisionReason ?? "");
  };

  const handleSelectBooking = (booking: BookingRecord) => {
    setSelectedBookingId(booking._id);
    setReviewNote(booking.decisionReason ?? "");
    setIsPrescriptionOpen(false);
    resetPrescriptionForm();
  };

  const handleReview = async (status: "confirmed" | "cancelled") => {
    if (!selectedBooking || selectedBooking.status !== "pending") {
      toast.error("Only pending requests can be reviewed.");
      return;
    }

    const cleanNote = reviewNote.trim();

    if (!cleanNote) {
      toast.error("Please add a note for the patient before submitting.");
      return;
    }

    setIsMutating(true);
    const loadingToastId = toast.loading(
      status === "confirmed" ? "Accepting request..." : "Rejecting request...",
    );

    try {
      if (status === "confirmed") {
        await bookingApi.approveBooking(selectedBooking._id, cleanNote);
      } else {
        await bookingApi.rejectBooking(selectedBooking._id, cleanNote);
      }

      await refreshBookings();

      toast.update(loadingToastId, {
        render:
          status === "confirmed"
            ? "Request accepted successfully."
            : "Request rejected successfully.",
        type: "success",
        isLoading: false,
        autoClose: 1800,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (submissionError) {
      toast.update(loadingToastId, {
        render:
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to update request.",
        type: "error",
        isLoading: false,
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleArchive = async (bookingId: string) => {
    setIsMutating(true);
    const loadingToastId = toast.loading("Removing request from dashboard...");

    try {
      await bookingApi.archiveBooking(bookingId);
      await refreshBookings();

      toast.update(loadingToastId, {
        render: "Request removed from doctor dashboard.",
        type: "success",
        isLoading: false,
        autoClose: 1800,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (submissionError) {
      toast.update(loadingToastId, {
        render:
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to delete request.",
        type: "error",
        isLoading: false,
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } finally {
      setIsMutating(false);
    }
  };

  const openPrescriptionForm = () => {
    if (!selectedBooking || selectedBooking.status !== "confirmed") {
      toast.error("Only accepted requests can be marked as checkup complete.");
      return;
    }

    setPrescriptionNote(selectedBooking.decisionReason ?? "");
    setMedicineRows([emptyMedicine()]);
    setIsPrescriptionOpen(true);
  };

  const closePrescriptionForm = () => {
    setIsPrescriptionOpen(false);
    resetPrescriptionForm();
  };

  const updateMedicineRow = (
    index: number,
    field: keyof PrescriptionMedicine,
    value: string,
  ) => {
    setMedicineRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  };

  const addMedicineRow = () => {
    setMedicineRows((current) => [...current, emptyMedicine()]);
  };

  const removeMedicineRow = (index: number) => {
    setMedicineRows((current) =>
      current.length === 1
        ? current
        : current.filter((_, rowIndex) => rowIndex !== index),
    );
  };

  const handleSendPrescription = async () => {
    if (!selectedBooking) {
      return;
    }

    const normalizedMedicines = medicineRows.map((row) => ({
      name: row.name.trim(),
      dosage: row.dosage.trim(),
      timing: row.timing.trim(),
      duration: row.duration.trim(),
    }));

    const hasEmptyRow = normalizedMedicines.some((row) =>
      Object.values(row).some((value) => !value),
    );

    if (hasEmptyRow) {
      toast.error("Please fill in every field for each medicine row.");
      return;
    }

    if (!normalizedMedicines.length) {
      toast.error("Please add at least one medicine.");
      return;
    }

    setIsMutating(true);
    const loadingToastId = toast.loading("Sending prescription to patient...");

    try {
      await bookingApi.addPrescription({
        bookingId: selectedBooking._id,
        medicines: normalizedMedicines,
        doctorNotes: prescriptionNote.trim(),
      });

      await refreshBookings();
      closePrescriptionForm();

      toast.update(loadingToastId, {
        render: "Prescription PDF sent to the patient email.",
        type: "success",
        isLoading: false,
        autoClose: 1800,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (submissionError) {
      toast.update(loadingToastId, {
        render:
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to send prescription.",
        type: "error",
        isLoading: false,
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("authUser");
    window.dispatchEvent(new Event("storage"));
    router.push("/doctor/login");
  };

  const selectedStatusMeta = selectedBooking
    ? statusMeta(selectedBooking.status)
    : statusMeta("pending");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#eff6ff_100%)] px-4 py-24">
      <ToastContainer position="top-right" theme="colored" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
              Doctor Dashboard
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Appointment Requests
            </h1>
            <p className="text-base leading-7 text-slate-600">
              Review requests, accept or reject with a note, and send a PDF
              prescription after the checkup is complete.
            </p>
            {isMounted && doctor ? (
              <p className="text-sm font-semibold text-slate-500">
                Logged in as {doctor.username}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl cursor-pointer border-slate-200 px-5 text-slate-700"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button
              type="button"
              className="h-11 rounded-xl cursor-pointer bg-red-600 px-5 text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Requests Table
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Showing request date, appointment date/time, status, and
                  delete action.
                </p>
              </div>
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Loading
                </div>
              ) : null}
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Request Date & Time</th>
                      <th className="px-4 py-3">Appointment Slot</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {bookings.map((booking) => {
                      const meta = statusMeta(booking.status);
                      const isSelected = booking._id === selectedBookingId;

                      return (
                        <tr
                          key={booking._id}
                          className={`cursor-pointer transition-colors hover:bg-slate-50 ${isSelected ? "bg-slate-50" : ""}`}
                          onClick={() => handleSelectBooking(booking)}
                        >
                          <td className="px-4 py-4">
                            <div className="font-semibold text-slate-900">
                              {booking.patientName || "Patient"}
                            </div>
                            <div className="text-xs text-slate-500">
                              Booking ID: {booking._id.slice(-6)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            {formatRequestDate(booking.createdAt)}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-red-600" />
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-2">
                                <Clock3 className="h-4 w-4 text-red-600" />
                                {formatBookingTime(booking.time)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${meta.className}`}
                            >
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-rose-200 hover:text-rose-600"
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleArchive(booking._id);
                              }}
                              disabled={
                                isMutating || booking.status === "pending"
                              }
                              title={
                                booking.status === "pending"
                                  ? "Accept or reject this request first"
                                  : "Delete from doctor dashboard"
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {!isLoading && !bookings.length ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-10 text-center text-sm text-slate-500"
                        >
                          No appointment requests found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Review Selected Request
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Accept or reject with a note, then mark checkup complete and
                send the PDF.
              </p>
            </div>

            {selectedBooking ? (
              <div className="mt-5 space-y-5">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${selectedStatusMeta.className}`}
                    >
                      {selectedStatusMeta.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {selectedBooking.patientName || "Patient"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Request received on{" "}
                    {formatRequestDate(selectedBooking.createdAt)}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Appointment: {selectedBooking.date} |{" "}
                    {formatBookingTime(selectedBooking.time)}
                  </p>
                  {selectedBooking.decisionReason ? (
                    <p className="mt-1 text-sm text-slate-600">
                      Note: {selectedBooking.decisionReason}
                    </p>
                  ) : null}
                </div>

                {selectedBooking.status === "pending" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Doctor Note
                    </label>
                    <Textarea
                      value={reviewNote}
                      onChange={(event) => setReviewNote(event.target.value)}
                      className="min-h-[160px] border-slate-200 bg-slate-50 focus-visible:ring-red-500"
                      placeholder="Write a short reason or instruction for the patient..."
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Button
                        type="button"
                        disabled={isMutating}
                        onClick={() => void handleReview("confirmed")}
                        className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        type="button"
                        disabled={isMutating}
                        onClick={() => void handleReview("cancelled")}
                        className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ) : selectedBooking.status === "confirmed" ? (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                      Checkup is accepted. Click the button below to open the
                      medicine form and send the prescription PDF.
                    </div>
                    <Button
                      type="button"
                      className="flex h-11 cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={openPrescriptionForm}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Checkup Complete
                    </Button>
                  </div>
                ) : selectedBooking.status === "completed" ? (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                      Prescription sent to patient.
                    </div>
                    {selectedBooking.prescription ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                          Medicines
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-800">
                          {(selectedBooking.prescription.medicines ?? []).map(
                            (medicine, index) => (
                              <li key={index}>
                                <span className="font-semibold">
                                  {medicine.name}
                                </span>{" "}
                                — {medicine.dosage} | {medicine.timing} |{" "}
                                {medicine.duration}
                              </li>
                            ),
                          )}
                        </ul>
                        {selectedBooking.prescription.doctorNotes ? (
                          <p className="mt-3 text-sm text-slate-700">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                              Notes:
                            </span>{" "}
                            {selectedBooking.prescription.doctorNotes}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    Rejected requests can be deleted from the table, but they
                    cannot be marked as checkup complete.
                  </div>
                )}

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  The table action only deletes the request from the doctor
                  dashboard. The patient still keeps the status history in the
                  profile section.
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                Select a request from the table to review it.
              </div>
            )}
          </aside>
        </div>
      </div>

      {isPrescriptionOpen && selectedBooking ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-[0_25px_80px_rgba(0,0,0,0.22)]">
            <div className="border-b border-slate-100 px-5 py-4 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-600">
                    Prescription
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-slate-950">
                    {selectedBooking.patientName || "Patient"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add medicines, dosage, timing, and duration. When you send
                    it, a PDF goes to the patient email.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="self-start *: rounded-xl border-slate-200"
                  onClick={closePrescriptionForm}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="grid gap-6 px-5 py-5 md:grid-cols-[1.35fr_0.65fr] md:px-6">
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Appointment Date
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {selectedBooking.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Appointment Time
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {formatBookingTime(selectedBooking.time)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {medicineRows.map((row, index) => (
                    <div
                      key={`${selectedBooking._id}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                          Medicine {index + 1}
                        </p>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 transition-colors hover:text-rose-700 disabled:opacity-40"
                          onClick={() => removeMedicineRow(index)}
                          disabled={medicineRows.length === 1}
                        >
                          <Minus className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <Input
                          value={row.name}
                          onChange={(event) =>
                            updateMedicineRow(index, "name", event.target.value)
                          }
                          className="h-11 rounded-xl border-slate-200 bg-slate-50"
                          placeholder="Medicine name"
                        />
                        <Input
                          value={row.dosage}
                          onChange={(event) =>
                            updateMedicineRow(
                              index,
                              "dosage",
                              event.target.value,
                            )
                          }
                          className="h-11 rounded-xl border-slate-200 bg-slate-50"
                          placeholder="Dosage"
                        />
                        <Input
                          value={row.timing}
                          onChange={(event) =>
                            updateMedicineRow(
                              index,
                              "timing",
                              event.target.value,
                            )
                          }
                          className="h-11 rounded-xl border-slate-200 bg-slate-50"
                          placeholder="Timing"
                        />
                        <Input
                          value={row.duration}
                          onChange={(event) =>
                            updateMedicineRow(
                              index,
                              "duration",
                              event.target.value,
                            )
                          }
                          className="h-11 rounded-xl border-slate-200 bg-slate-50"
                          placeholder="Duration"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-dashed border-slate-300 text-slate-700"
                  onClick={addMedicineRow}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medicine
                </Button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Doctor Notes
                  </label>
                  <Textarea
                    value={prescriptionNote}
                    onChange={(event) =>
                      setPrescriptionNote(event.target.value)
                    }
                    className="mt-3 min-h-[220px] border-slate-200 bg-white focus-visible:ring-red-500"
                    placeholder="Write your clinical advice, warnings, or follow-up notes..."
                  />
                </div>

                <div className="rounded-2xl bg-slate-950 p-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                    Send to Patient
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    This will mark the checkup as completed and email the PDF
                    prescription to the patient.
                  </p>
                  <Button
                    type="button"
                    className="mt-4 cursor-pointer flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                    disabled={isMutating}
                    onClick={() => void handleSendPrescription()}
                  >
                    <Send className="h-4 w-4" />
                    Send to Patient
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
