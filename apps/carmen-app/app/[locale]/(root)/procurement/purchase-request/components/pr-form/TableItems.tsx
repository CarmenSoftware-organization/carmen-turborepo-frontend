import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircleIcon,
  Pencil,
  X,
} from "lucide-react";
import { useState } from "react";

// เพิ่ม type definition
interface PurchaseRequestDetailItem {
  id?: string;
  tempId?: string;
  location_id: string;
  location_name?: string;
  product_id: string;
  product_name?: string;
  vendor_id: string;
  vendor_name?: string;
  price_list_id: string;
  pricelist_detail_id?: string;
  description: string;
  requested_qty: number;
  requested_unit_id: string;
  requested_unit_name?: string;
  requested_unit_conversion_factor?: number;
  approved_qty: number;
  approved_unit_id: string;
  approved_unit_name?: string;
  approved_unit_conversion_factor?: number;
  approved_base_qty: number;
  requested_base_qty: number;
  inventory_unit_id?: string;
  currency_id: string;
  currency_name?: string;
  exchange_rate: number;
  exchange_rate_date: string;
  price: number;
  total_price: number;
  foc_qty: number;
  foc_unit_id: string;
  foc_unit_name?: string;
  tax_profile_id?: string;
  tax_profile_name?: string;
  tax_rate: number;
  tax_amount: number;
  is_tax_adjustment: boolean;
  discount_rate: number;
  discount_amount: number;
  is_discount_adjustment: boolean;
  delivery_date: string;
  delivery_point_id: string;
  delivery_point_name?: string;
  comment: string;
  isNew?: boolean;
  isModified?: boolean;
}

interface TableItemsProps {
  readonly prItems: PurchaseRequestDetailItem[];
  readonly isReadOnly: boolean;
  readonly onItemsChange: (items: PurchaseRequestDetailItem[]) => void;
  readonly onDeletedIdsChange: (ids: string[]) => void;
}

