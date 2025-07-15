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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircleIcon,
  MapPin,
  MoreHorizontal,
  Package,
  Plus,
  SendIcon,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useCurrency } from "@/hooks/useCurrency";
import { DropdownMenuSeparator, DropdownMenuItem, DropdownMenuLabel, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import OnHandAndOrder from "./OnHandAndOrder";
import PricingCard from "./PricingCard";
import VendorFields from "./VendorFields";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import BusinessDimensions from "./BusinessDimensions";
import { formType } from "@/dtos/form.dto";
import ProductLookup from "@/components/lookup/ProductLookup";
import LocationLookup from "@/components/lookup/LocationLookup";
import UnitLookup from "@/components/lookup/UnitLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import { Label } from "@/components/ui/label";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";

interface TableItemsProps {
  readonly prItems: PurchaseRequestDetailItem[];
  readonly isReadOnly: boolean;
  readonly onItemsChange: (items: PurchaseRequestDetailItem[]) => void;
  readonly onDeletedIdsChange: (ids: string[]) => void;
  readonly mode: formType;
}

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
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20px]">
                  <Checkbox />
                </TableHead>
                <TableHead className="w-[20px] font-semibold">#</TableHead>
                <TableHead className="w-[150px] font-semibold">Location & Status</TableHead>
                <TableHead className="w-[150px] font-semibold">Product</TableHead>
                {/* <TableHead className="w-[150px]">Vendor</TableHead> */}
                <TableHead className="w-[100px] text-right font-semibold">Requested</TableHead>
                <TableHead className="w-[40px] text-right font-semibold">Approved</TableHead>
                <TableHead className="w-[100px] text-right font-semibold">Price</TableHead>
                {/* <TableHead className="w-[100px]">Total</TableHead>
                <TableHead className="w-[200px]">Description</TableHead> */}
                <TableHead className="w-[120px] text-right font-semibold">More</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prItems.map((item, index) => (
                <>
                  <TableRow
                    key={item.id || item.tempId || index}
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    {editingRowIndex === index ? (
                      // Edit Mode
                      <>
                        <TableCell className="w-[150px]">
                          <LocationLookup
                            value={tempEditData?.location_id || ""}
                            disabled={isReadOnly}
                            onValueChange={(value) =>
                              handleUpdateTempData(
                                "location_id",
                                value
                              )
                            }
                          />
                        </TableCell>

                        {/* Product */}
                        <TableCell>

                          <div className="flex flex-col gap-1">
                            <ProductLookup
                              value={tempEditData?.product_id || ""}
                              onValueChange={(value) =>
                                handleUpdateTempData(
                                  "product_id",
                                  value
                                )
                              }
                              disabled={isReadOnly}
                            />
                            <Input
                              value={tempEditData?.description || ""}
                              onChange={(e) =>
                                handleUpdateTempData(
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Description"
                              className="text-xs h-8"
                            />
                          </div>

                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <NumberInput
                              value={tempEditData?.requested_qty || 0}
                              onChange={(value) =>
                                handleUpdateTempData(
                                  "requested_qty",
                                  value
                                )
                              }
                            />

                            <UnitLookup
                              value={tempEditData?.requested_unit_id || ""}
                              onValueChange={(value) =>
                                handleUpdateTempData(
                                  "requested_unit_id",
                                  value
                                )
                              }
                              disabled={isReadOnly}
                            />
                          </div>
                        </TableCell>

                        {/* Approved */}
                        <TableCell className="space-y-1">
                          <div className="flex items-center gap-1">
                            <NumberInput
                              value={tempEditData?.requested_qty || 0}
                              onChange={(value) =>
                                handleUpdateTempData(
                                  "approved_qty",
                                  value
                                )
                              }
                            />

                            <UnitLookup
                              value={tempEditData?.approved_unit_id || ""}
                              onValueChange={(value) =>
                                handleUpdateTempData(
                                  "approved_unit_id",
                                  value
                                )
                              }
                              disabled={isReadOnly}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <Label>FOC</Label>
                            <NumberInput
                              value={tempEditData?.foc_qty || 0}
                              onChange={(value) =>
                                handleUpdateTempData(
                                  "foc_qty",
                                  value
                                )
                              }
                            />
                            <UnitLookup
                              value={tempEditData?.foc_unit_id || ""}
                              onValueChange={(value) =>
                                handleUpdateTempData(
                                  "foc_unit_id",
                                  value
                                )
                              }
                              disabled={isReadOnly}
                            />
                          </div>
                        </TableCell>

                        {/* Price */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CurrencyLookup
                              value={tempEditData?.currency_id || ""}
                              onValueChange={(value) =>
                                handleUpdateTempData("currency_id", value)
                              }
                              disabled={isReadOnly}
                            />
                            <NumberInput
                              value={tempEditData?.price || 0}
                              onChange={(value) =>
                                handleUpdateTempData("price", value)
                              }
                            />
                          </div>

                        </TableCell>
                        {/* Actions - Edit Mode */}
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
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
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <p className="text-sm font-medium">{item.location_name || "-"}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Wait API
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            <p className="text-sm font-medium">{item.product_name || "-"}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="text-sm text-right font-semibold">
                            {item.requested_qty}  {item.requested_unit_name || "-"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            (= {item.requested_base_qty} {item.inventory_unit_name || "-"} )
                          </p>
                        </TableCell>
                        <TableCell className="w-[40px] text-right">
                          <p className="text-sm text-right font-semibold">
                            {item.approved_qty}  {item.approved_unit_name || "-"}
                          </p>
                          <Separator />
                          <p className="text-xs font-semibold text-blue-500">
                            FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="text-sm text-right font-semibold">
                            {getCurrencyCode(item.currency_id)}  {item.price.toFixed(2)}
                          </p>
                          <p className="text-xs font-semibold text-blue-500">
                            THB {item.base_price || 0}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="cursor-pointer">
                              <DropdownMenuLabel>
                                <div className="flex items-center gap-2 text-green-500">
                                  <CheckCircleIcon className="h-4 w-4" />
                                  <p className="text-sm font-semibold">Approve Item</p>
                                </div>
                              </DropdownMenuLabel>
                              <DropdownMenuLabel>
                                <div className="flex items-center gap-2 text-yellow-500">
                                  <SendIcon className="h-4 w-4" />
                                  <p className="text-sm font-semibold">Send for Review</p>
                                </div>
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleStartEdit(index)}
                              >
                                <div className="flex items-center gap-2">
                                  <SquarePen className="h-4 w-4" />
                                  <p className="text-sm font-semibold">Edit</p>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                              >
                                <div className="flex items-center text-destructive">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <div className="flex items-center gap-2 text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                        <p className="text-sm font-semibold">Delete</p>
                                      </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Confirm Delete
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this item?
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteItem(index)
                                          }
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                        </TableCell>
                      </>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`item-${index}`}>
                          <div className="flex items-center gap-4 w-full px-2 py-2">
                            <AccordionTrigger
                              iconPosition="left"
                              className="p-0 h-5"
                            />

                            <div className="flex items-center gap-2 bg-blue-50 p-2 w-full border-l-4 border-blue-500">
                              <p className="text-sm text-blue-500">
                                {item.comment ? item.comment : "No comment"}
                              </p>
                            </div>
                          </div>
                          <OnHandAndOrder />
                          <Separator />
                          <VendorFields item={item} />
                          <AccordionContent className="p-4 space-y-4 bg-muted">
                            <BusinessDimensions />
                            <PricingCard
                              item={item}
                              onItemUpdate={handleUpdateTempData}
                              mode={mode}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                </>
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