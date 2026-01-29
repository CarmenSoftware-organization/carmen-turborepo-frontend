"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Cat401 } from "./illustrations";

interface Props {
  readonly onSignIn?: () => void;
}

export default function Unauthorized({ onSignIn }: Props) {
  const tError = useTranslations("ErrorPages");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
      <div className="relative mb-8">
        <span className="absolute -z-10 text-[180px] font-bold text-primary/10 -top-16 left-1/2 -translate-x-1/2 select-none">
          401
        </span>
        <div className="relative z-10">
          <Cat401 />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-3">
        {tError("unauthorized.title")}
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {tError("unauthorized.description")}
      </p>
      {onSignIn && (
        <Button onClick={onSignIn} className="gap-2">
          <LogIn className="h-4 w-4" />
          {tError("unauthorized.signIn")}
        </Button>
      )}
    </div>
  );
}
