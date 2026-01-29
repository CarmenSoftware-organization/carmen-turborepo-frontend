"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Cat403 } from "./illustrations";

export default function Forbidden() {
  const tError = useTranslations("ErrorPages");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
      <div className="relative mb-8">
        <span className="absolute -z-10 text-[180px] font-bold text-primary/10 -top-16 left-1/2 -translate-x-1/2 select-none">
          403
        </span>
        <div className="relative z-10">
          <Cat403 />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-3">
        {tError("forbidden.title")}
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {tError("forbidden.description")}
      </p>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {tError("goBack")}
        </Button>
        <Button onClick={() => router.push("/")} className="gap-2">
          <Home className="h-4 w-4" />
          {tError("goHome")}
        </Button>
      </div>
    </div>
  );
}
