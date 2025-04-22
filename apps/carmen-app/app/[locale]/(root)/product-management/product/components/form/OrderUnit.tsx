import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, PenIcon, Plus, Trash, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUnit } from "@/hooks/useUnit";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";

interface OrderUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

interface OrderUnitData {
    id?: string;
    from_unit_id: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_qty: number;
    description: string;
    is_active: boolean;
    is_default: boolean;
}

interface OrderUnitFormData {
    description: string;
    is_active: boolean;
    from_unit_id: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_qty: number;
    is_default: boolean;
}

interface OrderUnitsFormData {
    data: OrderUnitData[];
    add: OrderUnitFormData[];
    update: {
        product_order_unit_id: string;
        from_unit_id: string;
        from_unit_qty: number;
        to_unit_id: string;
        to_unit_qty: number;
        description: string;
        is_active: boolean;
        is_default: boolean;
    }[];
    remove: { id: string }[];
}

const DisplayRow = ({ orderUnit, onEdit, onRemove, currentMode, getUnitName }: {
    orderUnit: OrderUnitData;
    onEdit: () => void;
    onRemove: () => void;
    currentMode: formType;
    getUnitName: (id: string) => string;
}) => (
    <>
        <TableCell>{getUnitName(orderUnit.from_unit_id)}</TableCell>
        <TableCell>{orderUnit.from_unit_qty}</TableCell>
        <TableCell>{getUnitName(orderUnit.to_unit_id)}</TableCell>
        <TableCell>{orderUnit.to_unit_qty}</TableCell>
        <TableCell>
            <Badge variant="secondary" className={orderUnit.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {orderUnit.is_active ? 'Active' : 'Inactive'}
            </Badge>
        </TableCell>
        <TableCell>
            <Badge variant="secondary" className={orderUnit.is_default ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                {orderUnit.is_default ? 'Default' : 'Not Default'}
            </Badge>
        </TableCell>
        <TableCell>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onEdit}
                disabled={currentMode === formType.VIEW}
            >
                <PenIcon className="h-4 w-4" />
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        disabled={currentMode === formType.VIEW}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Order Unit</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p>Are you sure you want to remove this order unit?</p>
                            <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                                <p><span className="font-semibold">From Unit:</span> {getUnitName(orderUnit.from_unit_id)}</p>
                                <p><span className="font-semibold">To Unit:</span> {getUnitName(orderUnit.to_unit_id)}</p>
                                <p><span className="font-semibold">Description:</span> {orderUnit.description ?? '-'}</p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onRemove}>
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TableCell>
    </>
);

