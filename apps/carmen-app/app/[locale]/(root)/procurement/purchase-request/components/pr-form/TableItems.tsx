import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/useCurrency";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import { formType } from "@/dtos/form.dto";
import TableItemsHeader from "./TableItemsHeader";
import ReadonlyRow from "./ReadonlyRow";
import EditableRow from "./EditableRow";
import ItemDetailAccordion from "./ItemDetailAccordion";
import React from "react";

interface TableItemsProps {
  readonly prItems: PurchaseRequestDetailItem[];
  readonly isReadOnly: boolean;
  readonly onItemsChange: (items: PurchaseRequestDetailItem[]) => void;
  readonly onDeletedIdsChange: (ids: string[]) => void;
  readonly mode: formType;
}

/**
 * TableItems component
 * 
 * Main container component for purchase request items table
 * Manages state and orchestrates child components
 */
export default function TableItems({
  prItems,
  isReadOnly,
  onItemsChange,
  onDeletedIdsChange,
  mode,
}: TableItemsProps) {
  const { getCurrencyCode } = useCurrency();

  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [tempEditData, setTempEditData] =
    useState<PurchaseRequestDetailItem | null>(null);

  // Function สำหรับเพิ่มรายการใหม่
  const handleAddNewItem = () => {
    const newItem: PurchaseRequestDetailItem = {
      id: undefined,
      tempId: `new-${Date.now()}`,
      location_id: "",
      location_name: "",
      product_id: "",
      product_name: "",
      vendor_id: "",
      vendor_name: "",
      price_list_id: "",
      pricelist_detail_id: "",
      description: "",
      requested_qty: 0,
      requested_unit_id: "",
      requested_unit_name: "",
      requested_unit_conversion_factor: 0,
      approved_qty: 0,
      approved_unit_id: "",
      approved_unit_name: "",
      approved_unit_conversion_factor: 0,
      approved_base_qty: 0,
      requested_base_qty: 0,
      inventory_unit_id: "",
      currency_id: "",
      currency_name: "",
      exchange_rate: 1,
      exchange_rate_date: new Date().toISOString(),
      price: 0,
      total_price: 0,
      foc_qty: 0,
      foc_unit_id: "",
      foc_unit_name: "",
      tax_profile_id: "",
      tax_profile_name: "",
      tax_rate: 0,
      tax_amount: 0,
      is_tax_adjustment: false,
      discount_rate: 0,
      discount_amount: 0,
      is_discount_adjustment: false,
      delivery_date: new Date().toISOString(),
      delivery_point_id: "",
      delivery_point_name: "",
      comment: "",
      isNew: true,
      isModified: false,
    };

    const newItems = [...prItems, newItem];
    onItemsChange(newItems);
    setEditingRowIndex(prItems.length);
    setTempEditData(newItem);
  };

  // Function สำหรับเริ่มการแก้ไขรายการ
  const handleStartEdit = (index: number) => {
    setEditingRowIndex(index);
    setTempEditData({ ...prItems[index] });
  };

  // Function สำหรับอัปเดตข้อมูลชั่วคราว
  const handleUpdateTempData = (
    field: keyof PurchaseRequestDetailItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    if (tempEditData) {
      const updatedData = { ...tempEditData, [field]: value };

      // คำนวณราคารวมถ้าเป็นการเปลี่ยน quantity หรือ price
      if (field === "requested_qty" || field === "price") {
        const qty =
          field === "requested_qty" ? value : tempEditData.requested_qty;
        const price = field === "price" ? value : tempEditData.price;
        updatedData.total_price = qty * price;
      }

      setTempEditData(updatedData);
    }
  };

  // Function สำหรับยืนยันการแก้ไข
  const handleConfirmEdit = () => {
    if (editingRowIndex !== null && tempEditData) {
      const newItems = prItems.map((item, i) => {
        if (i === editingRowIndex) {
          const updatedItem = { ...tempEditData };
          // Mark เป็น modified ถ้าไม่ใช่รายการใหม่
          if (!item.isNew) {
            updatedItem.isModified = true;
          }
          return updatedItem;
        }
        return item;
      });

      onItemsChange(newItems);
      setEditingRowIndex(null);
      setTempEditData(null);
    }
  };

  // Function สำหรับยกเลิกการแก้ไข
  const handleCancelEdit = () => {
    if (editingRowIndex !== null && tempEditData?.isNew) {
      // ถ้าเป็นรายการใหม่ที่ยังไม่ได้ confirm ให้ลบออก
      const newItems = prItems.filter((_, i) => i !== editingRowIndex);
      onItemsChange(newItems);
    }
    setEditingRowIndex(null);
    setTempEditData(null);
  };

  // Function สำหรับลบรายการ
  const handleDeleteItem = (index: number) => {
    const item = prItems[index];

    // ถ้าเป็นรายการที่มี id (คือรายการเก่า) ให้เก็บ id ไว้ใน deletedItemIds
    if (item.id) {
      const newDeletedIds = [...deletedItemIds, item.id];
      setDeletedItemIds(newDeletedIds);
      onDeletedIdsChange(newDeletedIds);
    }

    // ลบรายการออกจาก prItems
    const newItems = prItems.filter((_, i) => i !== index);
    onItemsChange(newItems);

    // ถ้ากำลังแก้ไขรายการที่ลบ ให้ reset editing state
    if (editingRowIndex === index) {
      setEditingRowIndex(null);
      setTempEditData(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Purchase Request Items</h3>
          <Badge variant={'secondary'}>{prItems.length} Items</Badge>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isReadOnly}
          onClick={handleAddNewItem}
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {prItems.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableItemsHeader />
            <TableBody>
              {prItems.map((item, index) => (
                <React.Fragment key={item.id || item.tempId || index}>
                  {editingRowIndex === index ? (
                    <EditableRow
                      tempEditData={tempEditData!}
                      onUpdate={handleUpdateTempData}
                      onConfirm={handleConfirmEdit}
                      onCancel={handleCancelEdit}
                      isReadOnly={isReadOnly}
                      index={index}
                    />
                  ) : (
                    <ReadonlyRow
                      item={item}
                      index={index}
                      getCurrencyCode={getCurrencyCode}
                      onEdit={() => handleStartEdit(index)}
                      onDelete={() => handleDeleteItem(index)}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  <ItemDetailAccordion
                    index={index}
                    item={item}
                    mode={mode}
                    onUpdate={handleUpdateTempData}
                  />
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No items found
        </div>
      )}
    </div>
  );
}