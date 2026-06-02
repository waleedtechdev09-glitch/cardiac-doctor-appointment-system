import LoginForm from "@/components/auth/login";
import React, { Suspense } from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
