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
      className="absolute left-4 top-4 z-20  text-red-700   hover:text-red-800 md:left-6 md:top-6"
    >
      <ArrowLeft className="h-12 w-12" />
    </Button>
  );
};

export default AuthBackButton;
