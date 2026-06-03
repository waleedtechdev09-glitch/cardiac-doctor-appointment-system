"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const authRoutes = new Set(["/login", "/register", "/verify-otp", "/doctor/login", "/doctor/register", "/doctor/dashboard"]);

const ConditionalNavbar = () => {
  const pathname = usePathname();

  if (authRoutes.has(pathname)) {
    return null;
  }

  return <Navbar />;
};

export default ConditionalNavbar;
