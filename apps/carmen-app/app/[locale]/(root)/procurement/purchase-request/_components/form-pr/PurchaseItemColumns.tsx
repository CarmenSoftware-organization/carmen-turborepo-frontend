import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { PurchaseRequestDetail, ItemStatus } from "@/dtos/purchase-request.dto";
import { formType } from "@/dtos/form.dto";
import { formatDate } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/currency";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import LookupLocation from "@/components/lookup/LookupLocation";
import LookupProductLocation from "@/components/lookup/LookupProductLocation";
import NumberInput from "@/components/form-custom/NumberInput";
import UnitLookup from "@/components/lookup/LookupUnit";
import DateInput from "@/components/form-custom/DateInput";
import { LookupDeliveryPointSelect } from "@/components/lookup/LookupDeliveryPointSelect";
import { UnitSelectCell } from "../UnitSelectCell";
import ExpandedContent from "./ExpandedContent";
import { PR_STATUS } from "../../_constants/pr-status";
import LookupCurrency from "@/components/lookup/LookupCurrency";
import { PurchaseRequestTemplateDetailDto } from "@/dtos/pr-template.dto";

type InitValuesType = PurchaseRequestDetail[] | PurchaseRequestTemplateDetailDto[];

interface ColumnConfig {
  currentMode: formType;
  initValues?: InitValuesType;
  addFields: unknown[];
  prStatus?: string;
  getItemValue: (item: PurchaseRequestDetail, fieldName: string) => unknown;
  getCurrentStatus: (stageStatus: string | undefined) => string;
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
  getCurrencyCode: (currencyId: string) => string;
  usedProductIdsMap: Map<string, string[]>;
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
    getCurrencyCode,
    usedProductIdsMap,
  } = config;

  const initValues = [...(unsortedInitValues || [])].sort((a, b) => {
    const seqA = "sequence_no" in a ? (a.sequence_no ?? 0) : 0;
    const seqB = "sequence_no" in b ? (b.sequence_no ?? 0) : 0;
    return seqA - seqB;
  });

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
      header: () => <span className="text-center text-muted-foreground">#</span>,
      cell: ({ row }) => <span className="text-center text-xs">{row.index + 1}</span>,
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
            <LookupLocation
              value={getItemValue(item, "location_id") as string | undefined}
              bu_code={buCode}
              onValueChange={(value, selectedLocation) => {
                onItemUpdate(item.id, "location_id", value);
                // Reset product and related fields when location changes
                onItemUpdate(item.id, "product_id", "");
                onItemUpdate(item.id, "product_name", "");
                onItemUpdate(item.id, "inventory_unit_id", "");
                onItemUpdate(item.id, "inventory_unit_name", "");
                onItemUpdate(item.id, "requested_qty", 0);
                onItemUpdate(item.id, "requested_unit_id", "");
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
      cell: ({ row }) => {
        const item = row.original;

        const usedProductIds = usedProductIdsMap.get(item.id) || [];

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
            <LookupProductLocation
              location_id={(getItemValue(item, "location_id") as string) || ""}
              value={(getItemValue(item, "product_id") as string) || ""}
              excludeProductIds={usedProductIds}
              bu_code={buCode}
              onValueChange={(value, selectedProduct) => {
                onItemUpdate(item.id, "product_id", value, selectedProduct);
                if (selectedProduct?.inventory_unit) {
                  onItemUpdate(item.id, "inventory_unit_id", selectedProduct.inventory_unit.id);
                  onItemUpdate(item.id, "inventory_unit_name", selectedProduct.inventory_unit.name);
                } else {
                  onItemUpdate(item.id, "inventory_unit_id", "");
                  onItemUpdate(item.id, "inventory_unit_name", "");
                }
                onItemUpdate(item.id, "requested_unit_id", "");
                onItemUpdate(item.id, "requested_unit_name", "");
              }}
              classNames="text-xs h-7 w-full"
              disabled={!getItemValue(item, "location_id")}
              initialDisplayName={
                (getItemValue(item, "product_name") as string) || item.product_name
              }
            />
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

        const currentStageStatus =
          (getItemValue(item, "current_stage_status") as string) || item.current_stage_status;

        const status = getCurrentStatus(currentStageStatus);

        return <Badge variant={getBadgeVariant(status)}>{getPrItemName(status, tAction)}</Badge>;
      },
      enableSorting: false,
      size: 100,
      meta: {
        headerTitle: tHeader("status"),
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
    {
      accessorKey: "requested_qty",
      header: ({ column }) => <DataGridColumnHeader column={column} title={tHeader("requested")} />,
      cell: ({ row }) => {
        const item = row.original;

        return currentMode === formType.VIEW ? (
          <div className="text-xs text-right">
            <p>{item.requested_qty}</p>
            <p>{item.requested_unit_name || "-"}</p>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1">
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
      size: currentMode === formType.VIEW ? 100 : 120,
      meta: {
        headerTitle: tHeader("requested"),
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      accessorKey: "approved_qty",
      header: ({ column }) => <DataGridColumnHeader column={column} title={tHeader("approved")} />,
      cell: ({ row }) => {
        const item = row.original;
        const isNewItem = !initValues.some((initItem) => initItem.id === item.id);
        if (currentMode === formType.VIEW) {
          return (
            <div className="text-xs text-right">
              <p>{item.approved_qty}</p>
              <p>{item.approved_unit_name || "-"}</p>
            </div>
          );
        }

        if (isNewItem) {
          return <p className="text-right text-sm">-</p>;
        }

        return (
          <div className="flex flex-col items-end gap-1">
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
        );
      },
      enableSorting: false,
      size: currentMode === formType.VIEW ? 100 : 120,
      meta: {
        headerTitle: tHeader("approved"),
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      accessorKey: "foc",
      header: ({ column }) => <DataGridColumnHeader column={column} title="FOC" />,
      cell: ({ row }) => {
        const item = row.original;

        if (currentMode === formType.VIEW) {
          return (
            <div className="text-xs text-right">
              <p>{item.foc_qty}</p>
              <p>{item.foc_unit_name || "-"}</p>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-end gap-1 justify-end">
            <NumberInput
              value={getItemValue(item, "foc_qty") as number}
              onChange={(value) => onItemUpdate(item.id, "foc_qty", value)}
              classNames="w-16 h-7 text-xs bg-background"
            />
            <UnitSelectCell
              item={item}
              productId={(getItemValue(item, "product_id") as string) || ""}
              currentUnitId={getItemValue(item, "foc_unit_id") as string | undefined}
              onItemUpdate={onItemUpdate}
              token={token}
              buCode={buCode}
              fieldPrefix="foc"
            />
          </div>
        );
      },
      enableSorting: false,
      size: currentMode === formType.VIEW ? 80 : 120,
      meta: {
        headerTitle: "FOC",
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      accessorKey: "currency_id",
      header: ({ column }) => <DataGridColumnHeader column={column} title={tHeader("currency")} />,
      cell: ({ row }) => {
        const item = row.original;

        return currentMode === formType.VIEW ? (
          <p className="text-xs">{getCurrencyCode(item.currency_id || "-")}</p>
        ) : (
          <LookupCurrency
            value={(getItemValue(item, "currency_id") as string) || ""}
            onValueChange={(value) => {
              onItemUpdate(item.id, "currency_id", value);
              onItemUpdate(item.id, "currency_name", getCurrencyCode(value));
            }}
            onSelectObject={(currency) => {
              onItemUpdate(item.id, "exchange_rate", currency.exchange_rate);
              // date update ให้มีค่าก่อนค่อยอัพเดท
              onItemUpdate(item.id, "exchange_rate_date", currency.updated_at);
            }}
            classNames="h-7 w-24 text-xs"
            bu_code={buCode}
          />
        );
      },
      enableSorting: false,
      size: currentMode === formType.VIEW ? 100 : 120,
      meta: {
        headerTitle: tHeader("currency"),
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
    {
      accessorKey: "delivery_date",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title={tHeader("date_required")} />
      ),
      cell: ({ row }) => {
        const item = row.original;

        return currentMode === formType.VIEW ? (
          <span className="text-center text-xs">
            {formatDate(item.delivery_date, dateFormat || "yyyy-MM-dd")}
          </span>
        ) : (
          <DateInput
            field={{
              value: getItemValue(item, "delivery_date") as Date | undefined,
              onChange: (value) => onItemUpdate(item.id, "delivery_date", value),
            }}
            classNames="text-xs h-7 w-full"
            disablePastDates={true}
          />
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
            <LookupDeliveryPointSelect
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
      header: ({ column }) => <DataGridColumnHeader column={column} title={tHeader("pricing")} />,
      cell: ({ row }) => {
        const item = row.original;
        const isNewItem = !initValues.some((initItem) => initItem.id === item.id);

        return (
          <div className="text-xs text-active font-bold">
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
            className="h-7 w-7 pr-2 text-muted-foreground hover:text-destructive hover:bg-variant"
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

  if (prStatus !== PR_STATUS.IN_PROGRESS) {
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
