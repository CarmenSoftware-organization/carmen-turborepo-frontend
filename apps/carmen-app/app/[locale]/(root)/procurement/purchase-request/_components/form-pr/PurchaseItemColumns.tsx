import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { PurchaseRequestDetail, StageStatus, ItemStatus } from "@/dtos/purchase-request.dto";
import { formType } from "@/dtos/form.dto";
import { formatDate } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/currency";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLocationLookup from "@/components/lookup/ProductLocationLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import UnitLookup from "@/components/lookup/UnitLookup";
import DateInput from "@/components/form-custom/DateInput";
import { DeliveryPointSelectLookup } from "@/components/lookup/DeliveryPointSelectLookup";
import { UnitSelectCell } from "../UnitSelectCell";
import ExpandedContent from "./ExpandedContent";

interface ColumnConfig {
  currentMode: formType;
  initValues: PurchaseRequestDetail[];
  addFields: unknown[];
  prStatus?: string;
  getItemValue: (item: PurchaseRequestDetail, fieldName: string) => unknown;
  getCurrentStatus: (stagesStatusValue: string | StageStatus[] | undefined) => string;
  onItemUpdate: (
    itemId: string,
    fieldName: string,
    value: unknown,
    selectedProduct?: unknown
  ) => void;
  handleRemoveItemClick: (id: string, isNewItem?: boolean, itemIndex?: number) => void;
  setSelectAllDialogOpen: (open: boolean) => void;
  dateFormat: string;
  currencyBase: string;
  token: string;
  buCode: string;
  tHeader: (key: string) => string;
  tAction: (key: string) => string;
}

const getPrItemName = (type: string, tAction: (key: string) => string) => {
  if (type === ItemStatus.APPROVED) {
    return tAction("approve");
  } else if (type === ItemStatus.REVIEW) {
    return tAction("review");
  } else if (type === ItemStatus.REJECTED) {
    return tAction("reject");
  } else {
    return tAction("pending");
  }
};

const getBadgeVariant = (status: string) => {
  switch (status) {
    case ItemStatus.APPROVED:
      return "active";
    case ItemStatus.REJECTED:
      return "destructive";
    case ItemStatus.REVIEW:
      return "warning";
    case ItemStatus.PENDING:
      return "work_in_process";
    default:
      return "work_in_process";
  }
};

