"use client";

import { useState } from "react";
import { formType } from "@/dtos/form.dto";
import PriceListView from "./PriceListView";
import PriceListForm from "./PriceListForm";
import { PricelistDetail } from "../../_schema/pl.dto";

interface DetailPriceListProps {
  readonly priceList?: PricelistDetail;
  mode: formType;
}

export default function DetailPriceList({ priceList, mode: initialMode }: DetailPriceListProps) {
  const [currentMode, setCurrentMode] = useState<formType>(initialMode);

  const handleViewMode = () => {
    setCurrentMode(formType.VIEW);
  };

  const handleEditMode = () => {
    setCurrentMode(formType.EDIT);
  };

  if (currentMode === formType.VIEW) {
    return <PriceListView initialData={priceList} onEditMode={handleEditMode} />;
  }

  return (
    <PriceListForm
      initialData={priceList}
      mode={currentMode as formType.ADD | formType.EDIT}
      onViewMode={handleViewMode}
    />
  );
}
