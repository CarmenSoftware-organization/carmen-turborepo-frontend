import { useMemo } from "react";
import { Control } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProductFormValues } from "@/dtos/product.dto";
import { UnitDto, UnitRow } from "@/dtos/unit.dto";
import { formType } from "@/dtos/form.dto";
import UnitCombobox from "@/components/lookup/UnitCombobox";
import NumberInput from "@/components/form-custom/NumberInput";
import ConversionPreviewWatcher from "../_components/form/ConversionPreviewWatcher";

type UnitType = "order" | "ingredient";

interface UseUnitColumnsProps {
  unitType: UnitType;
  control: Control<ProductFormValues>;
  currentMode: formType;
  getUnitName: (unitId: string) => string;
  getAvailableUnits: (currentUnitId?: string) => UnitDto[];
  handleDefaultChange: (index: number, isDataField: boolean, checked: boolean) => void;
  handleFieldChange: (
    dataIndex: number,
    field: "from_unit_id" | "from_unit_qty" | "to_unit_id" | "to_unit_qty",
    value: string | number
  ) => void;
  handleRemoveUnit: (unitId: string) => void;
  removeUnit: (index: number) => void;
  inventoryUnitName: string;
  translations: {
    orderUnit: string;
    ingredientUnit: string;
    inventoryUnit: string;
    toInventoryUnit: string;
    default: string;
    conversion: string;
    action: string;
    delete: string;
    cancel: string;
    deleteDescription: string;
  };
}

