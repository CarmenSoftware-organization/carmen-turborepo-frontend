"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusColorTestPost } from "../payload";
import JsonViewer from "@/components/JsonViewer";
import { postGoodReceiveNote } from "../payload";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useGrnMutation } from "@/hooks/useGrn";

export default function GoodReceiveNotePage() {
  const { token, buCode } = useAuth();
  const [statusSent, setStatusSent] = useState<string>("Waiting...");

  const { mutate: createGoodReceiveNote } = useGrnMutation(token, buCode);

  const handleCreateGoodReceiveNote = () => {
    setStatusSent("กำลังส่งข้อมูล...");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createGoodReceiveNote(postGoodReceiveNote as any, {
      onSuccess: () => {
        setStatusSent("Success");
      },
    });
  };
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Test Good Receive Note</h1>
        <p className="text-gray-600">ทดสอบการสร้าง Good Receive Note</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">การดำเนินการ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              onClick={handleCreateGoodReceiveNote}
              className="w-full sm:w-auto"
              size="lg"
            >
              สร้าง Good Receive Note
            </Button>

            <div className="flex-1">
              <div
                className={`p-3 rounded-lg border ${getStatusColorTestPost(
                  statusSent
                )}`}
              >
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
          <CardTitle className="text-xl">ข้อมูล Good Receive Note</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonViewer data={postGoodReceiveNote} />
        </CardContent>
      </Card>
    </div>
  )
}