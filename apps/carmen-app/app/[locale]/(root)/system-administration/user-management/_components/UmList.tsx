"use client";

import { mockUsers } from "@/mock-data/user-management";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash, SquarePen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  name: string;
  email: string;
  businessUnit: string;
  department: string;
  status: boolean;
  lastLogin: string;
}

export default function UmList() {
  const t = useTranslations("TableHeader");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === mockUsers.length) {
      // If all items are selected, unselect all
      setSelectedItems([]);
    } else {
      // Otherwise, select all items
      const allIds = mockUsers.map((user) => user.id ?? "").filter(Boolean);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected = mockUsers.length > 0 && selectedItems.length === mockUsers.length;

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-10 text-center">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all purchase requests"
                />
              </TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("businessUnit")}</TableHead>
              <TableHead>{t("department")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("lastLogin")}</TableHead>
              <TableHead className="w-[100px] text-right">{t("action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="text-center w-10">
                  <Checkbox
                    id={`checkbox-${user.id}`}
                    checked={selectedItems.includes(user.id ?? "")}
                    onCheckedChange={() => handleSelectItem(user.id ?? "")}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.businessUnit}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <Badge variant={user.status ? "active" : "inactive"}>
                    {user.status ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell className="flex items-center justify-end">
                  <Button variant="ghost" size={"sm"} className="w-7 h-7">
                    <SquarePen />
                  </Button>
                  <Button
                    variant="ghost"
                    size={"sm"}
                    className="w-7 h-7 text-destructive hover:text-destructive/80"
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {mockUsers.map((user: User) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{user.name}</span>
                <Badge variant={user.status ? "default" : "destructive"}>
                  {user.status ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("businessUnit")}</span>
                  <span className="text-sm font-medium">{user.businessUnit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("department")}</span>
                  <span className="text-sm font-medium">{user.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("lastLogin")}</span>
                  <span className="text-sm font-medium">{user.lastLogin}</span>
                </div>
                <div className="flex items-center justify-end">
                  <Button variant="ghost" size={"sm"}>
                    <SquarePen />
                  </Button>
                  <Button variant="ghost" size={"sm"} className="hover:text-red-500">
                    <Trash />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
