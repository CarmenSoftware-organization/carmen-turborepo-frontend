"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { inventoryAlerts } from "./mock-data";

export default function DashboardInventoryAlerts() {
  const criticalCount = inventoryAlerts.filter((a) => a.status === "critical").length;
  const warningCount = inventoryAlerts.filter((a) => a.status === "warning").length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Inventory Alerts</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-[11px]">
            Critical ({criticalCount})
          </Badge>
          <Badge variant="warning" className="text-[11px]">
            Warning ({warningCount})
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Min Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryAlerts.map((alert) => (
              <TableRow key={alert.key}>
                <TableCell className="font-medium">{alert.product}</TableCell>
                <TableCell className="text-muted-foreground">{alert.sku}</TableCell>
                <TableCell className="font-medium">{alert.currentStock}</TableCell>
                <TableCell className="text-muted-foreground">{alert.minLevel}</TableCell>
                <TableCell>
                  <Badge
                    variant={alert.status === "critical" ? "destructive" : "warning"}
                  >
                    {alert.status === "critical" ? "● Critical" : "● Warning"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{alert.location}</TableCell>
                <TableCell className="text-right">
                  <Button variant="link" size="sm" className="text-xs px-0">
                    Create PR
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
