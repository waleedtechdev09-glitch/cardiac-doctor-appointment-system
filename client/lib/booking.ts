const DEFAULT_BOOKING_API_URL = "http://localhost:4000/api/booking";

const resolveBookingApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!configuredUrl) {
    return DEFAULT_BOOKING_API_URL;
  }

  const normalizedUrl = configuredUrl.replace(/\/+$/, "");

  if (normalizedUrl.endsWith("/api/auth")) {
    return normalizedUrl.replace(/\/api\/auth$/, "/api/booking");
  }

  if (normalizedUrl.endsWith("/api")) {
    return `${normalizedUrl}/booking`;
  }

  if (normalizedUrl.endsWith("/booking")) {
    return normalizedUrl;
  }

  if (normalizedUrl.includes("/api/")) {
    return normalizedUrl.replace(/\/api\/[^/]+$/, "/api/booking");
  }

  return `${normalizedUrl}/api/booking`;
};

const API_BASE_URL = resolveBookingApiBaseUrl();

export type CreateBookingPayload = {
  date: string;
  time: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  symptoms: string;
  bloodPressure?: string;
  isEmergency?: boolean;
};

type BookingApiResponse = {
  success?: boolean;
  message?: string;
};

export type BookingRecord = {
  _id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
  patientName?: string;
  decisionReason?: string;
  doctorArchived?: boolean;
  prescription?: {
    medicines: Array<{
      name: string;
      dosage: string;
      timing: string;
      duration: string;
    }>;
    doctorNotes?: string;
    prescribedAt?: string;
  };
};

export type PrescriptionMedicine = {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
};

async function requestBooking<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    payload?: unknown;
  } = {},
): Promise<T> {
  if (typeof window === "undefined") {
    throw new Error("Booking requests can only be made in the browser.");
  }

  const token = window.localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Please sign in before booking an appointment.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (options.method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.payload ? JSON.stringify(options.payload) : undefined,
  });

  const data = (await response.json().catch(() => ({}))) as BookingApiResponse;

  if (!response.ok) {
    throw new Error(data.message || "Booking request failed.");
  }

  return data as T;
}

export const bookingApi = {
  createBooking: (payload: CreateBookingPayload) =>
    requestBooking<{ success: boolean; message: string }>("/create-booking", {
      method: "POST",
      payload,
    }),
  getMyBookings: () =>
    requestBooking<{ success: boolean; bookings: BookingRecord[]; count: number }>(
      "/my-bookings",
    ),
  getDoctorBookings: () =>
    requestBooking<{ success: boolean; bookings: BookingRecord[]; count: number }>(
      "/admin",
    ),
  approveBooking: (id: string, reason: string) =>
    requestBooking<{ success: boolean; message: string }>(`/approve/${id}`, {
      method: "PATCH",
      payload: { reason },
    }),
  rejectBooking: (id: string, reason: string) =>
    requestBooking<{ success: boolean; message: string }>(`/reject/${id}`, {
      method: "PATCH",
      payload: { reason },
    }),
  archiveBooking: (id: string) =>
    requestBooking<{ success: boolean; message: string }>(`/archive/${id}`, {
      method: "DELETE",
    }),
  addPrescription: (payload: {
    bookingId: string;
    medicines: PrescriptionMedicine[];
    doctorNotes: string;
  }) =>
    requestBooking<{ success: boolean; message: string }>("/add-prescription", {
      method: "POST",
      payload,
    }),
};
