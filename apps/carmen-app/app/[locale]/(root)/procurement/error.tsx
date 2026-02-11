"use client";

import { useEffect } from "react";
import { InternalServerError } from "@/components/error-ui";

type ErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Procurement error:", error);
  }, [error]);

  return <InternalServerError onReset={reset} />;
}
