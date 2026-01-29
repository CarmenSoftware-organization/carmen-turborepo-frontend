"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LogIn, RefreshCw } from "lucide-react";
import { Cat408 } from "./illustrations";

interface Props {
  readonly onSignIn?: () => void;
}

export default function SessionExpired({ onSignIn }: Props) {
  const tError = useTranslations("ErrorPages");

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
      <div className="relative mb-8">
        <span className="absolute -z-10 text-[180px] font-bold text-primary/10 -top-16 left-1/2 -translate-x-1/2 select-none">
          408
        </span>
        <div className="relative z-10">
          <Cat408 />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-3">
        {tError("sessionExpired.title")}
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {tError("sessionExpired.description")}
      </p>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {tError("tryAgain")}
        </Button>
        {onSignIn && (
          <Button onClick={onSignIn} className="gap-2">
            <LogIn className="h-4 w-4" />
            {tError("sessionExpired.signIn")}
          </Button>
        )}
      </div>
    </div>
  );
}
