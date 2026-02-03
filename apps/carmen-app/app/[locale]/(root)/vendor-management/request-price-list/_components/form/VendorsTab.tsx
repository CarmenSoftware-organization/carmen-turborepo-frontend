"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, X, Mail } from "lucide-react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import VendorLookup from "@/components/lookup/LookupVendor";
import { VendorGetDto } from "@/dtos/vendor-management";
import { RfpDetailDto } from "@/dtos/rfp.dto";
import { RfpFormValues } from "../../_schema/rfp.schema";
import { nanoid } from "nanoid";
import { backendApi } from "@/lib/backend-api";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useTranslations } from "next-intl";

interface VendorDisplay {
  id: string;
  name: string;
  contact_email: string;
  vendor_id?: string;
  isPlaceholder?: boolean;
  url_token?: string;
}

interface Props {
  form: UseFormReturn<RfpFormValues>;
  isViewMode: boolean;
  rfpData?: RfpDetailDto;
  vendors: VendorGetDto[];
}

export default function VendorsTab({ form, isViewMode, rfpData, vendors }: Props) {
  const tRfp = useTranslations("RFP");
  const [isAdding, setIsAdding] = useState(false);
  const addedVendors = form.watch("vendors.add") || [];
  const removedVendorIds = form.watch("vendors.remove") || [];

  const displayVendors = useMemo<VendorDisplay[]>(() => {
    const existing: VendorDisplay[] = (rfpData?.vendors || [])
      .filter((v) => !removedVendorIds.includes(v.vendor_id))
      .map((v) => ({
        id: v.vendor_id,
        name: v.vendor_name || "",
        contact_email: v.contact_email || "",
        url_token: v.url_token ?? "",
      }));

    const added: VendorDisplay[] = addedVendors.map((v) => ({
      id: v.vendor_id,
      name: v.vendor_name,
      contact_email: v.contact_email || "",
    }));

    const list = [...existing, ...added];

    if (isAdding) {
      list.unshift({
        id: nanoid(),
        name: "",
        contact_email: "",
        isPlaceholder: true,
      });
    }

    return list;
  }, [rfpData, addedVendors, removedVendorIds, isAdding]);

  const handleRemoveVendor = (vendorId: string) => {
    const currentAdd = form.getValues("vendors.add") || [];
    const isAddedIndex = currentAdd.findIndex((v) => v.vendor_id === vendorId);

    if (isAddedIndex >= 0) {
      const newAdd = [...currentAdd];
      newAdd.splice(isAddedIndex, 1);
      form.setValue("vendors.add", newAdd, { shouldDirty: true });
    } else {
      const currentRemove = form.getValues("vendors.remove") || [];
      form.setValue("vendors.remove", [...currentRemove, vendorId], { shouldDirty: true });
    }
  };

  const checkPriceList = async (url_token: string) => {
    try {
      const res = await axios.post(`${backendApi}/api/check-price-list/${url_token}`);
      if (res.data.success) {
        toastSuccess({ message: tRfp("price_list_checked") });
      }
    } catch (error: any) {
      toastError({ message: error.response?.data?.message || tRfp("price_list_check_failed") });
    }
  };

  const columns = useMemo<ColumnDef<VendorDisplay>[]>(
    () => [
      {
        id: "no",
        header: "#",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">{row.index + 1}</span>
        ),
        size: 50,
      },
      {
        accessorKey: "name",
        header: () => <span className="text-xs font-semibold">{tRfp("vendor_name")}</span>,
        cell: ({ row }) => {
          if (row.original.isPlaceholder) {
            return (
              <VendorLookup
                excludeIds={displayVendors.filter((v) => !v.isPlaceholder && v.id).map((v) => v.id)}
                onValueChange={(val) => {
                  const currentAdd = form.getValues("vendors.add") || [];
                  const existingIds = rfpData?.vendors?.map((v) => v.vendor_id) || [];
                  const alreadyAdded = currentAdd.some((v) => v.vendor_id === val);
                  const alreadyExists = existingIds.includes(val);

                  if (val && !alreadyAdded && !alreadyExists) {
                    if (vendors) {
                      const selectedVendor = vendors.find((v) => v.id === val);
                      if (selectedVendor) {
                        const totalCurrent = (rfpData?.vendors?.length || 0) + currentAdd.length;
                        const primaryContact =
                          selectedVendor.tb_vendor_contact?.find((c) => c.is_primary) ||
                          selectedVendor.tb_vendor_contact?.[0];
                        const email =
                          primaryContact?.email || selectedVendor.vendor_contact?.[0]?.email || "";
                        const person =
                          primaryContact?.name || selectedVendor.vendor_contact?.[0]?.name || "";
                        const phone =
                          primaryContact?.phone || selectedVendor.vendor_contact?.[0]?.phone || "";

                        const vendorObj = {
                          vendor_id: selectedVendor.id,
                          vendor_name: selectedVendor.name,
                          sequence_no: totalCurrent + 1,
                          contact_email: email,
                          contact_person: person,
                          contact_phone: phone,
                        };

                        form.setValue("vendors.add", [...currentAdd, vendorObj], {
                          shouldDirty: true,
                        });
                        setIsAdding(false);
                      }
                    }
                  }
                }}
                disabled={isViewMode}
              />
            );
          }
          return <span className="text-sm font-medium">{row.original.name}</span>;
        },
        size: 250,
      },
      {
        id: "email",
        header: () => <span className="text-xs font-semibold">{tRfp("email")}</span>,
        cell: ({ row }) =>
          row.original.contact_email ? (
            <Button
              size={"sm"}
              variant="outline"
              className="h-7 text-xs gap-2"
              onClick={() => checkPriceList(row.original.url_token ?? "")}
            >
              <Mail className="h-3.5 w-3.5" />
              {row.original.contact_email}
            </Button>
          ) : (
            <span className="text-muted-foreground text-xs">-</span>
          ),
        size: 200,
      },
      {
        id: "action",
        header: () => <span className="text-xs font-semibold">{tRfp("action")}</span>,
        cell: ({ row }) => {
          if (isViewMode) return null;
          if (row.original.isPlaceholder) {
            return (
              <div className="flex justify-end pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsAdding(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          }
          return (
            <div className="flex justify-end pr-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleRemoveVendor(row.original.id || row.original.vendor_id || "")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        size: 50,
      },
    ],
    [isViewMode, isAdding, rfpData, vendors, form, tRfp]
  );

  const table = useReactTable({
    data: displayVendors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {!isViewMode && !isAdding && (
        <div className="flex justify-end bg-muted/20 px-4 py-2 border-b">
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            {tRfp("add_vendors")}
          </Button>
        </div>
      )}

      <div className="border-none">
        <DataGrid
          table={table}
          recordCount={displayVendors.length}
          isLoading={false}
          tableLayout={{
            headerSticky: true,
            rowBorder: true,
            headerBackground: true,
            headerBorder: true,
            width: "fixed",
            dense: true,
          }}
        >
          <div className="w-full">
            <DataGridContainer>
              <ScrollArea className="h-[400px]">
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DataGridContainer>
          </div>
        </DataGrid>
      </div>
    </div>
  );
}
