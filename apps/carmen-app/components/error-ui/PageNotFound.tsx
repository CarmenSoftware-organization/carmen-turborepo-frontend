"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Cat404 } from "./illustrations";

interface Props {
  readonly backUrl?: string;
}

export default function PageNotFound({ backUrl = "/" }: Props) {
  const tNotFound = useTranslations("NotFound");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
      <div className="relative mb-8">
        <span className="absolute -z-10 text-[180px] font-bold text-primary/10 -top-16 left-1/2 -translate-x-1/2 select-none">
          404
        </span>
        <div className="relative z-10">
          <Cat404 />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-3">{tNotFound("title")}</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">{tNotFound("description")}</p>

      <div className="flex items-center gap-4">
        <Button onClick={() => router.push(backUrl)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {tNotFound("goBack")}
        </Button>
        <Button onClick={() => router.push("/")} className="gap-2">
          <Home className="h-4 w-4" />
          {tNotFound("goHome")}
        </Button>
      </div>
    </div>
  );
}
