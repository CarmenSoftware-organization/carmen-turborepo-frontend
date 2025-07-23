import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PurchaseRequestCreateFormDto, PurchaseRequestDetail, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { Plus } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Fragment, useState } from "react";
import ItemDetailAccordion from "./ItemDetailAccordion";
import { formType } from "@/dtos/form.dto";
import PrItemBody from "./PrItemBody";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { newPrItem } from "./helpers";

interface ItemDetailProps {
    readonly form: UseFormReturn<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>;
    readonly initItems?: PurchaseRequestDetail[];
    readonly mode: formType;
}

export default function ItemDetail({ form, initItems, mode }: ItemDetailProps) {
    const [newItems, setNewItems] = useState<PurchaseRequestDetail[]>([]);
    const [deletedExistingItemIds, setDeletedExistingItemIds] = useState<string[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{
        item: PurchaseRequestDetail;
        index: number;
        isNewItem: boolean;
    } | null>(null);

    const { fields: addFields, append: appendAdd } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.add" as any,
    });

    const { fields: removeFields, append: appendRemove } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.remove" as any,
    });

    const handleAddItem = () => {
        // เพิ่ม field ใหม่ใน form
        appendAdd({
            location_id: "",
            product_id: "",
            inventory_unit_id: "",
            description: "",
            requested_qty: 0,
            requested_unit_id: "",
            delivery_point_id: "",
            delivery_date: "",
        });

        // เพิ่ม item ใหม่ใน local state เพื่อแสดงใน UI

        setNewItems(prev => [...prev, newPrItem]);
    };

    const handleDeleteRequest = (item: PurchaseRequestDetail, index: number) => {
        const isNewItem = item.id?.startsWith('temp-') || false;
        setItemToDelete({ item, index, isNewItem });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        const { item, index, isNewItem } = itemToDelete;

        if (isNewItem) {
            // ลบจาก newItems state และ form array
            setNewItems(prev => prev.filter((_, i) => i !== index));

            // ลบจาก form add array
            const currentAddArray = form.getValues("purchase_request_detail.add") || [];
            const updatedAddArray = currentAddArray.filter((_, i) => i !== index);
            form.setValue("purchase_request_detail.add", updatedAddArray);
        } else {
            // ส่งไป purchase_request_detail.remove สำหรับ existing items
            if (item.id && !item.id.startsWith('temp-')) {
                appendRemove({ id: item.id });
                // เพิ่มเข้า local state เพื่อซ่อนจาก UI
                setDeletedExistingItemIds(prev => [...prev, item.id]);
            }
        }

        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    // กรอง existing items ที่ยังไม่ถูกลบ
    const filteredInitItems = initItems?.filter(item =>
        item.id && !deletedExistingItemIds.includes(item.id)
    ) || [];

    const allItems = [...filteredInitItems, ...newItems];
    const totalItemsCount = allItems.length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Purchase Request Items</h3>
                    <Badge variant={'secondary'}>{totalItemsCount} Items</Badge>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddItem}
                >
                    <Plus className="h-4 w-4" />
                    Add Item
                </Button>
            </div>
            {allItems && allItems.length > 0 ? (
                <div className="overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[20px]">
                                    <Checkbox />
                                </TableHead>
                                <TableHead className="w-[20px] font-semibold">#</TableHead>
                                <TableHead className="w-[150px] font-semibold">Location & Status</TableHead>
                                <TableHead className="w-[150px] font-semibold">Product</TableHead>
                                <TableHead className="w-[100px] text-right font-semibold">Requested</TableHead>
                                <TableHead className="w-[40px] text-right font-semibold">Approved</TableHead>
                                <TableHead className="w-[100px] text-right font-semibold">Price</TableHead>
                                <TableHead className="w-[120px] text-right font-semibold">More</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* แสดง existing items */}
                            {filteredInitItems?.map((item, index) => (
                                <Fragment key={item.id || index}>
                                    <PrItemBody
                                        item={item}
                                        mode={mode}
                                        index={index}
                                        form={form}
                                        onDelete={(item, idx) => handleDeleteRequest(item, idx)}
                                    />
                                    <ItemDetailAccordion
                                        index={index}
                                        item={item}
                                        mode={mode}
                                        form={form}
                                    />
                                </Fragment>
                            ))}
                            {/* แสดง new items ที่เพิ่มใหม่ */}
                            {newItems.map((item, index) => {
                                const adjustedIndex = (filteredInitItems?.length || 0) + index;
                                return (
                                    <Fragment key={item.id || `new-${index}`}>
                                        <PrItemBody
                                            item={item}
                                            mode={formType.ADD}
                                            index={index}
                                            form={form}
                                            onDelete={(item, idx) => handleDeleteRequest(item, idx)}
                                        />
                                        <ItemDetailAccordion
                                            index={adjustedIndex}
                                            item={item}
                                            mode={formType.ADD}
                                            form={form}
                                        />
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                    {/* <pre>{JSON.stringify(allItems, null, 2)}</pre> */}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No items found
                </div>
            )}

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}