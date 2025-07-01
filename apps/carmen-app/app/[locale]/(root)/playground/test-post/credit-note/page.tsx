"use client";

import { useAuth } from "@/context/AuthContext";
import { useCreateCreditNote } from "@/hooks/useCreditNote";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { postCreditNote } from "./posts";
import JsonViewer from "@/components/JsonViewer";

export default function CreditNotePage() {
  const { token, tenantId } = useAuth();
  const [statusSent, setStatusSent] = useState<string>("Waiting...");

  const { mutate: createCreditNote } = useCreateCreditNote(token, tenantId);

  const handleCreateCreditNote = () => {
    setStatusSent("กำลังส่งข้อมูล...");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createCreditNote(postCreditNote as any, {
      onSuccess: (data) => {
        setStatusSent("Success");
        console.log("data", data);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
        setStatusSent(`Error: ${errorMessage}`);
      },
    });
  };

  const getStatusColor = () => {
    if (statusSent === "Success")
      return "bg-green-100 text-green-800 border-green-200";
    if (statusSent === "กำลังส่งข้อมูล...")
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (statusSent.startsWith("Error"))
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Test Credit Note</h1>
        <p className="text-gray-600">ทดสอบการสร้าง Credit Note</p>
      </div>

      {/* Action Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">การดำเนินการ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              onClick={handleCreateCreditNote}
              className="w-full sm:w-auto"
              size="lg"
            >
              สร้าง Credit Note
            </Button>

            <div className="flex-1">
              <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      statusSent === "Success"
                        ? "default"
                        : statusSent.startsWith("Error")
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    สถานะ
                  </Badge>
                  <span className="font-medium">{statusSent}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">ข้อมูล Credit Note</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonViewer data={postCreditNote} />
        </CardContent>
      </Card>
    </div>
  );
}
