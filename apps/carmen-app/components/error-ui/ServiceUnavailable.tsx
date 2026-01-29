"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Cat503 } from "./illustrations";

export default function ServiceUnavailable() {
  const tError = useTranslations("ErrorPages");

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
      <div className="relative mb-8">
        <span className="absolute -z-10 text-[180px] font-bold text-primary/10 -top-16 left-1/2 -translate-x-1/2 select-none">
          503
        </span>
        <div className="relative z-10">
          <Cat503 />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-3">
        {tError("serviceUnavailable.title")}
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {tError("serviceUnavailable.description")}
      </p>
      <Button onClick={handleRefresh} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        {tError("tryAgain")}
      </Button>
    </div>
  );
}
