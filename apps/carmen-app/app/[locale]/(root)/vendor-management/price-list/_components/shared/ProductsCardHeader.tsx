"use client";

import { useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductsCardHeaderProps {
  readonly count: number;
}

export default function ProductsCardHeader({ count }: ProductsCardHeaderProps) {
  const tPriceList = useTranslations("PriceList");

  return (
    <div className="flex items-center gap-2">
      <Package className="h-4 w-4 text-muted-foreground" />
      <h3 className="text-sm font-semibold">{tPriceList("products")}</h3>
      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
        {count}
      </Badge>
    </div>
  );
}
