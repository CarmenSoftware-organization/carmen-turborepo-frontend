"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formType } from "@/dtos/form.dto";
import { SrCreate, SrDetailItemDto } from "@/dtos/sr.dto";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useState, useCallback } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ItemStoreRequisitionProps {
  readonly mode: formType;
  readonly form: UseFormReturn<SrCreate>;
  readonly itemsSr?: SrDetailItemDto[];
}

interface NewItemRowProps {
  readonly index: number;
  readonly displayIndex: number;
  readonly form: UseFormReturn<SrCreate>;
  readonly isEditing: boolean;
  readonly mode: formType;
  readonly onToggleEdit: (index: number) => void;
  readonly onRemove: (index: number) => void;
}

function OriginalItemRow({
  item,
  displayIndex,
}: {
  item: SrDetailItemDto;
  displayIndex: number;
}) {
  return (
    <TableRow>
      <TableCell>{displayIndex}</TableCell>
      <TableCell>{item.product_name || item.product_id || "-"}</TableCell>
      <TableCell>{item.description || "-"}</TableCell>
      <TableCell>{item.requested_qty}</TableCell>
      <TableCell>{item.current_stage_status || "-"}</TableCell>
    </TableRow>
  );
}

function NewItemRow({
  index,
  displayIndex,
  form,
  isEditing,
  mode,
  onToggleEdit,
  onRemove,
}: NewItemRowProps) {
  const isViewMode = mode === formType.VIEW;

  return (
    <TableRow>
      <TableCell>{displayIndex}</TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`details.store_requisition_detail.add.${index}.product_id`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <Input {...field} placeholder="Product ID" />
                </FormControl>
              ) : (
                <span>{field.value || "-"}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`details.store_requisition_detail.add.${index}.description`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <Input {...field} placeholder="Description" />
                </FormControl>
              ) : (
                <span>{field.value || "-"}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`details.store_requisition_detail.add.${index}.requested_qty`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="Qty"
                  />
                </FormControl>
              ) : (
                <span>{field.value}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`details.store_requisition_detail.add.${index}.current_stage_status`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <Input {...field} placeholder="Status" />
                </FormControl>
              ) : (
                <span>{field.value || "-"}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      {!isViewMode && (
        <TableCell>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onToggleEdit(index)}>
              {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={() => onRemove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

export default function ItemStoreRequisition({
  mode,
  form,
  itemsSr = [],
}: ItemStoreRequisitionProps) {
  const [editingRows, setEditingRows] = useState<Set<number>>(new Set());

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details.store_requisition_detail.add",
  });

  const handleAdd = useCallback(() => {
    const newIndex = fields.length;
    append({
      description: "",
      current_stage_status: "submit",
      product_id: "",
      requested_qty: 1,
    });
    setEditingRows((prev) => new Set(prev).add(newIndex));
  }, [fields.length, append]);

  const handleToggleEdit = useCallback((index: number) => {
    setEditingRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
      setEditingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        const updatedSet = new Set<number>();
        newSet.forEach((idx) => {
          if (idx > index) {
            updatedSet.add(idx - 1);
          } else {
            updatedSet.add(idx);
          }
        });
        return updatedSet;
      });
    },
    [remove]
  );

  const isViewMode = mode === formType.VIEW;
  const originalItemsCount = itemsSr.length;
  const hasNoItems = itemsSr.length === 0 && fields.length === 0;

  return (
    <Card className="p-2 space-y-2">
      <div className="flex justify-between items-center p-2">
        <p className="text-base font-medium">Items</p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={isViewMode}
            onClick={handleAdd}
          >
            <Plus />
            Add Item
          </Button>
        </div>
      </div>
      <Table className="border">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Requested Qty</TableHead>
            <TableHead>Status</TableHead>
            {!isViewMode && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasNoItems ? (
            <TableRow>
              <TableCell
                colSpan={isViewMode ? 5 : 6}
                className="text-center text-muted-foreground py-4"
              >
                No items
              </TableCell>
            </TableRow>
          ) : (
            <>
              {/* Original items from API (read-only display) */}
              {itemsSr.map((item, index) => (
                <OriginalItemRow
                  key={item.id}
                  item={item}
                  displayIndex={index + 1}
                />
              ))}
              {/* New items (editable via form) */}
              {fields.map((field, index) => (
                <NewItemRow
                  key={field.id}
                  index={index}
                  displayIndex={originalItemsCount + index + 1}
                  form={form}
                  isEditing={editingRows.has(index)}
                  mode={mode}
                  onToggleEdit={handleToggleEdit}
                  onRemove={handleRemove}
                />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
