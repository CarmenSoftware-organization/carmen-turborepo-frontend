"use client";

import { useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, ExternalLink, Check, Copy, Plus, X } from "lucide-react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import VendorLookup from "@/components/lookup/LookupVendor";
import { VendorGetDto } from "@/dtos/vendor-management";
import { RfpDetailDto } from "@/dtos/rfp.dto";
import { RfpFormValues } from "../../_schema/rfp.schema";
import { nanoid } from "nanoid";
import { frontendUrl } from "@/lib/backend-api";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

    // Show placeholder row only when isAdding is true (button clicked)
    if (isAdding) {
      list.push({
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

  const handleVendorChange = (val: string, oldVendorId?: string) => {
    const currentAdd = form.getValues("vendors.add") || [];
    const existingIds = rfpData?.vendors?.map((v) => v.vendor_id) || [];
    const alreadyAdded = currentAdd.some((v) => v.vendor_id === val);
    const alreadyExists = existingIds.includes(val) && !removedVendorIds.includes(val);

    if (val && !alreadyAdded && !alreadyExists) {
      const selectedVendor = vendors.find((v) => v.id === val);
      if (selectedVendor) {
        const primaryContact =
          selectedVendor.tb_vendor_contact?.find((c) => c.is_primary) ||
          selectedVendor.tb_vendor_contact?.[0];
        const email = primaryContact?.email || selectedVendor.vendor_contact?.[0]?.email || "";
        const person = primaryContact?.name || selectedVendor.vendor_contact?.[0]?.name || "";
        const phone = primaryContact?.phone || selectedVendor.vendor_contact?.[0]?.phone || "";

        if (oldVendorId) {
          // Editing existing vendor
          const isInAddedList = currentAdd.some((v) => v.vendor_id === oldVendorId);

          if (isInAddedList) {
            // Update in add list
            const newAdd = currentAdd.map((v) =>
              v.vendor_id === oldVendorId
                ? {
                    ...v,
                    vendor_id: selectedVendor.id,
                    vendor_name: selectedVendor.name,
                    contact_email: email,
                    contact_person: person,
                    contact_phone: phone,
                  }
                : v
            );
            form.setValue("vendors.add", newAdd, { shouldDirty: true });
          } else {
            // Remove from existing and add new
            const currentRemove = form.getValues("vendors.remove") || [];
            form.setValue("vendors.remove", [...currentRemove, oldVendorId], { shouldDirty: true });
            const totalCurrent = (rfpData?.vendors?.length || 0) + currentAdd.length;
            const vendorObj = {
              vendor_id: selectedVendor.id,
              vendor_name: selectedVendor.name,
              sequence_no: totalCurrent + 1,
              contact_email: email,
              contact_person: person,
              contact_phone: phone,
            };
            form.setValue("vendors.add", [...currentAdd, vendorObj], { shouldDirty: true });
          }
        } else {
          // Adding new vendor
          const totalCurrent = (rfpData?.vendors?.length || 0) + currentAdd.length;
          const vendorObj = {
            vendor_id: selectedVendor.id,
            vendor_name: selectedVendor.name,
            sequence_no: totalCurrent + 1,
            contact_email: email,
            contact_person: person,
            contact_phone: phone,
          };
          form.setValue("vendors.add", [...currentAdd, vendorObj], { shouldDirty: true });
          setIsAdding(false);
        }
      }
    }
  };

  const copyToClipboard = (id: string, url_token: string) => {
    navigator.clipboard.writeText((frontendUrl ?? "") + "/pl/" + url_token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "name",
        header: () => <span className="text-xs">{tRfp("vendor_name")}</span>,
        cell: ({ row }) => {
          // In edit mode, always show VendorLookup
          if (!isViewMode) {
            return (
              <VendorLookup
                value={row.original.isPlaceholder ? undefined : row.original.id}
                excludeIds={displayVendors
                  .filter((v) => !v.isPlaceholder && v.id && v.id !== row.original.id)
                  .map((v) => v.id)}
                onValueChange={(val) => {
                  handleVendorChange(val, row.original.isPlaceholder ? undefined : row.original.id);
                }}
                classNames="text-xs h-7"
                disabled={isViewMode}
              />
            );
          }
          return <span className="text-xs">{row.original.name}</span>;
        },
        size: 300,
      },
      {
        id: "email",
        header: () => <span className="text-xs">{tRfp("email")}</span>,
        cell: ({ row }) =>
          row.original.contact_email ? (
            <Button
              size={"sm"}
              variant="outline"
              className="h-7 text-xs gap-2"
              onClick={() => {
                alert(row.original.contact_email);
              }}
            >
              <Mail className="h-3.5 w-3.5" />
              {row.original.contact_email}
            </Button>
          ) : (
            <span className="text-xs">-</span>
          ),
        size: 250,
      },
      {
        id: "action",
        header: () => <span className="text-xs">{tRfp("action")}</span>,
        cell: ({ row }) => {
          if (row.original.isPlaceholder) {
            return (
              <div className="flex items-center justify-end">
                <Button variant="ghost" size="xs" onClick={() => setIsAdding(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          }

          return (
            <div className="flex items-center justify-end gap-1">
              {isViewMode && (
                <>
                  <Button
                    size={"xs"}
                    variant="ghost"
                    onClick={() => copyToClipboard(row.original.id, row.original.url_token ?? "")}
                  >
                    {copiedId === row.original.id ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    size={"xs"}
                    variant="ghost"
                    onClick={() =>
                      window.open((frontendUrl ?? "") + "/pl/" + row.original.url_token, "_blank")
                    }
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}

              {!isViewMode && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() =>
                    handleRemoveVendor(row.original.id || row.original.vendor_id || "")
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
        size: 100,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [isViewMode, rfpData, vendors, form, tRfp, copiedId, displayVendors, isAdding]
  );

  const table = useReactTable({
    data: displayVendors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-end">
        {!isViewMode && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAdding(true)}
              disabled={isAdding}
              className="text-xs h-7"
            >
              <Plus className="h-3.5 w-3.5" />
              {tRfp("add_vendor")}
            </Button>
          </div>
        )}
      </div>
      <DataGrid
        table={table}
        recordCount={displayVendors.length}
        isLoading={false}
        tableLayout={{
          headerSticky: true,
          width: "fixed",
          dense: true,
        }}
      >
        <div className="w-full">
          <DataGridContainer>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
        </div>
      </DataGrid>
    </div>
  );
}
