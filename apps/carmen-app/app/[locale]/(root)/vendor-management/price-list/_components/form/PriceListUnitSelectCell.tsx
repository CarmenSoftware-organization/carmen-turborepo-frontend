"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderUnitByProduct } from "@/hooks/use-unit";

interface UnitOderProduct {
  id: string;
  name: string;
  conversion: number;
}

interface PriceListUnitSelectCellProps {
  productId: string;
  currentUnitId: string | undefined;
  onUnitChange: (unitId: string, unitName: string) => void;
  token: string;
  buCode: string;
  disabled?: boolean;
}

export const PriceListUnitSelectCell = ({
  productId,
  currentUnitId,
  onUnitChange,
  token,
  buCode,
  disabled = false,
}: PriceListUnitSelectCellProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Unit");

  const { orderUnits, isLoading: isLoadingOrderUnits } = useOrderUnitByProduct({
    token,
    buCode,
    productId: productId,
    enabled: !!productId,
  });

  useEffect(() => {
    if (orderUnits && orderUnits.length > 0 && !currentUnitId) {
      const firstUnit = orderUnits[0];
      onUnitChange(firstUnit.id, firstUnit.name);
    }
  }, [orderUnits, currentUnitId, onUnitChange]);

  const selectValue = currentUnitId || orderUnits?.[0]?.id || "";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <Select
      value={selectValue}
      open={open}
      onOpenChange={setOpen}
      onValueChange={(value) => {
        const selectedUnit = orderUnits?.find((unit: UnitOderProduct) => unit.id === value);
        if (selectedUnit) {
          onUnitChange(selectedUnit.id, selectedUnit.name);
        }
        setOpen(false);
      }}
      disabled={disabled || !productId || isLoadingOrderUnits}
    >
      <SelectTrigger
        className="h-7 text-xs w-full justify-between gap-1"
        onKeyDown={handleKeyDown}
      >
        <SelectValue
          placeholder={isLoadingOrderUnits ? <Loader className="w-3 h-3 animate-spin" /> : t("select_unit")}
        />
      </SelectTrigger>
      <SelectContent>
        {orderUnits?.map((unit: UnitOderProduct) => (
          <SelectItem key={unit.id} value={unit.id}>
            {unit.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
