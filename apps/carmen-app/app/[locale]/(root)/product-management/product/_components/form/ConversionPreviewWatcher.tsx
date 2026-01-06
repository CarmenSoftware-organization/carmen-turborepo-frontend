import { FC } from "react";
import { Control, useWatch } from "react-hook-form";
import { ProductFormValues } from "@/dtos/product.dto";
import { UnitRow } from "@/dtos/unit.dto";
import ConversionPreview from "@/components/ConversionPreview";

type UnitType = "order" | "ingredient";

interface ConversionPreviewWatcherProps {
  control: Control<ProductFormValues>;
  unit: UnitRow;
  getUnitName: (unitId: string) => string;
  unitType: UnitType;
}

const ConversionPreviewWatcher: FC<ConversionPreviewWatcherProps> = ({
  control,
  unit,
  getUnitName,
  unitType,
}) => {
  const fieldPrefix = unitType === "order" ? "order_units" : "ingredient_units";

  const fromUnitId = useWatch({
    control,
    name: unit.isNew
      ? (`${fieldPrefix}.add.${unit.fieldIndex}.from_unit_id` as `order_units.add.${number}.from_unit_id`)
      : (`${fieldPrefix}.data.${unit.dataIndex}.from_unit_id` as `order_units.data.${number}.from_unit_id`),
    defaultValue: unit.from_unit_id,
  });

  const toUnitId = useWatch({
    control,
    name: unit.isNew
      ? (`${fieldPrefix}.add.${unit.fieldIndex}.to_unit_id` as `order_units.add.${number}.to_unit_id`)
      : (`${fieldPrefix}.data.${unit.dataIndex}.to_unit_id` as `order_units.data.${number}.to_unit_id`),
    defaultValue: unit.to_unit_id,
  });

  const fromUnitQty = useWatch({
    control,
    name: unit.isNew
      ? (`${fieldPrefix}.add.${unit.fieldIndex}.from_unit_qty` as `order_units.add.${number}.from_unit_qty`)
      : (`${fieldPrefix}.data.${unit.dataIndex}.from_unit_qty` as `order_units.data.${number}.from_unit_qty`),
    defaultValue: unit.from_unit_qty,
  });

  const toUnitQty = useWatch({
    control,
    name: unit.isNew
      ? (`${fieldPrefix}.add.${unit.fieldIndex}.to_unit_qty` as `order_units.add.${number}.to_unit_qty`)
      : (`${fieldPrefix}.data.${unit.dataIndex}.to_unit_qty` as `order_units.data.${number}.to_unit_qty`),
    defaultValue: unit.to_unit_qty || 1,
  });

  if (fromUnitId && toUnitId) {
    return (
      <ConversionPreview
        fromUnitId={fromUnitId as string}
        toUnitId={toUnitId as string}
        fromUnitQty={fromUnitQty as number}
        toUnitQty={toUnitQty as number}
        getUnitName={getUnitName}
      />
    );
  }
  return null;
};

export default ConversionPreviewWatcher;