export default function TableItems({
  prItems,
  isReadOnly,
  onItemsChange,
  onDeletedIdsChange,
}: TableItemsProps) {
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">รายการสินค้า</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isReadOnly}
          onClick={handleAddNewItem}
        >
          เพิ่มรายการ
        </Button>
      </div>

      {prItems.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">สถานที่</TableHead>
                <TableHead className="w-[200px]">สินค้า</TableHead>
                <TableHead className="w-[150px]">ผู้ขาย</TableHead>
                <TableHead className="w-[100px]">จำนวน</TableHead>
                <TableHead className="w-[100px]">หน่วย</TableHead>
                <TableHead className="w-[100px]">ราคา</TableHead>
                <TableHead className="w-[100px]">รวม</TableHead>
                <TableHead className="w-[200px]">รายละเอียด</TableHead>
                <TableHead className="w-[120px]">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prItems.map((item, index) => (
                <TableRow
                  key={item.id || item.tempId || index}
                  className={
                    editingRowIndex === index ? "bg-blue-50" : ""
                  }
                >
                  {editingRowIndex === index ? (
                    // Edit Mode
                    <>
                      {/* Location */}
                      <TableCell>
                        <Input
                          value={tempEditData?.location_name || ""}
                          onChange={(e) =>
                            handleUpdateTempData(
                              "location_name",
                              e.target.value
                            )
                          }
                          placeholder="สถานที่"
                          className="text-sm h-8 border-blue-300 focus:border-blue-500"
                        />
                      </TableCell>

                      {/* Product */}
                      <TableCell>
                        <Input
                          value={tempEditData?.product_name || ""}
                          onChange={(e) =>
                            handleUpdateTempData(
                              "product_name",
                              e.target.value
                            )
                          }
                          placeholder="สินค้า"
                          className="text-sm h-8 border-blue-300 focus:border-blue-500"
                        />
                      </TableCell>

                      {/* Vendor */}
                      <TableCell>
                        <Input
                          value={tempEditData?.vendor_name || ""}
                          onChange={(e) =>
                            handleUpdateTempData(
                              "vendor_name",
                              e.target.value
                            )
                          }
                          placeholder="ผู้ขาย"
                          className="text-sm h-8 border-blue-300 focus:border-blue-500"
                        />
                      </TableCell>

                      {/* Quantity */}
                      <TableCell>
                        <Input
                          type="number"
                          value={
                            tempEditData?.requested_qty.toString() ||
                            "0"
                          }
                          onChange={(e) =>
                            handleUpdateTempData(
                              "requested_qty",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="จำนวน"
                          className="text-sm h-8 border-blue-300 focus:border-blue-500"
                        />
                      </TableCell>

                      {/* Unit */}
                      <TableCell>
                        <Input
                          value={
                            tempEditData?.requested_unit_name || ""
                          }
                          onChange={(e) =>
                            handleUpdateTempData(
                              "requested_unit_name",
                              e.target.value
                            )
                          }
                          placeholder="หน่วย"
                          className="text-sm h-8 border-blue-300 focus:border-blue-500"
                        />
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        <Input
                          type="number"
                          value={
                            tempEditData?.price.toString() || "0"
                          }
                          onChange={(e) =>
                            handleUpdateTempData(
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="ราคา"
                          className="text-sm h-8 border-blue-300 focus:border-blue-500"
                        />
                      </TableCell>

                      {/* Total Price */}
                      <TableCell>
                        <Input
                          type="number"
                          value={
                            tempEditData?.total_price.toString() ||
                            "0"
                          }
                          readOnly
                          placeholder="รวม"
                          className="text-sm h-8 bg-gray-100 border-gray-300"
                        />
                      </TableCell>

                      {/* Description */}
                      <TableCell>
                        <Input
                          value={tempEditData?.description || ""}
                          onChange={(e) =>
                            handleUpdateTempData(
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="รายละเอียด"
                          className="text-sm h-8 border-blue-300 focus:border-blue-500"
                        />
                      </TableCell>

                      {/* Actions - Edit Mode */}
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={handleConfirmEdit}
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                            title="ยืนยัน"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
                            title="ยกเลิก"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    // View Mode
                    <>
                      {/* Location */}
                      <TableCell>
                        <div className="text-sm">
                          {item.location_name || "-"}
                        </div>
                      </TableCell>

                      {/* Product */}
                      <TableCell>
                        <div className="text-sm">
                          {item.product_name || "-"}
                        </div>
                      </TableCell>

                      {/* Vendor */}
                      <TableCell>
                        <div className="text-sm">
                          {item.vendor_name || "-"}
                        </div>
                      </TableCell>

                      {/* Quantity */}
                      <TableCell>
                        <div className="text-sm text-right">
                          {item.requested_qty}
                        </div>
                      </TableCell>

                      {/* Unit */}
                      <TableCell>
                        <div className="text-sm">
                          {item.requested_unit_name || "-"}
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        <div className="text-sm text-right">
                          {item.price.toLocaleString()}
                        </div>
                      </TableCell>

                      {/* Total Price */}
                      <TableCell>
                        <div className="text-sm text-right font-medium">
                          {item.total_price.toLocaleString()}
                        </div>
                      </TableCell>

                      {/* Description */}
                      <TableCell>
                        <div className="text-sm">
                          {item.description || "-"}
                        </div>
                      </TableCell>

                      {/* Actions - View Mode */}
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isReadOnly}
                            onClick={() => handleStartEdit(index)}
                            className="h-8 w-8 p-0 border-blue-300 text-blue-600 hover:bg-blue-50"
                            title="แก้ไข"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isReadOnly}
                                className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
                                title="ลบ"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ยืนยันการลบ
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  คุณต้องการลบรายการนี้หรือไม่?
                                  การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  ยกเลิก
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteItem(index)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  ลบ
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          ไม่มีรายการสินค้า
        </div>
      )}
    </div>
  );
}