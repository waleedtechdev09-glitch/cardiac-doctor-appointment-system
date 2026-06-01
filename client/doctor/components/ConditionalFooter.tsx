"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

const hiddenFooterRoutes = new Set([
  "/login",
  "/register",
  "/verify-otp",
  "/booking",
  "/booking-successful",
]);

const ConditionalFooter = () => {
  const pathname = usePathname();

  if (hiddenFooterRoutes.has(pathname)) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;
