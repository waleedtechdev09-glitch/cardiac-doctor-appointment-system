const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/auth";

type AuthPayload = Record<string, string>;

async function requestAuth<T>(path: string, payload: AuthPayload): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}

export const authApi = {
  register: (payload: {
    username: string;
    email: string;
    password: string;
  }) => requestAuth<{ message: string }>(`/register`, payload),
  registerDoctor: (payload: {
    username: string;
    email: string;
    password: string;
  }) => requestAuth<{ message: string }>(`/doctor/register`, payload),
  login: (payload: { email: string; password: string }) =>
    requestAuth<{ message: string }>(`/login`, payload),
  loginDoctor: (payload: { email: string; password: string }) =>
    requestAuth<{ message: string }>(`/doctor/login`, payload),
  verifyOtp: (payload: { email: string; otp: string }) =>
    requestAuth<{
      message: string;
      token: string;
      user: { id: string; username: string; email: string; role: string };
    }>(`/verify-otp`, payload),
};
