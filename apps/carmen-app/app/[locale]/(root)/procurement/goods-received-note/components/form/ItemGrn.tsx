"use client";

import {
  Control,
  UseFormSetValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { CreateGRNDto, GoodReceivedNoteDetailItemDto } from "@/dtos/grn.dto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  Split,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import DialogItemGrnForm from "./DialogItemGrnForm";
import { useUnit } from "@/hooks/useUnit";
import { useStoreLocation } from "@/hooks/useStoreLocation";
import { useProduct } from "@/hooks/useProduct";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui-custom/SearchInput";
import { format } from "date-fns";

interface ItemGrnProps {
  readonly control: Control<CreateGRNDto>;
  readonly mode: formType;
  readonly setValue: UseFormSetValue<CreateGRNDto>;
}

export default function ItemGrn({ control, mode, setValue }: ItemGrnProps) {
  const tCommon = useTranslations("Common");
  const [search, setSearch] = useState("");
  const isDisabled = mode === formType.VIEW;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
  const [visibleItems, setVisibleItems] = useState<
    (GoodReceivedNoteDetailItemDto & { id?: string })[]
  >([]);
  const [bulkAction, setBulkAction] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] =
    useState<GoodReceivedNoteDetailItemDto | null>(null);

  const { getUnitName } = useUnit();
  const { getLocationName } = useStoreLocation();
  const { getProductName } = useProduct();

  const watchedInitData = useWatch({
    control,
    name: "good_received_note_detail.initData",
  });

  const initData = useMemo(() => watchedInitData ?? [], [watchedInitData]);

  const {
    fields: addFields,
    append: appendToAdd,
    remove: removeFromAdd,
  } = useFieldArray({
    control,
    name: "good_received_note_detail.add",
  });

  const { append: appendToUpdate } = useFieldArray({
    control,
    name: "good_received_note_detail.update",
  });

  useEffect(() => {
    const initialVisibleItems = initData.filter(
      (item) => !itemsToDelete.includes(item.id ?? "")
    );
    setVisibleItems([...initialVisibleItems, ...addFields]);
  }, [initData, addFields, itemsToDelete]);

  const filteredItems = visibleItems.filter((item) => {
    const productName = getProductName(item.product_id) ?? "";
    const locationName = getLocationName(item.location_id) ?? "";
    const searchLower = search.toLowerCase();
    return (
      productName.toLowerCase().includes(searchLower) ||
      locationName.toLowerCase().includes(searchLower)
    );
  });

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      const allIds = filteredItems.map((item) => item.id).filter(Boolean);
      setSelectedItems(allIds as string[]);
    }
  };

  useEffect(() => {
    setBulkAction(selectedItems.length > 0);
  }, [selectedItems]);

  const handleSaveItem = (
    itemData: GoodReceivedNoteDetailItemDto,
    action: "add" | "update"
  ) => {
    if (action === "add") {
      appendToAdd(itemData);
    } else if (action === "update") {
      appendToUpdate(itemData);
    }
    setEditItem(null);
    setDialogOpen(false);
  };

  const handleRowClick = (item: GoodReceivedNoteDetailItemDto) => {
    if (mode !== formType.VIEW) {
      setEditItem(item);
      setDialogOpen(true);
    }
  };

  const handleEditClick = (
    e: React.MouseEvent,
    item: GoodReceivedNoteDetailItemDto
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setEditItem(item);
    setDialogOpen(true);
  };

  const handleAddNewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditItem(null);
    setDialogOpen(true);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    item: GoodReceivedNoteDetailItemDto
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item.id) return;
    const addIndex = addFields.findIndex((field) => field.id === item.id);
    if (addIndex > -1) {
      removeFromAdd(addIndex);
    } else {
      const newItemsToDelete = [...itemsToDelete, item.id];
      setItemsToDelete(newItemsToDelete);
      setValue("good_received_note_detail.delete", newItemsToDelete, {
        shouldValidate: true,
      });
    }
  };

  const isAllSelected =
    filteredItems.length > 0 && selectedItems.length === filteredItems.length;

  return (
    <Card>
      <CardHeader className="p-4">
        <p className="text-sm font-medium px-2">Items Details</p>

        <div
          className={`flex flex-row items-center ${bulkAction ? "justify-between" : "justify-end"}`}
        >
          {bulkAction && (
            <div className="flex flex-row items-center justify-between gap-1">
              <Button size="sm">
                <CheckCircle className="h-3 w-3" />
                Approve
              </Button>
              <Button variant="outline" size="sm">
                <XCircle className="h-3 w-3" />
                Reject
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-3 w-3" />
                Review
              </Button>
              <Button variant="outline" size="sm">
                <Split className="h-3 w-3" />
                Split
              </Button>
            </div>
          )}

          <div className="flex flex-row items-center gap-1">
            <SearchInput
              defaultValue={search}
              onSearch={setSearch}
              placeholder={tCommon("search")}
              data-id="grn-item-search-input"
              containerClassName="w-full"
            />
            <Button size="sm" type="button">
              <Filter className="h-3 w-3" />
              Filter
            </Button>
            {!isDisabled && (
              <Button size="sm" type="button" onClick={handleAddNewClick}>
                <Plus className="h-3 w-3" />
                Add Item
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <DialogItemGrnForm
          mode={mode}
          onAddItem={handleSaveItem}
          initialData={editItem}
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
        />
        <Table>
          <TableHeader className="bg-muted/80">
            <TableRow>
              {!isDisabled && (
                <TableHead className="w-10">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onClick={handleSelectAll}
                    aria-label="Select all items"
                  />
                </TableHead>
              )}
              <TableHead>Location</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Ordered</TableHead>
              <TableHead className="text-right">Received</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead>Expired Date</TableHead>
              {!isDisabled && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={!isDisabled ? 9 : 7}
                  className="h-24 text-center"
                >
                  No items added yet.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className={!isDisabled ? "cursor-pointer" : ""}
                >
                  {!isDisabled && (
                    <TableCell
                      className="w-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        id={`checkbox-${item.id}`}
                        checked={selectedItems.includes(item.id ?? "")}
                        onClick={() => item.id && handleSelectItem(item.id)}
                        aria-label={`Select ${getProductName(item.product_id)}`}
                      />
                    </TableCell>
                  )}
                  <TableCell>{getLocationName(item.location_id)}</TableCell>
                  <TableCell>
                    <p>{getProductName(item.product_id)}</p>
                    <p className="text-xs text-muted-foreground">{item.note}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <p>
                      {item.order_qty} {getUnitName(item.order_unit_id ?? "")}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <p>
                      {item.received_qty}{" "}
                      {getUnitName(item.received_unit_id ?? "")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Base: {item.base_qty}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">{item.price}</TableCell>
                  <TableCell className="text-right">
                    {item.total_cost}
                  </TableCell>
                  <TableCell>
                    {item.expired_date
                      ? format(new Date(item.expired_date), "dd MMM yyyy")
                      : "-"}
                  </TableCell>
                  {!isDisabled && (
                    <TableCell className="text-right">
                      <div
                        className="flex justify-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          type="button"
                          variant="ghost"
                          onClick={(e) => handleEditClick(e, item)}
                          className="h-8 w-8"
                          disabled={isDisabled}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          type="button"
                          variant="ghost"
                          onClick={(e) => handleDeleteClick(e, item)}
                          className="h-8 w-8"
                          disabled={!item.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
