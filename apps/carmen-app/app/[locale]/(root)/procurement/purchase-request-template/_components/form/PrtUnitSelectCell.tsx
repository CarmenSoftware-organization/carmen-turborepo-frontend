import { PurchaseRequestTemplateDetailDto } from "@/dtos/pr-template.dto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useOrderUnitByProduct } from "@/hooks/use-unit";

interface UnitOderProduct {
  id: string;
  name: string;
  conversion: number;
}

interface Props {
  rowIndex: number;
  productId: string;
  currentUnitId: string;
  requestedQty: number;
  updateItemField: (rowIndex: number, updates: Partial<PurchaseRequestTemplateDetailDto>) => void;
  token: string;
  buCode: string;
}

export default function PrtUnitSelectCell({
  rowIndex,
  productId,
  currentUnitId,
  requestedQty,
  updateItemField,
  token,
  buCode,
}: Props) {
  const [open, setOpen] = useState(false);
  const tUnit = useTranslations("Unit");

  const { data: orderUnitsData, isLoading: isLoadingOrderUnits } = useOrderUnitByProduct({
    token,
    buCode,
    productId,
    enabled: !!productId,
  });

  useEffect(() => {
    if (orderUnitsData && orderUnitsData.length > 0 && !currentUnitId) {
      const firstUnit = orderUnitsData[0];
      const baseQty = requestedQty * firstUnit.conversion;
      updateItemField(rowIndex, {
        requested_unit_id: firstUnit.id,
        requested_unit_name: firstUnit.name,
        requested_unit_conversion_factor: String(firstUnit.conversion),
        requested_base_qty: String(baseQty),
        foc_unit_id: firstUnit.id,
        foc_unit_name: firstUnit.name,
        foc_unit_conversion_factor: String(firstUnit.conversion),
      });
    }
  }, [orderUnitsData, currentUnitId, rowIndex, requestedQty, updateItemField]);

  const selectValue = currentUnitId || orderUnitsData?.[0]?.id || "";

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
        const selectedUnit = orderUnitsData?.find((unit: UnitOderProduct) => unit.id === value);
        if (selectedUnit) {
          const baseQty = requestedQty * selectedUnit.conversion;
          updateItemField(rowIndex, {
            requested_unit_id: selectedUnit.id,
            requested_unit_name: selectedUnit.name,
            requested_unit_conversion_factor: String(selectedUnit.conversion),
            requested_base_qty: String(baseQty),
            foc_unit_id: selectedUnit.id,
            foc_unit_name: selectedUnit.name,
            foc_unit_conversion_factor: String(selectedUnit.conversion),
          });
        }
        setOpen(false);
      }}
      disabled={!productId || isLoadingOrderUnits}
    >
      <SelectTrigger
        className="h-7 text-xs w-24 justify-end [&>span]:text-right gap-1"
        onKeyDown={handleKeyDown}
      >
        <SelectValue
          placeholder={
            isLoadingOrderUnits ? <Loader className="w-3 h-3 animate-spin" /> : tUnit("select_unit")
          }
        />
      </SelectTrigger>
      <SelectContent>
        {orderUnitsData?.map((unit: UnitOderProduct) => (
          <SelectItem key={unit.id} value={unit.id}>
            {unit.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
