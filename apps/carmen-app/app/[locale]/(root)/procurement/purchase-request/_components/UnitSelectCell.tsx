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
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";

interface UnitOderProduct {
  id: string;
  name: string;
  conversion: number;
}

interface UnitSelectCellProps {
  item: PurchaseRequestDetail;
  productId: string;
  currentUnitId: string | undefined;
  onItemUpdate: (itemId: string, fieldName: string, value: unknown) => void;
  token: string;
  buCode: string;
}

export const UnitSelectCell = ({
  item,
  productId,
  currentUnitId,
  onItemUpdate,
  token,
  buCode,
}: UnitSelectCellProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Unit");

  const { data: orderUnitsData, isLoading: isLoadingOrderUnits } = useOrderUnitByProduct({
    token,
    buCode,
    productId: productId,
    enabled: !!productId,
  });

  console.log(orderUnitsData);

  useEffect(() => {
    if (orderUnitsData && orderUnitsData.length > 0 && !currentUnitId) {
      const firstUnit = orderUnitsData[0];
      onItemUpdate(item.id, "requested_unit_id", firstUnit.id);
      onItemUpdate(item.id, "requested_unit_name", firstUnit.name);
    }
  }, [orderUnitsData, currentUnitId, item.id, onItemUpdate]);

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
          // requested
          onItemUpdate(item.id, "requested_unit_name", selectedUnit.name);
          onItemUpdate(item.id, "requested_unit_id", selectedUnit.id);
          onItemUpdate(item.id, "requested_unit_conversion_factor", selectedUnit.conversion);
          onItemUpdate(item.id, "requested_base_qty", selectedUnit.conversion * item.requested_qty);
          // approved
          onItemUpdate(item.id, "approved_unit_name", selectedUnit.name);
          onItemUpdate(item.id, "approved_unit_id", selectedUnit.id);
          onItemUpdate(item.id, "approved_unit_conversion_factor", selectedUnit.conversion);
          onItemUpdate(item.id, "approved_base_qty", selectedUnit.conversion * item.requested_qty);
          // foc
          onItemUpdate(item.id, "foc_unit_name", selectedUnit.name);
          onItemUpdate(item.id, "foc_unit_id", selectedUnit.id);
          onItemUpdate(item.id, "foc_unit_conversion_factor", selectedUnit.conversion);
          onItemUpdate(item.id, "foc_base_qty", selectedUnit.conversion * item.requested_qty);
        }
        setOpen(false);
      }}
      disabled={!productId || isLoadingOrderUnits}
    >
      <SelectTrigger
        className="h-7 text-xs min-w-24 justify-end [&>span]:text-right gap-1"
        onKeyDown={handleKeyDown}
      >
        <SelectValue
          placeholder={isLoadingOrderUnits ? <Loader className="w-3 h-3" /> : t("select_unit")}
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
};
