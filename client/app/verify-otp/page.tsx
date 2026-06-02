import VerifyOtpForm from "@/components/auth/verifyOtp";
import React, { Suspense } from "react";

const VerifyOtp = () => {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
};

export default VerifyOtp;
