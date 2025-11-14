import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/form-custom/form";
import VendorLookup from "@/components/lookup/VendorLookup";
import { useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trash2, User } from "lucide-react";
import { VendorGetDto } from "@/dtos/vendor-management";

interface TabVendorProps {
  form: UseFormReturn<any>;
  isViewMode: boolean;
  vendors?: any;
}

interface VendorTableRow {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export default function TabVendor({ form, isViewMode, vendors }: TabVendorProps) {
  const selectedVendorIds = form.watch("vendors") || [];

  // Map selected vendor IDs to full vendor objects
  const selectedVendors: VendorTableRow[] = useMemo(() => {
    if (!vendors?.data) return [];

    return selectedVendorIds
      .map((vendorId: string) => {
        const vendor = vendors.data.find((v: VendorGetDto) => v.id === vendorId);
        if (!vendor) return null;

        return {
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
        };
      })
      .filter(Boolean) as VendorTableRow[];
  }, [selectedVendorIds, vendors?.data]);

  const columns = useMemo<ColumnDef<VendorTableRow>[]>(
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
            <span>Vendor Name</span>
          </div>
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        enableSorting: false,
        size: 250,
      },
      {
        accessorKey: "email",
        header: () => <span>Email</span>,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email || "-"}</span>
        ),
        enableSorting: false,
        size: 200,
      },
      {
        accessorKey: "phone",
        header: () => <span>Phone</span>,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.phone || "-"}</span>
        ),
        enableSorting: false,
        size: 150,
      },
      {
        id: "action",
        header: () => <span className="text-right">Action</span>,
        cell: ({ row }) => {
          if (isViewMode) return null;

          return (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:text-destructive"
                onClick={() => {
                  const currentVendors = form.getValues("vendors") || [];
                  form.setValue(
                    "vendors",
                    currentVendors.filter((id: string) => id !== row.original.id)
                  );
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove vendor</span>
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
    [isViewMode, form]
  );

  const table = useReactTable({
    data: selectedVendors,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: false,
  });

  return (
    <div className="space-y-4">
      {!isViewMode && (
        <div className="border rounded-lg p-4 space-y-2">
          <FormLabel>Add Vendor</FormLabel>
          <VendorLookup
            value=""
            onValueChange={(vendorId) => {
              const currentVendors = form.getValues("vendors") || [];
              if (vendorId && !currentVendors.includes(vendorId)) {
                form.setValue("vendors", [...currentVendors, vendorId]);
              }
            }}
            placeholder="Select vendors to add"
            disabled={isViewMode}
          />
        </div>
      )}

      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Selected Vendors</h2>
          <span className="text-sm text-muted-foreground">
            {selectedVendors.length} vendor{selectedVendors.length !== 1 ? "s" : ""}
          </span>
        </div>

        <DataGrid
          table={table}
          recordCount={selectedVendors.length}
          isLoading={false}
          loadingMode="skeleton"
          emptyMessage="No vendors selected"
          tableLayout={{
            headerSticky: false,
            dense: false,
            rowBorder: true,
            headerBackground: true,
            headerBorder: true,
            width: "fixed",
          }}
        >
          <DataGridContainer>
            <ScrollArea className="max-h-[400px]">
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
        </DataGrid>
      </div>
    </div>
  );
}
