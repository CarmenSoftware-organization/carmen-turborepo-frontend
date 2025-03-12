import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n";
import { ArrowLeft } from "lucide-react";

export default function Backlink({ href }: { href: string }) {
  if (!href) {
    href = "/";
  }
  return (
    <Button variant="ghost" size="icon" asChild className="mr-1">
      <Link href={href}>
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </Button>
  );
}
