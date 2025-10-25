"use client";

import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon & Number */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
              <FileQuestion className="h-32 w-32 text-primary relative" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-8xl font-bold text-primary tracking-tighter">
              404
            </h1>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-foreground">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <Button
            asChild
            size="lg"
            className="gap-2 min-w-[160px]"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              {t("goHome")}
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="gap-2 min-w-[160px]"
            onClick={() => globalThis.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("goBack")}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {t("supportText")}{" "}
            <Link
              href="/help-support"
              className="text-primary hover:underline font-medium"
            >
              {t("support")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
