"use client";

import { RfpDto } from "@/dtos/rfp.dto";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { Link } from "@/lib/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { convertStatus } from "@/utils/status";
import CardLoading from "@/components/loading/CardLoading";

interface RfpGridProps {
  readonly rfps: RfpDto[];
  readonly isLoading: boolean;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function RfpGrid({
  rfps,
  isLoading,
  canUpdate = true,
  canDelete = true,
}: RfpGridProps) {
  const tStatus = useTranslations("Status");
  const tRfp = useTranslations("RFP");
  const getStatusLabel = (status: string) => convertStatus(status, tStatus);

  if (isLoading) {
    return <CardLoading items={6} />;
  }

  if (rfps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-1">{tRfp("no_rfps_found")}</h3>
        <p className="text-sm text-muted-foreground">{tRfp("get_started")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rfps.map((rfp) => (
        <Card key={rfp.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {canUpdate ? (
                  <Link href={`/vendor-management/request-price-list/${rfp.id}`}>
                    <CardTitle className="text-base hover:text-primary transition-colors line-clamp-1">
                      {rfp.name}
                    </CardTitle>
                  </Link>
                ) : (
                  <CardTitle className="text-base line-clamp-1">{rfp.name}</CardTitle>
                )}
                {/* <div className="flex items-center gap-2 mt-2">
                  <Badge variant={rfp.status as any} className="text-xs">
                    {getStatusLabel(rfp.status)}
                  </Badge>
                </div> */}
              </div>
              {canDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">{tRfp("more_options")}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => console.log(rfp.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {tRfp("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {rfp.custom_message && (
              <CardDescription className="line-clamp-2 text-xs">
                {rfp.custom_message}
              </CardDescription>
            )}

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {tRfp("valid")}:{" "}
                  {Math.ceil(
                    (new Date(rfp.end_date).getTime() - new Date(rfp.start_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  {tRfp("days")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {tRfp("created")}: {format(new Date(rfp.created_at), "dd/MM/yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {tRfp("updated")}: {format(new Date(rfp.updated_at), "dd/MM/yyyy")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
