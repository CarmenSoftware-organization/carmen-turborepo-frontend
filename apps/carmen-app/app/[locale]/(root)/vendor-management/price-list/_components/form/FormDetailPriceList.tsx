"use client";

import { formType } from "@/dtos/form.dto";
import PriceListForm from "./PriceListForm";
import { PricelistDetail } from "../../_schema/pl.dto";

interface DetailPriceListProps {
  readonly priceList?: PricelistDetail;
  mode: formType;
}

export default function DetailPriceList({ priceList, mode }: DetailPriceListProps) {
  return <PriceListForm initialData={priceList} mode={mode} />;
}
