import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/form-custom/form";
import VendorLookup from "@/components/lookup/VendorLookup";
import { useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trash2, User, Clock, Send, Check, X, Mail } from "lucide-react";
import { VendorGetDto } from "@/dtos/vendor-management";
import { useTranslations } from "next-intl";
import { VendorStatus, StatusVendor } from "@/dtos/rfp.dto";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Props {
  form: UseFormReturn<any>;
  isViewMode: boolean;
  // @ts-ignore
  vendors?: any; // รอ type
  defaultVendors?: VendorStatus[];
}

export default function VendorTab({ form, isViewMode, vendors, defaultVendors = [] }: Props) {
  const tRfp = useTranslations("RFP");
  const selectedVendorIds = form.watch("vendors") || [];

  console.log("defaultVendors", defaultVendors);

  // Map selected vendor IDs to full vendor objects
  const selectedVendors: VendorStatus[] = useMemo(() => {
    return selectedVendorIds
      .map((vendorId: string) => {
        // Try to find in full list first
        const vendorMaster = vendors?.data?.find((v: VendorGetDto) => v.id === vendorId);

        // Find in defaultVendors to get status/progress info
        const defaultVendor = defaultVendors?.find((v: VendorStatus) => v.id === vendorId);

        if (!vendorMaster && !defaultVendor) return null;

        // Merge data, defaulting to 'pending'/'0' if new vendor
        return {
          id: vendorId,
          name: vendorMaster?.name || defaultVendor?.name || "Unknown Vendor",
          email:
            defaultVendor?.email ||
            (vendorMaster && "email" in vendorMaster ? vendorMaster.email : "-"),
          status: defaultVendor?.status || "pending",
          progress: defaultVendor?.progress || 0,
          last_activity: defaultVendor?.last_activity || new Date(),
          is_send: defaultVendor?.is_send || false,
        };
      })
      .filter(Boolean) as VendorStatus[];
  }, [selectedVendorIds, vendors?.data, defaultVendors]);

  const handleRemoveVendor = (vendorId: string) => {
    const currentVendors = form.getValues("vendors") || [];
    form.setValue(
      "vendors",
      currentVendors.filter((id: string) => id !== vendorId)
    );
  };

  const getStatusBadge = (status: StatusVendor) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="rounded-sm">
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="warning" className="rounded-sm">
            In Progress
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="secondary" className="rounded-sm">
            Pending
          </Badge>
        );
    }
  };

  const columns = useMemo<ColumnDef<VendorStatus>[]>(
    () => [
      {
        id: "no",
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        enableSorting: false,
        size: 50,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "name",
        header: () => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{tRfp("vendor_name")}</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.email || "-"}</span>
          </div>
        ),
        enableSorting: false,
        size: 250,
      },
      {
        accessorKey: "status",
        header: () => <span>{tRfp("status") || "Status"}</span>,
        cell: ({ row }) => getStatusBadge(row.original.status),
        enableSorting: false,
        size: 120,
      },
      {
        accessorKey: "progress",
        header: () => <span>Progress</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 w-full max-w-[140px]">
            <Progress value={row.original.progress} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground w-8 text-right">
              {row.original.progress}%
            </span>
          </div>
        ),
        enableSorting: false,
        size: 180,
      },
      {
        accessorKey: "last_activity",
        header: () => (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Last Activity</span>
          </div>
        ),
        cell: ({ row }) => {
          const date = new Date(row.original.last_activity);
          return <span className="text-muted-foreground text-sm">{date.toLocaleDateString()}</span>;
        },
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "is_send",
        header: () => (
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            <span>Sent</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Button
              size="sm"
              variant={row.original.is_send ? "outline" : "default"}
              className="h-6 text-xs"
              disabled={row.original.is_send}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log("vendorId", row.original.id);
              }}
            >
              <Mail className="h-4 w-4" />
              {row.original.is_send ? "Completed" : "Send Reminder"}
            </Button>
          </div>
        ),
        enableSorting: false,
        size: 80,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: () => <span className="text-right">{tRfp("action")}</span>,
        cell: ({ row }) => {
          if (isViewMode) return null;

          return (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:text-destructive"
                onClick={() => handleRemoveVendor(row.original.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{tRfp("remove_vendor")}</span>
              </Button>
            </div>
          );
        },
        enableSorting: false,
        size: 80,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [isViewMode, handleRemoveVendor, tRfp]
  );

  const table = useReactTable({
    data: selectedVendors,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: false,
  });

  return (
    <div className="space-y-8 mt-4">
      {/* Add Vendor Section */}
      {!isViewMode && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {tRfp("add_vendors")}
          </h2>
          <div className="space-y-2">
            <FormLabel>{tRfp("vendor_search")}</FormLabel>
            <VendorLookup
              value=""
              onValueChange={(vendorId) => {
                const currentVendors = form.getValues("vendors") || [];
                if (vendorId && !currentVendors.includes(vendorId)) {
                  form.setValue("vendors", [...currentVendors, vendorId]);
                }
              }}
              placeholder={tRfp("vendor_search_placeholder")}
              disabled={isViewMode}
            />
            <p className="text-xs text-muted-foreground">{tRfp("selected_vendors_note")}</p>
          </div>
        </div>
      )}

      {/* Selected Vendors List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {tRfp("selected_vendors")}
          </h2>
          {selectedVendors.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {selectedVendors.length}
            </span>
          )}
        </div>

        {selectedVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <User className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-sm font-medium mb-1">{tRfp("no_vendors_selected")}</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              {isViewMode ? tRfp("no_vendors_assigned") : tRfp("start_adding_vendors")}
            </p>
          </div>
        ) : (
          <DataGrid
            table={table}
            recordCount={selectedVendors.length}
            isLoading={false}
            loadingMode="skeleton"
            emptyMessage={tRfp("no_vendors_selected_empty")}
            tableLayout={{
              headerSticky: false,
              dense: true,
              rowBorder: true,
              headerBackground: true,
              headerBorder: true,
              width: "fixed",
            }}
          >
            <DataGridContainer>
              <ScrollArea className="max-h-[500px]">
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DataGridContainer>
          </DataGrid>
        )}
      </div>
    </div>
  );
}
