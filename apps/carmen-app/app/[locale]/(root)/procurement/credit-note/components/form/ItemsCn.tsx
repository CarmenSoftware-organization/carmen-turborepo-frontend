"use client";

import { Control, useWatch, useFieldArray } from "react-hook-form";
import {
  CreditNoteDetailFormItemDto,
  CreditNoteFormDto,
} from "../../dto/cdn.dto";
import { formType } from "@/dtos/form.dto";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Filter, Plus, SquarePen, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import CnItemDialog from "./CnItemDialog";
import SearchInput from "@/components/ui-custom/SearchInput";
import { useURL } from "@/hooks/useURL";
import { useTranslations } from "next-intl";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { useStoreLocation } from "@/hooks/useStoreLocation";
import useProduct from "@/hooks/useProduct";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useUnitQuery } from "@/hooks/use-unit";

interface ItemsCnProps {
  readonly control: Control<CreditNoteFormDto>;
  readonly mode: formType;
}

export default function ItemsCn({ control, mode }: ItemsCnProps) {
  const { token, tenantId } = useAuth();
  const tCommon = useTranslations("Common");
  const tAction = useTranslations("Action");

  const { getLocationName } = useStoreLocation();
  const { getUnitName } = useUnitQuery({
    token,
    tenantId,
  });
  const { getProductName } = useProduct();

  const itemsDetail =
    useWatch({ control, name: "credit_note_detail.data" }) || [];

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<CreditNoteDetailFormItemDto | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [search, setSearch] = useURL("search");

  // Delete confirmation dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    index: number;
    productId: string;
  } | null>(null);

  // Field arrays for managing different operations
  const { update: updateData, remove: removeData } = useFieldArray({
    control,
    name: "credit_note_detail.data",
  });

  const { append: appendAdd } = useFieldArray({
    control,
    name: "credit_note_detail.add",
  });

  const { append: appendUpdate } = useFieldArray({
    control,
    name: "credit_note_detail.update",
  });

  const { append: appendRemove } = useFieldArray({
    control,
    name: "credit_note_detail.remove",
  });

  const handleDeleteClick = (id: string, index: number, productId: string) => {
    setItemToDelete({ id, index, productId });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    const { id, index } = itemToDelete;

    // Remove from data array
    removeData(index);

    // Add to remove array (only ID)
    if (id && !id.startsWith("temp_") && !id.includes("nanoid")) {
      appendRemove({ id });
    }

    // Close dialog and reset state
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleAddNewItem = (e: React.MouseEvent) => {
    e.preventDefault();
    onDiaLogFormOpen(true);
  };

  const onDiaLogFormOpen = (
    open: boolean,
    item?: CreditNoteDetailFormItemDto,
    index?: number
  ) => {
    setOpenDialog(open);
    if (open && item && index !== undefined) {
      setSelectedItem(item);
      setSelectedIndex(index);
    } else {
      setSelectedItem(null);
      setSelectedIndex(undefined);
    }
  };

  const handleSaveItem = (
    item: CreditNoteDetailFormItemDto,
    isEdit: boolean
  ) => {
    if (isEdit && selectedIndex !== undefined) {
      // Edit existing item
      updateData(selectedIndex, item);

      // Add to update array if it's not a new item (has real ID)
      if (
        item.id &&
        !item.id.startsWith("temp_") &&
        !item.id.includes("nanoid")
      ) {
        appendUpdate(item);
      }
    } else {
      // Add new item
      updateData(itemsDetail.length, item);

      // Add to add array
      appendAdd(item);
    }
  };

  return (
    <div className="space-y-2 my-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium px-2">Items Details</p>
        <div className="flex flex-row items-center gap-1">
          <SearchInput
            defaultValue={search}
            onSearch={setSearch}
            placeholder={tCommon("search")}
            data-id="purchase-request-item-search-input"
            containerClassName="w-full"
          />
          <Button size="sm">
            <Filter className="h-3 w-3" />
            Filter
          </Button>
          {mode !== formType.VIEW && (
            <Button size="sm" onClick={handleAddNewItem}>
              <Plus className="h-3 w-3" />
              Add Item
            </Button>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox />
            </TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Tax Amount</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>

            {mode !== formType.VIEW && (
              <TableHead className="text-right">Action</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemsDetail.map((item, index) => (
            <TableRow key={item.id || index}>
              <TableCell className="w-10">
                <Checkbox />
              </TableCell>
              <TableCell className="font-semibold">
                {getLocationName(item.location_id ?? "")}
              </TableCell>
              <TableCell className="font-semibold text-xs">
                {getProductName(item.product_id ?? "")}
              </TableCell>
              <TableCell className="text-right">{item.return_qty}  {getUnitName(item.return_unit_id ?? "-")}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.price, "THB")}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.tax_amount, "THB")}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.total_price, "THB")}</TableCell>
              {mode !== formType.VIEW && (
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDiaLogFormOpen(true, item, index)}
                  >
                    <SquarePen />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-destructive"
                    onClick={() =>
                      handleDeleteClick(
                        item.id ?? "",
                        index,
                        item.product_id ?? ""
                      )
                    }
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CnItemDialog
        open={openDialog}
        onOpenChange={(open) => onDiaLogFormOpen(open)}
        onSave={handleSaveItem}
        initItem={selectedItem || undefined}
        itemIndex={selectedIndex}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={tAction("confirmDelete")}
        description={`${tAction("confirmDelete")} "${itemToDelete?.productId}"`}
      />
    </div>
  );
}
