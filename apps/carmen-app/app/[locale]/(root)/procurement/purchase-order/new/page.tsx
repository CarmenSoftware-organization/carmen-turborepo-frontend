"use client";

import { useSearchParams } from "next/navigation";
import BlankPo from "./_components/BlankPo";
import FromPr from "./_components/FromPr";

export default function NewPurchaseOrderPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return (
    <div>
      {type === "blank" && <BlankPo />}
      {type === "pr" && <FromPr />}
    </div>
  );
}
