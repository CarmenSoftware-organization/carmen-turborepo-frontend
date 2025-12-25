"use client";

import { useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, X, Mail } from "lucide-react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import VendorLookup from "@/components/lookup/LookupVendor";
import { FormLabel } from "@/components/form-custom/form";
import { VendorGetDto } from "@/dtos/vendor-management";
import { RfpDetailDto } from "@/dtos/rfp.dto";
import { RfpFormValues } from "../../_schema/rfp.schema";
import { nanoid } from "nanoid";

interface VendorDisplay {
  id: string;
  name: string;
  contact_email: string;
  vendor_id?: string;
  isPlaceholder?: boolean;
}

interface Props {
  form: UseFormReturn<RfpFormValues>;
  isViewMode: boolean;
  rfpData?: RfpDetailDto;
  vendors: VendorGetDto[];
}

export default function VendorsTab({ form, isViewMode, rfpData, vendors }: Props) {
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

  const columns = useMemo<ColumnDef<VendorDisplay>[]>(
    () => [
      {
        id: "no",
        header: "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
        size: 50,
      },
      {
        accessorKey: "name",
        header: () => <span className="text-xs">Vendor Name</span>,
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
          return <span className="text-xs">{row.original.name}</span>;
        },
        size: 200,
      },
      {
        id: "email",
        header: () => <span className="text-xs">Email</span>,
        cell: ({ row }) =>
          row.original.contact_email ? (
            <Button
              size={"sm"}
              variant="outline"
              onClick={() => console.log(row.original.contact_email)}
            >
              <Mail />
              {row.original.contact_email}
            </Button>
          ) : null,
        size: 150,
      },
      {
        id: "action",
        header: () => <span className="text-xs">Action</span>,
        cell: ({ row }) => {
          if (isViewMode) return null;
          if (row.original.isPlaceholder) {
            return (
              <div className="flex justify-end pr-2">
                <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
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
                onClick={() => handleRemoveVendor(row.original.id || row.original.vendor_id || "")}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          );
        },
        size: 50,
      },
    ],
    [isViewMode, isAdding, rfpData, vendors, form]
  );

  const table = useReactTable({
    data: displayVendors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {!isViewMode && !isAdding && (
        <div className="flex justify-end">
          <Button onClick={() => setIsAdding(true)} size="sm" className="h-7">
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      )}

      <DataGrid table={table} recordCount={displayVendors.length} isLoading={false}>
        <DataGridContainer>
          <ScrollArea className="h-[400px]">
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
      </DataGrid>
    </div>
  );
}
