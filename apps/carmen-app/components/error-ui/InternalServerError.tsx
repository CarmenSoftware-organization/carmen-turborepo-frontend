"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Cat500 } from "./illustrations";

interface Props {
  readonly onReset?: () => void;
}

export default function InternalServerError({ onReset }: Props) {
  const tCommon = useTranslations("Common");

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-8">
        <span className="absolute -z-10 text-[180px] font-bold text-primary/10 -top-16 left-1/2 -translate-x-1/2 select-none">
          500
        </span>
        <div className="relative z-10">
          <Cat500 />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-3">{tCommon("error")}</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">{tCommon("errorLoadingData")}</p>
      {onReset && (
        <Button onClick={onReset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {tCommon("retry")}
        </Button>
      )}
    </div>
  );
}
