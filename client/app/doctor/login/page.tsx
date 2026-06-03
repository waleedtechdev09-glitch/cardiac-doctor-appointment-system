import DoctorLoginForm from "@/components/auth/doctorLogin";
import React, { Suspense } from "react";

const DoctorLoginPage = () => {
  return (
    <Suspense fallback={null}>
      <DoctorLoginForm />
    </Suspense>
  );
};

export default DoctorLoginPage;
