import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, PenIcon, Plus, Trash, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUnit } from "@/hooks/useUnit";
import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";

interface OrderUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
    readonly initialValues?: any;
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

interface UnitData {
    id?: string;
    name: string;
    description?: string;
    is_active?: boolean;
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
        <TableCell className="text-right w-32">
            {orderUnit.to_unit_qty} {getUnitName(orderUnit.to_unit_id)}
        </TableCell>
        {/* <TableCell>
            <Badge variant="secondary" className={orderUnit.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {orderUnit.is_active ? 'Active' : 'Inactive'}
            </Badge>
        </TableCell> */}
        <TableCell>
            <Switch
                checked={orderUnit.is_default}
            />
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
    editForm,
    onSave,
    onCancel,
    setEditForm,
    units,
    inventoryUnitId
}: {
    editForm: OrderUnitData | null;
    onSave: () => void;
    onCancel: () => void;
    setEditForm: React.Dispatch<React.SetStateAction<OrderUnitData | null>>;
    units: UnitData[];
    inventoryUnitId?: string;
}) => {
    const handleFieldChange = (field: keyof OrderUnitData, value: string | number | boolean) => {
        if (!editForm) return;

        const updatedForm = { ...editForm, [field]: value };
        setEditForm(updatedForm);

        // Auto-update to_unit_qty based on from_unit changes
        if (field === 'from_unit_id' || field === 'from_unit_qty' || field === 'to_unit_id') {
            const { from_unit_id, to_unit_id, from_unit_qty } = updatedForm;

            // Only proceed if all required values are set
            if (from_unit_id && to_unit_id && from_unit_qty) {
                // Check if units are the same
                if (from_unit_id === to_unit_id) {
                    setEditForm({
                        ...updatedForm,
                        to_unit_qty: from_unit_qty
                    });
                } else if (field === 'from_unit_id' || field === 'from_unit_qty' || field === 'to_unit_id') {
                    // If we're directly changing unit-related fields and to_unit_qty is 0, set a default
                    if (updatedForm.to_unit_qty === 0) {
                        setEditForm({
                            ...updatedForm,
                            to_unit_qty: 1
                        });
                    }
                }
            }
        }
    };

    return (
        <>
            <TableCell>
                <Select
                    value={editForm?.from_unit_id}
                    onValueChange={(value) => {
                        // First update the from_unit_id
                        handleFieldChange('from_unit_id', value);

                        // If to_unit_id is empty or equals from_unit_id, try to use inventory_unit_id
                        if (editForm && inventoryUnitId && inventoryUnitId !== value) {
                            if (!editForm.to_unit_id || editForm.to_unit_id === editForm.from_unit_id) {
                                handleFieldChange('to_unit_id', inventoryUnitId);
                            }
                        }
                    }}
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
            {/* <TableCell>
                <Badge
                    variant="secondary"
                    className={editForm?.is_active ? 'bg-green-100 text-green-800 cursor-pointer' : 'bg-gray-100 text-gray-800 cursor-pointer'}
                    onClick={() => handleFieldChange('is_active', !editForm?.is_active)}
                >
                    {editForm?.is_active ? 'Active' : 'Inactive'}
                </Badge>
            </TableCell> */}
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

export default function OrderUnit({ control, currentMode, initialValues }: OrderUnitProps) {
    const { units } = useUnit();
    const { watch, setValue } = useFormContext<ProductFormValues>();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<OrderUnitData | null>(null);
    const orderUnits = watch("order_units") as OrderUnitsFormData;
    const existingOrderUnits = orderUnits?.data || [];
    const newOrderUnits = watch("order_units.add") || [];
    const removedOrderUnits = watch("order_units.remove") || [];

    const { fields: orderUnitFields, append: appendOrderUnit, remove: removeOrderUnit } = useFieldArray({
        control,
        name: "order_units.add"
    });

    // Initialize form data from initialValues if available
    useEffect(() => {
        if (initialValues?.order_units && Array.isArray(initialValues.order_units)) {
            // Transform array format to the expected form format
            const formattedOrderUnits = {
                data: initialValues.order_units.map((unit: any) => ({
                    id: unit.id,
                    from_unit_id: unit.from_unit_id,
                    from_unit_qty: unit.from_unit_qty,
                    to_unit_id: unit.to_unit_id,
                    to_unit_qty: unit.to_unit_qty,
                    description: unit.description ?? '',
                    is_active: unit.is_active ?? true,
                    is_default: unit.is_default ?? false
                })),
                add: [],
                remove: [],
                update: []
            };

            setValue("order_units", formattedOrderUnits);
        }
    }, [initialValues, setValue]);

    // Auto-initialize and calculate order unit values
    useEffect(() => {
        // Get the current fields from watch since orderUnitFields might be stale
        const currentAddFields = watch("order_units.add") || [];
        const inventoryUnitId = watch("inventory_unit_id");

        currentAddFields.forEach((field, index) => {
            const fromUnitId = field.from_unit_id;
            const toUnitId = field.to_unit_id;

            // If from_unit_id is set but to_unit_id is empty, use inventory_unit_id
            if (fromUnitId && !toUnitId && inventoryUnitId && fromUnitId !== inventoryUnitId) {
                setValue(`order_units.add.${index}.to_unit_id`, inventoryUnitId);
            }

            // Calculate to_unit_qty if both units are set
            if (fromUnitId && toUnitId) {
                const fromUnitQty = field.from_unit_qty;

                // If units are the same, match quantities
                if (fromUnitId === toUnitId) {
                    setValue(`order_units.add.${index}.to_unit_qty`, fromUnitQty);
                } else if (field.to_unit_qty === 0) {
                    // For different units, set a default value if to_unit_qty is 0
                    setValue(`order_units.add.${index}.to_unit_qty`, 1);
                }
            }
        });
    }, [watch, setValue]);

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

        // If to_unit_id is empty, pre-fill with inventory_unit_id
        if (!orderUnit.to_unit_id) {
            const inventoryUnitId = watch("inventory_unit_id");
            if (inventoryUnitId && inventoryUnitId !== orderUnit.from_unit_id) {
                orderUnit = {
                    ...orderUnit,
                    to_unit_id: inventoryUnitId
                };
            }
        }

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
                    onClick={() => {
                        const inventoryUnitId = watch("inventory_unit_id");
                        appendOrderUnit({
                            from_unit_id: "",
                            from_unit_qty: 1,
                            to_unit_id: inventoryUnitId || "",
                            to_unit_qty: 0,
                            description: "",
                            is_active: true,
                            is_default: false
                        });
                    }}
                    disabled={currentMode === formType.VIEW}
                >
                    <Plus />
                    Add Order Unit
                </Button>
            </div>

            {/* Order Units Table */}
            {hasOrderUnits && (
                <Table className="rounded-t-lg">
                    <TableHeader className="bg-muted">
                        <TableRow >
                            <TableHead>Order Unit</TableHead>
                            <TableHead>Conversion Factor</TableHead>
                            {/* <TableHead>Status</TableHead> */}
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
                                        editForm={editForm}
                                        onSave={() => handleSaveEdit(orderUnit)}
                                        onCancel={() => {
                                            setEditingId(null);
                                            setEditForm(null);
                                        }}
                                        setEditForm={setEditForm}
                                        units={units}
                                        inventoryUnitId={watch("inventory_unit_id")}
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
                                                    <Select
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                        }}
                                                        value={field.value}
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

                                {/* <TableCell>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        Active
                                    </Badge>
                                </TableCell> */}
                                <TableCell>
                                    <FormField
                                        control={control}
                                        name={`order_units.add.${index}.is_default`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
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
