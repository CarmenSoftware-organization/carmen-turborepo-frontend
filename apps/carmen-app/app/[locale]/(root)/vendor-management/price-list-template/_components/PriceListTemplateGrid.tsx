"use client";

import { PriceListTemplateListDto } from "@/dtos/price-list-template.dto";
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

interface PriceListTemplateGridProps {
  readonly templates: PriceListTemplateListDto[];
  readonly isLoading: boolean;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function PriceListTemplateGrid({
  templates,
  isLoading,
  canUpdate = true,
  canDelete = true,
}: PriceListTemplateGridProps) {
  const tStatus = useTranslations("Status");
  const tPriceListTemplate = useTranslations("PriceListTemplate");
  const tAction = useTranslations("Action");
  const getStatusLabel = (status: string) => convertStatus(status, tStatus);

  if (isLoading) {
    return <CardLoading items={6} />;
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-1">{tPriceListTemplate("template_not_found")}</h3>
        <p className="text-sm text-muted-foreground">
          {tPriceListTemplate("no_templates_available")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {canUpdate ? (
                  <Link href={`/vendor-management/price-list-template/${template.id}`}>
                    <CardTitle className="text-base hover:text-primary transition-colors line-clamp-1">
                      {template.name}
                    </CardTitle>
                  </Link>
                ) : (
                  <CardTitle className="text-base line-clamp-1">{template.name}</CardTitle>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={template.status} className="text-xs">
                    {getStatusLabel(template.status)}
                  </Badge>
                </div>
              </div>
              {canDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => console.log(template.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {tAction("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {template.description && (
              <CardDescription className="line-clamp-2 text-xs">
                {template.description}
              </CardDescription>
            )}

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {tPriceListTemplate("valid_period")}: {template.valid_period}{" "}
                  {tPriceListTemplate("days")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {tPriceListTemplate("created")}:{" "}
                  {format(new Date(template.create_date), "dd/MM/yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {tPriceListTemplate("updated")}:{" "}
                  {format(new Date(template.update_date), "dd/MM/yyyy")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