export const useUnitColumns = ({
  unitType,
  control,
  currentMode,
  getUnitName,
  getAvailableUnits,
  handleDefaultChange,
  handleFieldChange,
  handleRemoveUnit,
  removeUnit,
  inventoryUnitName,
  translations,
}: UseUnitColumnsProps) => {
  const isOrderUnit = unitType === "order";
  const fieldPrefix = isOrderUnit ? "order_units" : "ingredient_units";

  const columns = useMemo<ColumnDef<UnitRow>[]>(
    () => [
      {
        accessorKey: "from_unit",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={isOrderUnit ? translations.orderUnit : translations.inventoryUnit}
          />
        ),
        cell: ({ row }) => {
          const unit = row.original;

          if (unit.isNew) {
            if (isOrderUnit) {
              const availableUnits = getAvailableUnits(unit.from_unit_id);
              return (
                <div className="flex items-center gap-2">
                  <Input
                    value={unit.from_unit_qty}
                    min={0}
                    step={0}
                    disabled
                    className="w-16 h-7 text-right bg-muted cursor-not-allowed"
                  />
                  <FormField
                    control={control}
                    name={
                      `${fieldPrefix}.add.${unit.fieldIndex!}.from_unit_id` as `order_units.add.${number}.from_unit_id`
                    }
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <UnitCombobox
                            value={field.value}
                            onChange={field.onChange}
                            availableUnits={availableUnits}
                            disabled={currentMode === formType.VIEW}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            }
            return (
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={
                    `${fieldPrefix}.add.${unit.fieldIndex!}.from_unit_qty` as `ingredient_units.add.${number}.from_unit_qty`
                  }
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <NumberInput
                          value={field.value ?? 0}
                          onChange={field.onChange}
                          min={0}
                          step={0}
                          disabled
                          classNames="w-16 h-7 bg-muted cursor-not-allowed"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={
                    `${fieldPrefix}.add.${unit.fieldIndex!}.from_unit_id` as `ingredient_units.add.${number}.from_unit_id`
                  }
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Input
                          className="w-16 h-7 bg-muted cursor-not-allowed text-xs"
                          value={getUnitName(field.value)}
                          disabled
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            );
          }

          if (currentMode === formType.EDIT && unit.dataIndex !== undefined) {
            if (isOrderUnit) {
              const availableUnits = getAvailableUnits(unit.from_unit_id);
              return (
                <div className="flex items-center gap-2">
                  <FormField
                    control={control}
                    name={
                      `${fieldPrefix}.data.${unit.dataIndex}.from_unit_qty` as `order_units.data.${number}.from_unit_qty`
                    }
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <NumberInput
                            value={field.value ?? 0}
                            onChange={(value) => {
                              field.onChange(value);
                              handleFieldChange(unit.dataIndex!, "from_unit_qty", value);
                            }}
                            min={0}
                            step={0}
                            disabled
                            classNames="w-16 h-7 bg-muted cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={
                      `${fieldPrefix}.data.${unit.dataIndex}.from_unit_id` as `order_units.data.${number}.from_unit_id`
                    }
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <UnitCombobox
                            value={field.value ?? ""}
                            onChange={(value) => {
                              field.onChange(value);
                              handleFieldChange(unit.dataIndex!, "from_unit_id", value);
                            }}
                            availableUnits={availableUnits}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            }
            return (
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={
                    `${fieldPrefix}.data.${unit.dataIndex}.from_unit_qty` as `ingredient_units.data.${number}.from_unit_qty`
                  }
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <NumberInput
                          value={field.value ?? 0}
                          onChange={(value) => {
                            field.onChange(value);
                            handleFieldChange(unit.dataIndex!, "from_unit_qty", value);
                          }}
                          min={0}
                          step={0}
                          disabled
                          classNames="w-16 h-7 bg-muted cursor-not-allowed"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Input
                  className="w-16 h-7 bg-muted cursor-not-allowed text-xs"
                  value={inventoryUnitName}
                  disabled
                  readOnly
                />
              </div>
            );
          }

          return (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium">{unit.from_unit_qty}</span>
              <span>{unit.from_unit_name || getUnitName(unit.from_unit_id)}</span>
            </div>
          );
        },
        enableSorting: false,
        size: 180,
      },
      {
        accessorKey: "to_unit",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={isOrderUnit ? translations.toInventoryUnit : translations.ingredientUnit}
          />
        ),
        cell: ({ row }) => {
          const unit = row.original;

          if (unit.isNew) {
            if (isOrderUnit) {
              return (
                <div className="flex items-center gap-2">
                  <FormField
                    control={control}
                    name={
                      `${fieldPrefix}.add.${unit.fieldIndex!}.to_unit_qty` as `order_units.add.${number}.to_unit_qty`
                    }
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <NumberInput
                            value={field.value}
                            onChange={field.onChange}
                            min={1}
                            step={1}
                            classNames="w-16 h-7"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={
                      `${fieldPrefix}.add.${unit.fieldIndex!}.to_unit_id` as `order_units.add.${number}.to_unit_id`
                    }
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input
                            className="w-16 h-7 bg-muted cursor-not-allowed text-xs"
                            value={getUnitName(field.value)}
                            disabled
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            }
            const availableUnits = getAvailableUnits(unit.to_unit_id);
            return (
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={
                    `${fieldPrefix}.add.${unit.fieldIndex!}.to_unit_qty` as `ingredient_units.add.${number}.to_unit_qty`
                  }
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <NumberInput
                          value={field.value ?? 0}
                          onChange={field.onChange}
                          min={0}
                          step={0}
                          classNames="w-16 h-7"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={
                    `${fieldPrefix}.add.${unit.fieldIndex!}.to_unit_id` as `ingredient_units.add.${number}.to_unit_id`
                  }
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <UnitCombobox
                          value={field.value}
                          onChange={field.onChange}
                          availableUnits={availableUnits}
                          disabled={currentMode === formType.VIEW}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            );
          }

          if (currentMode === formType.EDIT && unit.dataIndex !== undefined) {
            if (isOrderUnit) {
              return (
                <div className="flex items-center gap-2">
                  <FormField
                    control={control}
                    name={
                      `${fieldPrefix}.data.${unit.dataIndex}.to_unit_qty` as `order_units.data.${number}.to_unit_qty`
                    }
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <NumberInput
                            value={field.value ?? 0}
                            onChange={(value) => {
                              field.onChange(value);
                              handleFieldChange(unit.dataIndex!, "to_unit_qty", value);
                            }}
                            min={1}
                            step={1}
                            classNames="w-16 h-7"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Input
                    className="w-16 h-7 bg-muted cursor-not-allowed text-xs"
                    value={getUnitName(unit.to_unit_id)}
                    disabled
                    readOnly
                  />
                </div>
              );
            }
            const availableUnits = getAvailableUnits(unit.to_unit_id);
            return (
              <div className="flex items-center gap-2">
                <FormField
                  control={control}
                  name={
                    `${fieldPrefix}.data.${unit.dataIndex}.to_unit_qty` as `ingredient_units.data.${number}.to_unit_qty`
                  }
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <NumberInput
                          value={field.value ?? 0}
                          onChange={(value) => {
                            field.onChange(value);
                            handleFieldChange(unit.dataIndex!, "to_unit_qty", value);
                          }}
                          min={0}
                          step={0}
                          classNames="w-16 h-7"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={
                    `${fieldPrefix}.data.${unit.dataIndex}.to_unit_id` as `ingredient_units.data.${number}.to_unit_id`
                  }
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <UnitCombobox
                          value={field.value ?? ""}
                          onChange={(value) => {
                            field.onChange(value);
                            handleFieldChange(unit.dataIndex!, "to_unit_id", value);
                          }}
                          availableUnits={availableUnits}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            );
          }

          return (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium">{unit.to_unit_qty}</span>
              <span>{unit.to_unit_name || getUnitName(unit.to_unit_id)}</span>
            </div>
          );
        },
        enableSorting: false,
        size: 180,
      },
      {
        accessorKey: "is_default",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={translations.default} />
        ),
        cell: ({ row }) => {
          const unit = row.original;

          if (unit.isNew) {
            return (
              <div className="flex justify-center">
                <FormField
                  control={control}
                  name={
                    `${fieldPrefix}.add.${unit.fieldIndex!}.is_default` as `order_units.add.${number}.is_default`
                  }
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            handleDefaultChange(unit.fieldIndex!, false, checked as boolean);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            );
          }

          if (currentMode === formType.EDIT && unit.dataIndex !== undefined) {
            return (
              <div className="flex justify-center">
                <FormField
                  control={control}
                  name={
                    `${fieldPrefix}.data.${unit.dataIndex}.is_default` as `order_units.data.${number}.is_default`
                  }
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            handleDefaultChange(unit.dataIndex!, true, checked as boolean);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            );
          }

          return (
            <div className="flex justify-center">
              <Checkbox checked={unit.is_default} disabled />
            </div>
          );
        },
        enableSorting: false,
        size: 100,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "conversion",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={translations.conversion} />
        ),
        cell: ({ row }) => {
          const unit = row.original;
          return (
            <ConversionPreviewWatcher
              control={control}
              unit={unit}
              getUnitName={getUnitName}
              unitType={unitType}
            />
          );
        },
        enableSorting: false,
        size: 180,
      },
      ...(currentMode !== formType.VIEW
        ? [
            {
              id: "action",
              header: () => (
                <span className="text-muted-foreground text-[0.8rem]">{translations.action}</span>
              ),
              cell: ({ row }: { row: { original: UnitRow } }) => {
                const unit = row.original;

                if (unit.isNew) {
                  return (
                    <div className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUnit(unit.fieldIndex!)}
                        className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                }

                return (
                  <div className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl">
                            {translations.delete}{" "}
                            {isOrderUnit ? translations.orderUnit : translations.ingredientUnit}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <p className="text-muted-foreground">
                              {translations.deleteDescription}
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2 mt-4">
                          <AlertDialogCancel className="mt-0">
                            {translations.cancel}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveUnit(unit.id!)}
                            className="bg-red-600"
                          >
                            {translations.delete}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                );
              },
              enableSorting: false,
              size: 100,
              meta: {
                cellClassName: "text-right",
                headerClassName: "text-right",
              },
            },
          ]
        : []),
    ],
    [
      control,
      currentMode,
      fieldPrefix,
      getAvailableUnits,
      getUnitName,
      handleDefaultChange,
      handleFieldChange,
      handleRemoveUnit,
      inventoryUnitName,
      isOrderUnit,
      removeUnit,
      translations,
      unitType,
    ]
  );

  return columns;
};
