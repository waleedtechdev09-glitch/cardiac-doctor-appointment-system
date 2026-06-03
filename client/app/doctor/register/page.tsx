"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DoctorRegister = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/doctor/login");
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-500">Redirecting to doctor login...</p>
    </div>
  );
};

export default DoctorRegister;
