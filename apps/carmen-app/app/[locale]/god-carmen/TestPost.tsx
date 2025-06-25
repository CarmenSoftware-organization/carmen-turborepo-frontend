"use client";

import { useAuth } from "@/context/AuthContext";
import { useCreateCreditNote } from "@/hooks/useCreditNote";
import { postCreditNote } from "./posts";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TestPost() {
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

  return (
    <div>
      <h1>Test Post Credit Note</h1>
      <Button onClick={handleCreateCreditNote}>Create Credit Note</Button>
      <div
        className={`${
          statusSent === "Success" ? "bg-green-500" : "bg-red-500"
        } p-4 rounded-md border`}
      >
        <h1>{statusSent}</h1>
      </div>
    </div>
  );
}
