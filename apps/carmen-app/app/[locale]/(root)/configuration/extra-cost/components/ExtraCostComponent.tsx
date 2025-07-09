"use client";

import { useAuth } from "@/context/AuthContext";
import { useExtraCostTypeQuery } from "@/hooks/useExtraCostType";
import { ExtraCostTypeDto } from "@/dtos/extra-cost-type.dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  Plus,
  FileText,
  SquarePen,
  Trash2,
} from "lucide-react";

export function ExtraCostComponent() {
  const { token, tenantId } = useAuth();

  const { extraCostTypes } = useExtraCostTypeQuery(token, tenantId);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Extra Cost Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage extra cost types and types
            </p>
          </div>
        </div>
        <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extraCostTypes?.data?.map((extraCostType: ExtraCostTypeDto) => (
              <Card
                key={extraCostType.id}
                className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                      {extraCostType.name}
                    </CardTitle>
                    <Badge
                      variant={
                        extraCostType.is_active ? "active" : "inactive"
                      }
                    >
                      {extraCostType.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {extraCostType.description || "No description available"}
                    </p>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button variant="ghost" size="sm">
                      <SquarePen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
