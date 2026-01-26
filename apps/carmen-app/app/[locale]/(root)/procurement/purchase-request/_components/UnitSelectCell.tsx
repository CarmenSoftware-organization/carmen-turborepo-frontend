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
  fieldPrefix?: "requested" | "approved" | "foc";
}

export const UnitSelectCell = ({
  item,
  productId,
  currentUnitId,
  onItemUpdate,
  token,
  buCode,
  fieldPrefix,
}: UnitSelectCellProps) => {
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

      // If fieldPrefix is specified, only update that specific field
      if (fieldPrefix) {
        onItemUpdate(item.id, `${fieldPrefix}_unit_id`, firstUnit.id);
        onItemUpdate(item.id, `${fieldPrefix}_unit_name`, firstUnit.name);
        onItemUpdate(item.id, `${fieldPrefix}_unit_conversion_factor`, firstUnit.conversion);
      } else {
        // Auto-set all units for new items (default behavior)
        onItemUpdate(item.id, "requested_unit_id", firstUnit.id);
        onItemUpdate(item.id, "requested_unit_name", firstUnit.name);
        onItemUpdate(item.id, "requested_unit_conversion_factor", firstUnit.conversion);

        onItemUpdate(item.id, "approved_unit_id", firstUnit.id);
        onItemUpdate(item.id, "approved_unit_name", firstUnit.name);
        onItemUpdate(item.id, "approved_unit_conversion_factor", firstUnit.conversion);

        onItemUpdate(item.id, "foc_unit_id", firstUnit.id);
        onItemUpdate(item.id, "foc_unit_name", firstUnit.name);
        onItemUpdate(item.id, "foc_unit_conversion_factor", firstUnit.conversion);

        // Calculate initial base quantities
        const requestedQty = item.requested_qty || 0;
        const approvedQty = item.approved_qty || 0;
        onItemUpdate(item.id, "requested_base_qty", requestedQty * firstUnit.conversion);
        onItemUpdate(item.id, "approved_base_qty", approvedQty * firstUnit.conversion);
      }
    }
  }, [orderUnits, currentUnitId, item.id, onItemUpdate, fieldPrefix]);

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
          // If fieldPrefix is specified, only update that specific field
          if (fieldPrefix) {
            onItemUpdate(item.id, `${fieldPrefix}_unit_id`, selectedUnit.id);
            onItemUpdate(item.id, `${fieldPrefix}_unit_name`, selectedUnit.name);
            onItemUpdate(item.id, `${fieldPrefix}_unit_conversion_factor`, selectedUnit.conversion);
          } else {
            // Update all units (default behavior)
            // requested
            onItemUpdate(item.id, "requested_unit_name", selectedUnit.name);
            onItemUpdate(item.id, "requested_unit_id", selectedUnit.id);
            onItemUpdate(item.id, "requested_unit_conversion_factor", selectedUnit.conversion);

            // Recalculate base quantities with new conversion factor
            const requestedQty = item.requested_qty || 0;
            const approvedQty = item.approved_qty || 0;
            onItemUpdate(item.id, "requested_base_qty", requestedQty * selectedUnit.conversion);

            // approved
            onItemUpdate(item.id, "approved_unit_name", selectedUnit.name);
            onItemUpdate(item.id, "approved_unit_id", selectedUnit.id);
            onItemUpdate(item.id, "approved_unit_conversion_factor", selectedUnit.conversion);
            onItemUpdate(item.id, "approved_base_qty", approvedQty * selectedUnit.conversion);

            // foc
            onItemUpdate(item.id, "foc_unit_name", selectedUnit.name);
            onItemUpdate(item.id, "foc_unit_id", selectedUnit.id);
            onItemUpdate(item.id, "foc_unit_conversion_factor", selectedUnit.conversion);
          }
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
          placeholder={isLoadingOrderUnits ? <Loader className="w-3 h-3" /> : t("select_unit")}
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
