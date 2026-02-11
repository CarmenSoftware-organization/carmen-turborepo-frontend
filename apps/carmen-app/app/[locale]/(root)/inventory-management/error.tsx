"use client";

import { useEffect } from "react";
import { InternalServerError } from "@/components/error-ui";

type ErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Inventory management error:", error);
  }, [error]);

  return <InternalServerError onReset={reset} />;
}
