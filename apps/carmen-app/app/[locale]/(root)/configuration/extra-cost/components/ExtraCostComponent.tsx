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
  Settings,
  FileText,
  CheckCircle,
  XCircle,
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary/80 font-medium">
                  Total Types
                </p>
                <p className="text-2xl font-bold text-primary">
                  {extraCostTypes?.data?.length || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/50 to-secondary border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground/80 font-medium">
                  Active
                </p>
                <p className="text-2xl font-bold text-secondary-foreground">
                  {extraCostTypes?.data?.filter(
                    (item: ExtraCostTypeDto) => item.is_active
                  )?.length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-secondary-foreground/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-destructive/80 font-medium">
                  Inactive
                </p>
                <p className="text-2xl font-bold text-destructive">
                  {extraCostTypes?.data?.filter(
                    (item: ExtraCostTypeDto) => !item.is_active
                  )?.length || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-destructive/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/50 to-accent border-accent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-foreground/80 font-medium">
                  Categories
                </p>
                <p className="text-2xl font-bold text-accent-foreground">
                  {new Set(
                    extraCostTypes?.data?.map(
                      (item: ExtraCostTypeDto) => item.name.split(" ")[0]
                    )
                  )?.size || 0}
                </p>
              </div>
              <Settings className="h-8 w-8 text-accent-foreground/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Extra Cost Types
          </h2>
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