export const createPurchaseItemColumns = (
  config: ColumnConfig
): ColumnDef<PurchaseRequestDetail>[] => {
  const {
    currentMode,
    initValues: unsortedInitValues,
    addFields,
    prStatus,
    getItemValue,
    getCurrentStatus,
    onItemUpdate,
    handleRemoveItemClick,
    setSelectAllDialogOpen,
    dateFormat,
    currencyBase,
    token,
    buCode,
    tHeader,
    tAction,
  } = config;

  const initValues = [...unsortedInitValues].sort((a, b) => a.sequence_no - b.sequence_no);

  const defaultAmount = { locales: "en-US", minimumFractionDigits: 2 };

  const baseColumns: ColumnDef<PurchaseRequestDetail>[] = [
    {
      id: "expander",
      header: () => null,
      cell: ({ row }) => {
        return row.getCanExpand() ? (
          <Button
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              row.getToggleExpandedHandler()();
            }}
            variant={"outline"}
            size={"sm"}
            className="w-6 h-6"
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        ) : null;
      },
      size: 40,
      enableSorting: false,
      meta: {
        expandedContent: (item: PurchaseRequestDetail) => (
          <ExpandedContent
            item={item}
            getItemValue={getItemValue}
            onItemUpdate={onItemUpdate}
            currencyBase={currencyBase}
            token={token}
            buCode={buCode}
            prStatus={prStatus}
            currentMode={currentMode}
          />
        ),
      },
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          disabled={table.getRowModel().rows.length === 0}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="align-[inherit] mb-0.5"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectAllDialogOpen(true);
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="align-[inherit] mb-1"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 30,
    },
    {
      id: "no",
      header: () => <div className="text-center text-muted-foreground">#</div>,
      cell: ({ row }) => <div className="text-center text-xs">{row.index + 1}</div>,
      enableSorting: false,
      size: 30,
      meta: {
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
    {
      accessorKey: "location_name",
      header: ({ column }) => <DataGridColumnHeader column={column} title={tHeader("location")} />,
      cell: ({ row }) => {
        const item = row.original;

        return currentMode === formType.VIEW ? (
          <span className="font-semibold text-muted-foreground text-xs break-words">
            {item.location_name || "-"}
          </span>
        ) : (
          <div className="min-w-[200px] pr-4">
            <LocationLookup
              value={getItemValue(item, "location_id") as string | undefined}
              onValueChange={(value, selectedLocation) => {
                onItemUpdate(item.id, "location_id", value);
                // Reset product and related fields when location changes
                onItemUpdate(item.id, "product_id", "");
                onItemUpdate(item.id, "product_name", "");
                onItemUpdate(item.id, "inventory_unit_id", "");
                onItemUpdate(item.id, "inventory_unit_name", "");
                onItemUpdate(item.id, "requested_qty", 0);
                onItemUpdate(item.id, "requested_unit_id", "");
                onItemUpdate(item.id, "requested_qty", 0);
                onItemUpdate(item.id, "requested_unit_name", "");
                onItemUpdate(item.id, "delivery_date", "");
                // Auto-init delivery point from location
                if (selectedLocation?.delivery_point) {
                  onItemUpdate(item.id, "delivery_point_id", selectedLocation.delivery_point.id);
                  onItemUpdate(
                    item.id,
                    "delivery_point_name",
                    selectedLocation.delivery_point.name
                  );
                }
              }}
              classNames="text-xs h-7 w-full"
            />
          </div>
        );
      },
      enableSorting: false,
      size: currentMode === formType.VIEW ? 120 : 200,
      meta: {
        headerTitle: tHeader("location"),
      },
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => <DataGridColumnHeader column={column} title={tHeader("product")} />,
      cell: ({ row, table }) => {
        const item = row.original;

        // Get all product_ids from other items (exclude current item)
        const usedProductIds = table
          .getRowModel()
          .rows.filter((r) => r.original.id !== item.id)
          .map((r) => getItemValue(r.original, "product_id") as string)
          .filter(Boolean);

        return currentMode === formType.VIEW ? (
          <div>
            <p className="font-semibold text-muted-foreground text-xs break-words">
              {item.product_name || "-"}
            </p>
            {item.description && (
              <p className="text-xs text-muted-foreground break-words">{item.description}</p>
            )}
          </div>
        ) : (
          <div className="space-y-1 min-w-[250px] pr-4">
            <ProductLocationLookup
              location_id={(getItemValue(item, "location_id") as string) || ""}
              value={(getItemValue(item, "product_id") as string) || ""}
              excludeProductIds={usedProductIds}
              onValueChange={(value, selectedProduct) => {
                onItemUpdate(item.id, "product_id", value, selectedProduct);
                onItemUpdate(item.id, "inventory_unit_id", selectedProduct?.inventory_unit?.id);
                onItemUpdate(item.id, "inventory_unit_name", selectedProduct?.inventory_unit?.name);
                onItemUpdate(item.id, "requested_unit_id", "");
                onItemUpdate(item.id, "requested_unit_name", "");
              }}
              classNames="text-xs h-7 w-full"
              disabled={!getItemValue(item, "location_id")}
            />
            {item.product_id && item.description && (
              <p className="text-xs text-muted-foreground break-words">{item.description}</p>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: currentMode === formType.VIEW ? 150 : 250,
      meta: {
        headerTitle: tHeader("product"),
      },
    },
    {
      accessorKey: "stage_status",
      header: ({ column }) => <DataGridColumnHeader column={column} title={tHeader("status")} />,
      cell: ({ row }) => {
        const item = row.original;
        const isNewItem = !initValues.some((initItem) => initItem.id === item.id);

        if (isNewItem) {
          return <p className="text-center text-xs">-</p>;
        }

        const stagesStatusValue = (getItemValue(item, "stages_status") || item.stages_status) as
          | string
          | StageStatus[]
          | undefined;

        const status = getCurrentStatus(stagesStatusValue);

        return <Badge variant={getBadgeVariant(status)}>{getPrItemName(status, tAction)}</Badge>;
      },
      enableSorting: false,
      size: 100,
      meta: {
        headerTitle: tHeader("status"),
      },
    },
    {
      accessorKey: "requested_qty",
      header: ({ column }) => (
        <div className="flex justify-end">
          <DataGridColumnHeader column={column} title={tHeader("requested")} />
        </div>
      ),
      cell: ({ row }) => {
        const item = row.original;

        return currentMode === formType.VIEW ? (
          <p className="text-xs text-right">
            {item.requested_qty} {item.requested_unit_name || "-"}
          </p>
        ) : (
          <div className="flex items-center gap-1 justify-end min-w-[120px]">
            <NumberInput
              value={getItemValue(item, "requested_qty") as number}
              onChange={(value) => {
                onItemUpdate(item.id, "requested_qty", value);
                onItemUpdate(item.id, "approved_qty", value);

                // Auto-calculate requested_base_qty
                const conversionFactor =
                  (getItemValue(item, "requested_unit_conversion_factor") as number) || 1;
                const baseQty = Number(value) * conversionFactor;
                onItemUpdate(item.id, "requested_base_qty", baseQty);
                onItemUpdate(item.id, "approved_base_qty", baseQty);
              }}
              classNames="h-7 text-xs bg-background w-16"
              disabled={!getItemValue(item, "product_id")}
            />
            <UnitSelectCell
              item={item}
              productId={(getItemValue(item, "product_id") as string) || ""}
              currentUnitId={getItemValue(item, "requested_unit_id") as string | undefined}
              onItemUpdate={onItemUpdate}
              token={token}
              buCode={buCode}
            />
          </div>
        );
      },
      enableSorting: false,
      size: currentMode === formType.VIEW ? 100 : 180,
      meta: {
        headerTitle: tHeader("requested"),
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      accessorKey: "approved_qty",
      header: ({ column }) => (
        <div className="flex justify-end">
          <DataGridColumnHeader column={column} title={tHeader("approved")} />
        </div>
      ),
      cell: ({ row }) => {
        const item = row.original;
        const isNewItem = !initValues.some((initItem) => initItem.id === item.id);
        console.log("item", item);

        if (currentMode === formType.VIEW) {
          return (
            <div className="text-right">
              <p className="text-xs text-active">
                {item.approved_qty} {item.approved_unit_name || "-"}
              </p>
              <Separator className="my-0.5" />
              <p className="text-xs text-active">
                FOC: {item.foc_qty} {item.foc_unit_name || "-"}
              </p>
            </div>
          );
        }

        if (isNewItem) {
          return <p className="text-right text-sm">-</p>;
        }

        return (
          <div className="flex flex-col gap-1 min-w-[180px] pr-4">
            <div className="flex items-center gap-1 justify-end">
              <NumberInput
                value={getItemValue(item, "approved_qty") as number}
                onChange={(value) => onItemUpdate(item.id, "approved_qty", value)}
                classNames="w-16 h-7 text-xs bg-background"
              />
              <UnitLookup
                value={(getItemValue(item, "approved_unit_id") as string) || ""}
                onValueChange={(value) => onItemUpdate(item.id, "approved_unit_id", value)}
                classNames="h-7 text-xs w-24"
              />
            </div>
            <div className="flex items-center gap-1 justify-end">
              <NumberInput
                value={getItemValue(item, "foc_qty") as number}
                onChange={(value) => onItemUpdate(item.id, "foc_qty", value)}
                classNames="w-16 h-7 text-xs bg-background"
              />
              <UnitLookup
                value={(getItemValue(item, "foc_unit_id") as string) || ""}
                onValueChange={(value) => onItemUpdate(item.id, "foc_unit_id", value)}
                classNames="h-7 text-xs w-24"
              />
            </div>
          </div>
        );
      },
      enableSorting: false,
      size: currentMode === formType.VIEW ? 100 : 180,
      meta: {
        headerTitle: tHeader("approved"),
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      accessorKey: "delivery_date",
      header: ({ column }) => (
        <div className="flex justify-center">
          <DataGridColumnHeader column={column} title={tHeader("date_required")} />
        </div>
      ),
      cell: ({ row }) => {
        const item = row.original;

        return currentMode === formType.VIEW ? (
          <p className="text-center text-xs">
            {formatDate(item.delivery_date, dateFormat || "yyyy-MM-dd")}
          </p>
        ) : (
          <div className="flex justify-center min-w-[120px] pr-4">
            <DateInput
              field={{
                value: getItemValue(item, "delivery_date") as Date | undefined,
                onChange: (value) => onItemUpdate(item.id, "delivery_date", value),
              }}
              classNames="text-xs h-7 w-full"
              disablePastDates={true}
            />
          </div>
        );
      },
      enableSorting: false,
      size: currentMode === formType.VIEW ? 110 : 155,
      meta: {
        headerTitle: tHeader("date_required"),
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
    {
      accessorKey: "delivery_point_name",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title={tHeader("delivery_point")} />
      ),
      cell: ({ row }) => {
        const item = row.original;

        return currentMode === formType.VIEW ? (
          <p className="text-xs">{item.delivery_point_name || "-"}</p>
        ) : (
          <div className="min-w-[200px] pr-4">
            <DeliveryPointSelectLookup
              value={(getItemValue(item, "delivery_point_id") as string) || ""}
              onValueChange={(value) => onItemUpdate(item.id, "delivery_point_id", value)}
              className="h-7 text-xs w-full"
              disabled={!getItemValue(item, "location_id")}
            />
          </div>
        );
      },
      enableSorting: false,
      size: currentMode === formType.VIEW ? 130 : 200,
      meta: {
        headerTitle: tHeader("delivery_point"),
      },
    },
    {
      accessorKey: "total_price",
      header: ({ column }) => (
        <div className="flex justify-end">
          <DataGridColumnHeader column={column} title={tHeader("pricing")} />
        </div>
      ),
      cell: ({ row }) => {
        const item = row.original;
        const isNewItem = !initValues.some((initItem) => initItem.id === item.id);

        return (
          <div className="text-right text-xs text-active font-bold">
            {isNewItem ? (
              <p>-</p>
            ) : (
              <p>
                {formatPrice(
                  item.total_price,
                  currencyBase ?? "THB",
                  defaultAmount.locales,
                  defaultAmount.minimumFractionDigits
                )}
              </p>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 90,
      meta: {
        headerTitle: tHeader("pricing"),
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      id: "action",
      cell: ({ row }) => {
        if (currentMode === formType.VIEW) return null;
        const item = row.original;
        const isNewItem = !initValues.some((initItem) => initItem.id === item.id);
        const addIndex = isNewItem
          ? addFields.findIndex((field: unknown) => (field as { id: string }).id === item.id)
          : undefined;

        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleRemoveItemClick(item.id, isNewItem, addIndex);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
      enableSorting: false,
      size: 40,
      meta: {
        headerTitle: tHeader("action"),
        cellClassName:
          "text-right sticky right-0 bg-background z-10 shadow-md border-l border-border",
        headerClassName: "text-right sticky right-0 bg-muted z-10 border-l border-border",
      },
    },
  ];

  let filteredColumns = baseColumns;

  if (currentMode === formType.VIEW) {
    filteredColumns = filteredColumns.filter((col) => col.id !== "action" && col.id !== "select");
  }

  if (prStatus !== "in_progress") {
    filteredColumns = filteredColumns.filter(
      (col) =>
        col.id !== "select" &&
        (col as { accessorKey?: string }).accessorKey !== "stage_status" &&
        (col as { accessorKey?: string }).accessorKey !== "approved_qty" &&
        (col as { accessorKey?: string }).accessorKey !== "total_price"
    );
  }

  return filteredColumns;
};
