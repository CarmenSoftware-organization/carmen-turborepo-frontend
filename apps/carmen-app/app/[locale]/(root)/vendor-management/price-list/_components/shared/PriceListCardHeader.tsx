"use client";

import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format/date";

interface PriceListCardHeaderProps {
  readonly name?: string;
  readonly no?: string;
  readonly lastUpdate?: string;
  readonly status?: string;
  readonly dateFormat?: string | null;
  readonly showStatus?: boolean;
}

export default function PriceListCardHeader({
  name,
  no,
  lastUpdate,
  status,
  dateFormat,
  showStatus = true,
}: PriceListCardHeaderProps) {
  const tCommon = useTranslations("Common");
  const tStatus = useTranslations("Status");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "submit":
        return "warning";
      case "inactive":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return tStatus("active");
      case "draft":
        return tStatus("draft");
      case "submit":
        return tStatus("submit");
      case "inactive":
        return tStatus("inactive");
      default:
        return status;
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-400 animate-pulse";
      case "inactive":
        return "bg-red-400";
      case "submit":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold leading-none tracking-tight">{name || no}</h2>
          <div className="flex items-center gap-2 mt-1.5">
            {no && (
              <Badge variant="outline" className="font-mono text-xs">
                {no}
              </Badge>
            )}
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                {tCommon("last_updated")}: {formatDate(lastUpdate, dateFormat || "dd/MM/yyyy HH:mm")}
              </span>
            )}
          </div>
        </div>
      </div>
      {showStatus && status && (
        <Badge variant={getStatusVariant(status)} className="h-6 gap-1.5">
          <span className={`h-2 w-2 rounded-full ${getStatusDotColor(status)}`} />
          {getStatusLabel(status)}
        </Badge>
      )}
    </div>
  );
}
