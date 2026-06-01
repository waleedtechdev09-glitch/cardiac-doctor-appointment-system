"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const AuthBackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleBack}
      aria-label="Go back"
      className="absolute left-4 top-4 z-20 rounded-full bg-white/90 text-slate-700 shadow-lg shadow-slate-200/60 backdrop-blur hover:bg-white hover:text-slate-950 md:left-6 md:top-6"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};

export default AuthBackButton;