const EditableRow = ({
    orderUnit,
    editForm,
    onSave,
    onCancel,
    setEditForm,
    units
}: {
    orderUnit: OrderUnitData;
    editForm: OrderUnitData | null;
    onSave: () => void;
    onCancel: () => void;
    setEditForm: React.Dispatch<React.SetStateAction<OrderUnitData | null>>;
    units: any[];
}) => {
    const handleFieldChange = (field: keyof OrderUnitData, value: any) => {
        if (!editForm) return;
        setEditForm({ ...editForm, [field]: value });
    };

    return (
        <>
            <TableCell>
                <Select
                    value={editForm?.from_unit_id}
                    onValueChange={(value) => handleFieldChange('from_unit_id', value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id ?? ""}>
                                {unit.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    className="w-[100px]"
                    value={editForm?.from_unit_qty}
                    onChange={(e) => handleFieldChange('from_unit_qty', Number(e.target.value))}
                />
            </TableCell>
            <TableCell>
                <Select
                    value={editForm?.to_unit_id}
                    onValueChange={(value) => handleFieldChange('to_unit_id', value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id ?? ""}>
                                {unit.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    className="w-[100px]"
                    value={editForm?.to_unit_qty}
                    onChange={(e) => handleFieldChange('to_unit_qty', Number(e.target.value))}
                />
            </TableCell>
            <TableCell>
                <Badge
                    variant="secondary"
                    className={editForm?.is_active ? 'bg-green-100 text-green-800 cursor-pointer' : 'bg-gray-100 text-gray-800 cursor-pointer'}
                    onClick={() => handleFieldChange('is_active', !editForm?.is_active)}
                >
                    {editForm?.is_active ? 'Active' : 'Inactive'}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant="secondary"
                    className={editForm?.is_default ? 'bg-blue-100 text-blue-800 cursor-pointer' : 'bg-gray-100 text-gray-800 cursor-pointer'}
                    onClick={() => handleFieldChange('is_default', !editForm?.is_default)}
                >
                    {editForm?.is_default ? 'Default' : 'Not Default'}
                </Badge>
            </TableCell>
            <TableCell>
                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onSave}
                    >
                        <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                    >
                        <X className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            </TableCell>
        </>
    );
};

export default function OrderUnit({ control, currentMode }: OrderUnitProps) {
    const { units } = useUnit();
    const { watch, setValue } = useFormContext<ProductFormValues>();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<OrderUnitData | null>(null);
    const orderUnits = watch("order_units") as { data: OrderUnitData[]; add: OrderUnitData[]; update: any[]; remove: { id: string }[] };
    const existingOrderUnits = orderUnits?.data || [];
    const newOrderUnits = watch("order_units.add") || [];
    const removedOrderUnits = watch("order_units.remove") || [];

    const { fields: orderUnitFields, append: appendOrderUnit, remove: removeOrderUnit } = useFieldArray({
        control,
        name: "order_units.add"
    });

    const { append: appendOrderUnitRemove } = useFieldArray({
        control,
        name: "order_units.remove"
    });

    const { append: appendOrderUnitUpdate } = useFieldArray({
        control,
        name: "order_units.update"
    });

    // Filter out removed order units
    const displayOrderUnits = existingOrderUnits.filter(
        orderUnit => !removedOrderUnits.some(removed => removed.id === orderUnit.id)
    );

    const hasOrderUnits = displayOrderUnits.length > 0 || newOrderUnits.length > 0;

    const getUnitName = (unitId: string) => {
        return units.find(unit => unit.id === unitId)?.name ?? '-';
    };

    const handleStartEdit = (orderUnit: OrderUnitData) => {
        setEditingId(orderUnit.id ?? null);
        setEditForm(orderUnit);
    };

    const handleSaveEdit = (orderUnit: OrderUnitData) => {
        if (!editForm || !orderUnit.id) return;

        const updatedOrderUnit = {
            product_order_unit_id: orderUnit.id,
            from_unit_id: editForm.from_unit_id,
            from_unit_qty: editForm.from_unit_qty,
            to_unit_id: editForm.to_unit_id,
            to_unit_qty: editForm.to_unit_qty,
            description: editForm.description ?? '',
            is_active: editForm.is_active ?? true,
            is_default: editForm.is_default ?? false
        };

        // Update the form state
        const currentOrderUnits = watch("order_units") as OrderUnitsFormData;
        if (currentOrderUnits?.data) {
            // Update the data array for UI
            const updatedData = currentOrderUnits.data.map((item: OrderUnitData) =>
                item.id === orderUnit.id
                    ? {
                        ...item,
                        from_unit_id: editForm.from_unit_id,
                        from_unit_qty: editForm.from_unit_qty,
                        to_unit_id: editForm.to_unit_id,
                        to_unit_qty: editForm.to_unit_qty,
                        description: editForm.description ?? '',
                        is_active: editForm.is_active ?? true,
                        is_default: editForm.is_default ?? false
                    }
                    : item
            );

            // Update the form state
            setValue("order_units", {
                add: [],
                remove: currentOrderUnits.remove || [],
                update: [...(currentOrderUnits.update || []), updatedOrderUnit]
            });

            // Force update the display data
            const newOrderUnits = { ...currentOrderUnits };
            newOrderUnits.data = updatedData;
            setValue("order_units", newOrderUnits);
        }

        appendOrderUnitUpdate(updatedOrderUnit);
        setEditingId(null);
        setEditForm(null);
    };

    return (
        <div className="rounded-lg border p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Order Units</h2>
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => appendOrderUnit({
                        from_unit_id: "",
                        from_unit_qty: 0,
                        to_unit_id: "",
                        to_unit_qty: 0,
                        description: "",
                        is_active: true,
                        is_default: false
                    })}
                    disabled={currentMode === formType.VIEW}
                >
                    <Plus />
                    Add Order Unit
                </Button>
            </div>

            {/* Order Units Table */}
            {hasOrderUnits && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>From Unit</TableHead>
                            <TableHead>From Qty</TableHead>
                            <TableHead>To Unit</TableHead>
                            <TableHead>To Qty</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Default</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Existing Order Units */}
                        {displayOrderUnits.map((orderUnit) => (
                            <TableRow key={orderUnit.id}>
                                {editingId === orderUnit.id ? (
                                    <EditableRow
                                        orderUnit={orderUnit}
                                        editForm={editForm}
                                        onSave={() => handleSaveEdit(orderUnit)}
                                        onCancel={() => {
                                            setEditingId(null);
                                            setEditForm(null);
                                        }}
                                        setEditForm={setEditForm}
                                        units={units}
                                    />
                                ) : (
                                    <DisplayRow
                                        orderUnit={orderUnit}
                                        onEdit={() => handleStartEdit(orderUnit)}
                                        onRemove={() => appendOrderUnitRemove({ id: orderUnit.id! })}
                                        currentMode={currentMode}
                                        getUnitName={getUnitName}
                                    />
                                )}
                            </TableRow>
                        ))}

                        {/* New Order Units */}
                        {orderUnitFields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`order_units.add.${index}.from_unit_id`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Select unit" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {units.map((unit) => (
                                                                <SelectItem key={unit.id} value={unit.id ?? ""}>
                                                                    {unit.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`order_units.add.${index}.from_unit_qty`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        className="w-[100px]"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`order_units.add.${index}.to_unit_id`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Select unit" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {units.map((unit) => (
                                                                <SelectItem key={unit.id} value={unit.id ?? ""}>
                                                                    {unit.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`order_units.add.${index}.to_unit_qty`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        className="w-[100px]"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        Active
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`order_units.add.${index}.is_default`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <FormControl>
                                                    <Badge
                                                        variant="secondary"
                                                        className={field.value ? 'bg-blue-100 text-blue-800 cursor-pointer' : 'bg-gray-100 text-gray-800 cursor-pointer'}
                                                        onClick={() => field.onChange(!field.value)}
                                                    >
                                                        {field.value ? 'Default' : 'Not Default'}
                                                    </Badge>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeOrderUnit(index)}
                                        className="text-destructive"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
