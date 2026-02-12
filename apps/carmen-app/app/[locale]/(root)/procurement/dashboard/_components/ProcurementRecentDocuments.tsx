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
import { recentPurchaseRequests, recentPurchaseOrders } from "./mock-data";

const prStatusVariant: Record<string, string> = {
  pending: "warning",
  approved: "active",
  rejected: "destructive",
};

const poStatusVariant: Record<string, string> = {
  open: "work_in_process",
  completed: "active",
  partial: "warning",
};

function RecentPRTable() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Recent Purchase Requests</CardTitle>
        <Button variant="link" size="sm" className="text-xs px-0">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PR No.</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPurchaseRequests.map((pr) => (
              <TableRow key={pr.id}>
                <TableCell className="font-medium text-primary">{pr.id}</TableCell>
                <TableCell>{pr.title}</TableCell>
                <TableCell className="text-muted-foreground">{pr.requester}</TableCell>
                <TableCell className="text-right font-medium">
                  ฿{pr.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={prStatusVariant[pr.status]}>
                    {pr.status.charAt(0).toUpperCase() + pr.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{pr.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RecentPOTable() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Recent Purchase Orders</CardTitle>
        <Button variant="link" size="sm" className="text-xs px-0">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO No.</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPurchaseOrders.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium text-primary">{po.id}</TableCell>
                <TableCell>{po.vendor}</TableCell>
                <TableCell className="text-right font-medium">
                  ฿{po.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {po.items}
                </TableCell>
                <TableCell>
                  <Badge variant={poStatusVariant[po.status]}>
                    {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{po.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function ProcurementRecentDocuments() {
  return (
    <div className="space-y-3">
      <RecentPRTable />
      <RecentPOTable />
    </div>
  );
}
