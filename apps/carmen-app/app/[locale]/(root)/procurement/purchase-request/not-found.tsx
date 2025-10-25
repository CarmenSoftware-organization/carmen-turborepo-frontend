"use client";

import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileX } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PurchaseRequestNotFound() {
  const t = useTranslations("PurchaseRequestNotFound");

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-full text-center space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-destructive/10 p-3 rounded-full">
              <FileX className="h-10 w-10 text-destructive" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t("description")}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <Button
              asChild
              size="default"
              className="gap-2"
            >
              <Link href="/procurement/purchase-request">
                <ArrowLeft className="h-4 w-4" />
                {t("backToList")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
