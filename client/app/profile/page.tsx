"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const handleLogout = () => {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("authUser");
    setUser(null);
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#eef2ff_100%)] px-4 py-24">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
            Account
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Profile
          </h1>
          <p className="text-base leading-7 text-slate-600">
            Review your account details and sign out when you are done.
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

          <CardContent className="space-y-6 p-6 md:p-8">
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
                <Button asChild className="h-11 rounded-xl bg-red-600 px-6 text-white shadow-lg shadow-red-600/20 hover:bg-red-700">
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
