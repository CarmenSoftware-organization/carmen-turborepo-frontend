"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PriceListBreadcrumbProps {
  readonly currentPage: string;
}

export default function PriceListBreadcrumb({ currentPage }: PriceListBreadcrumbProps) {
  const tPriceList = useTranslations("PriceList");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/vendor-management/price-list"
              className="hover:text-primary transition-colors"
            >
              {tPriceList("title")}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold">{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
