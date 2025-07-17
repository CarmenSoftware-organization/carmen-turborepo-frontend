import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableCell, TableRow } from "@/components/ui/table";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import { CheckCircleIcon, X } from "lucide-react";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLookup from "@/components/lookup/ProductLookup";
import UnitLookup from "@/components/lookup/UnitLookup";
import NumberInput from "@/components/form-custom/NumberInput";

interface EditableRowProps {
    tempEditData: PurchaseRequestDetailItem;
    onUpdate: (field: keyof PurchaseRequestDetailItem, value: any) => void;
    onConfirm: () => void;
    onCancel: () => void;
    isReadOnly: boolean;
    index: number;
}

/**
 * EditableRow component
 * 
 * Provides form inputs for editing a purchase request item
 * Includes confirm/cancel buttons and real-time data updates
 */
export default function EditableRow({
    tempEditData,
    onUpdate,
    onConfirm,
    onCancel,
    isReadOnly,
    index,
}: EditableRowProps) {
    return (
        <TableRow key={tempEditData.id || tempEditData.tempId || index}>
            <TableCell>
                <Checkbox />
            </TableCell>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="w-[150px]">
                <LocationLookup
                    value={tempEditData?.location_id || ""}
                    disabled={isReadOnly}
                    onValueChange={(value) => onUpdate("location_id", value)}
                />
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <ProductLookup
                        value={tempEditData?.product_id || ""}
                        onValueChange={(value) => onUpdate("product_id", value)}
                        disabled={isReadOnly}
                    />
                    <Input
                        value={tempEditData?.description || ""}
                        onChange={(e) => onUpdate("description", e.target.value)}
                        placeholder="Description"
                        className="text-xs h-8"
                    />
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1">
                    <NumberInput
                        value={tempEditData?.requested_qty || 0}
                        onChange={(value) => onUpdate("requested_qty", value)}
                    />
                    <UnitLookup
                        value={tempEditData?.requested_unit_id || ""}
                        onValueChange={(value) => onUpdate("requested_unit_id", value)}
                        disabled={isReadOnly}
                    />
                </div>
            </TableCell>
            <TableCell className="space-y-1">
                <div className="flex items-center gap-1">
                    <NumberInput
                        value={tempEditData?.approved_qty || 0}
                        onChange={(value) => onUpdate("approved_qty", value)}
                    />
                    <UnitLookup
                        value={tempEditData?.approved_unit_id || ""}
                        onValueChange={(value) => onUpdate("approved_unit_id", value)}
                        disabled={isReadOnly}
                    />
                </div>
                <div className="flex items-center gap-1">
                    <Label>FOC</Label>
                    <NumberInput
                        value={tempEditData?.foc_qty || 0}
                        onChange={(value) => onUpdate("foc_qty", value)}
                    />
                    <UnitLookup
                        value={tempEditData?.foc_unit_id || ""}
                        onValueChange={(value) => onUpdate("foc_unit_id", value)}
                        disabled={isReadOnly}
                    />
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1">
                    <CurrencyLookup
                        value={tempEditData?.currency_id || ""}
                        onValueChange={(value) => onUpdate("currency_id", value)}
                        disabled={isReadOnly}
                    />
                    <NumberInput
                        value={tempEditData?.price || 0}
                        onChange={(value) => onUpdate("price", value)}
                    />
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={onConfirm}
                        className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                        title="ยืนยัน"
                    >
                        <CheckCircleIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onCancel}
                        className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
                        title="ยกเลิก"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}