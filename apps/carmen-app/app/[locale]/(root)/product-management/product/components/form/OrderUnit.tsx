import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, SquarePen, Plus, Trash, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

interface OrderUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
    readonly initialValues?: OrderUnitInitialValues;
}

interface OrderUnitInitialValues {
    order_units?: OrderUnitValueItem[];
}

interface OrderUnitValueItem {
    id: string;
    from_unit_id: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_qty: number;
    description?: string;
    is_active?: boolean;
    is_default?: boolean;
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
    remove: { product_order_unit_id: string }[];
}

interface UnitDataDto {
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
        <TableCell className="text-left w-24 font-medium">
            {orderUnit.from_unit_qty} {getUnitName(orderUnit.from_unit_id)}
        </TableCell>
        <TableCell className="text-left w-28">
            {orderUnit.to_unit_qty} {getUnitName(orderUnit.to_unit_id)}
        </TableCell>
        <TableCell className="text-left">
            <Switch
                checked={orderUnit.is_default}
                disabled
            />
        </TableCell>
        <TableCell className="text-left w-28">
            <div>
                <p className="text-xs font-medium">{`1 ${getUnitName(orderUnit.from_unit_id)} = ${orderUnit.to_unit_qty} ${getUnitName(orderUnit.to_unit_id)}`}</p>
                <p className="text-muted-foreground text-[11px]">{`Qty x ${orderUnit.to_unit_qty}`}</p>
            </div>
        </TableCell>
        {currentMode !== formType.VIEW && (
            <TableCell className="text-right">
                <div className="flex items-center justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        aria-label="Edit order unit"
                        className="h-7 w-7"
                    >
                        <SquarePen className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 text-destructive hover:text-destructive/80"
                                aria-label="Remove order unit"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl">Remove Order Unit</AlertDialogTitle>
                                <AlertDialogDescription className="space-y-2 text-gray-600">
                                    Are you sure you want to remove this order unit?
                                    <div className="mt-2 p-4 space-y-1.5 text-sm">
                                        <div><span className="font-semibold">From Unit:</span> {getUnitName(orderUnit.from_unit_id)}</div>
                                        <div><span className="font-semibold">To Unit:</span> {getUnitName(orderUnit.to_unit_id)}</div>
                                        <div><span className="font-semibold">Description:</span> {orderUnit.description ?? '-'}</div>
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2 mt-4">
                                <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onRemove} className="bg-red-600">
                                    Remove
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableCell>
        )}
    </>
);

const EditableRow = ({
    editForm,
    onSave,
    onCancel,
    setEditForm,
    getUnitName,
    filteredUnits
}: {
    editForm: OrderUnitData | null;
    onSave: () => void;
    onCancel: () => void;
    setEditForm: React.Dispatch<React.SetStateAction<OrderUnitData | null>>;
    getUnitName: (id: string) => string;
    filteredUnits: UnitDataDto[];
}) => {
    const [conversionPreview, setConversionPreview] = useState<{ unitRatio: string; qtyMultiplier: string }>({
        unitRatio: '',
        qtyMultiplier: ''
    });

    useEffect(() => {
        if (editForm?.from_unit_id && editForm?.to_unit_id) {
            setConversionPreview({
                unitRatio: `1 ${getUnitName(editForm.from_unit_id)} = ${editForm.to_unit_qty} ${getUnitName(editForm.to_unit_id)}`,
                qtyMultiplier: `Qty x ${editForm.to_unit_qty}`
            });
        }
    }, [editForm?.from_unit_id, editForm?.to_unit_id, editForm?.to_unit_qty, getUnitName]);

    const handleFieldChange = (field: keyof OrderUnitData, value: string | number | boolean) => {
        if (!editForm) return;

        const updatedForm = { ...editForm, [field]: value };
        setEditForm(updatedForm);

        // Auto-update to_unit_qty based from from_unit changes
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
            <TableCell className="text-left w-24">
                <div className="flex items-center gap-1">
                    <p className="text-xs font-medium">{editForm?.from_unit_qty ?? 1}</p>

                    <Select
                        value={editForm?.from_unit_id ?? ""}
                        onValueChange={(value) => handleFieldChange('from_unit_id', value)}
                    >
                        <SelectTrigger className="w-20 h-7">
                            <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredUnits.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id ?? ""}>
                                    {unit.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </TableCell>
            <TableCell className="text-left w-28">
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        value={editForm?.to_unit_qty ?? 1}
                        onChange={(e) => handleFieldChange('to_unit_qty', Number(e.target.value))}
                        className="w-16 h-7"
                        min={1}
                    />
                    <p className="text-xs font-medium">
                        {getUnitName(editForm?.to_unit_id ?? "")}
                    </p>
                </div>
            </TableCell>
            <TableCell className="text-left">
                <Switch
                    checked={editForm?.is_default}
                    onCheckedChange={() => handleFieldChange('is_default', !editForm?.is_default)}
                />
            </TableCell>
            <TableCell className="text-left w-28">
                {editForm?.from_unit_id && editForm?.to_unit_id ? (
                    <div>
                        <p className="text-xs font-medium">{conversionPreview.unitRatio}</p>
                        <p className="text-muted-foreground text-[11px]">{conversionPreview.qtyMultiplier}</p>
                    </div>
                ) : ''}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onSave}
                        className="h-7 w-7 text-green-500 hover:text-green-500/80"
                        aria-label="Save changes"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        className="h-7 w-7 text-destructive hover:text-destructive/80"
                        aria-label="Cancel edit"
                    >
                        <X className="h-4 w-4" />
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
    const inventoryUnitId = watch("inventory_unit_id");

    const { fields: orderUnitFields, append: appendOrderUnit, remove: removeOrderUnit } = useFieldArray({
        control,
        name: "order_units.add"
    });

    // Initialize form data from initialValues if available
    useEffect(() => {
        if (initialValues?.order_units && Array.isArray(initialValues.order_units)) {
            // Transform array format to the expected form format
            const formattedOrderUnits = {
                data: initialValues.order_units.map((unit) => ({
                    id: unit.id,
                    from_unit_id: unit.from_unit_id,
                    from_unit_qty: unit.from_unit_qty ?? 1,
                    to_unit_id: unit.to_unit_id,
                    to_unit_qty: unit.to_unit_qty ?? 1,
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

    const filteredUnits: UnitDataDto[] = units
        .filter((unit) => !!unit.id) // Only include units with an id
        .filter((unit) => {
            if (unit.id === inventoryUnitId) return false;
            const otherOrderUnits = existingOrderUnits.filter(ou =>
                ou.id !== editingId // Skip the currently edited order unit
            );
            const existingFromUnitIds = otherOrderUnits.map(ou => ou.from_unit_id || "");
            return !existingFromUnitIds.includes(unit.id ?? "");
        }) as UnitDataDto[];


    // Auto-initialize and calculate order unit values
    useEffect(() => {
        // Get the current fields from watch directly inside the effect
        const currentAddFields = watch("order_units.add") || [];

        currentAddFields.forEach((field, index) => {
            // Always ensure from_unit_id is set to inventoryUnitId
            if (inventoryUnitId && (!field.from_unit_id || field.from_unit_id === "")) {
                setValue(`order_units.add.${index}.from_unit_id`, inventoryUnitId);
            }

            const fromUnitId = field.from_unit_id || inventoryUnitId || "";
            const toUnitId = field.to_unit_id;

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
    }, [watch, inventoryUnitId, setValue]);

    const { append: appendOrderUnitRemove } = useFieldArray({
        control,
        name: "order_units.remove"
    });

    const { append: appendOrderUnitUpdate } = useFieldArray({
        control,
        name: "order_units.update"
    });

    const displayOrderUnits = existingOrderUnits.filter(
        orderUnit => !removedOrderUnits.some(removed => removed.product_order_unit_id === orderUnit.id)
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

            // Check if this order unit is already in the update array
            const existingUpdateIndex = currentOrderUnits.update?.findIndex(
                (item) => item.product_order_unit_id === orderUnit.id
            );

            // Create updated order_units object with the correct update array
            const updatedOrderUnits = { ...currentOrderUnits };
            updatedOrderUnits.data = updatedData;

            // If already in update array, replace it; otherwise append it
            if (existingUpdateIndex !== undefined && existingUpdateIndex >= 0) {
                updatedOrderUnits.update = [
                    ...(currentOrderUnits.update?.slice(0, existingUpdateIndex) || []),
                    updatedOrderUnit,
                    ...(currentOrderUnits.update?.slice(existingUpdateIndex + 1) || [])
                ];
            } else {
                updatedOrderUnits.update = [
                    ...(currentOrderUnits.update || []),
                    updatedOrderUnit
                ];
            }

            // Update the form state
            setValue("order_units", updatedOrderUnits);
        } else {
            // Add to update array if data array doesn't exist
            appendOrderUnitUpdate(updatedOrderUnit);
        }

        setEditingId(null);
        setEditForm(null);
    };


    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Order Units</h2>
                {currentMode !== formType.VIEW && (
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                            appendOrderUnit({
                                from_unit_id: "",
                                from_unit_qty: 1,
                                to_unit_id: inventoryUnitId,
                                to_unit_qty: 1,
                                description: "",
                                is_active: true,
                                is_default: false
                            });
                        }}
                        className="flex items-center gap-1.5 px-3"
                        disabled={!inventoryUnitId}
                    >
                        <Plus className="h-4 w-4" />
                        Add Order Unit
                    </Button>
                )}
            </div>

            {/* Order Units Table */}
            {hasOrderUnits ? (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="text-left w-24 font-medium">Order Unit</TableHead>
                                <TableHead className="text-left w-28 font-medium">Qty</TableHead>
                                <TableHead className="text-left w-20 font-medium">Default</TableHead>
                                <TableHead className="text-left w-28 font-medium">Conversion</TableHead>
                                {currentMode !== formType.VIEW && <TableHead className="text-right w-20 font-medium">Actions</TableHead>}
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
                                            getUnitName={getUnitName}
                                            filteredUnits={filteredUnits}
                                        />
                                    ) : (
                                        <DisplayRow
                                            orderUnit={orderUnit}
                                            onEdit={() => handleStartEdit(orderUnit)}
                                            onRemove={() => appendOrderUnitRemove({ product_order_unit_id: orderUnit.id! })}
                                            currentMode={currentMode}
                                            getUnitName={getUnitName}
                                        />
                                    )}
                                </TableRow>
                            ))}

                            {/* New Order Units */}
                            {orderUnitFields.map((field, index) => {
                                const currentToUnitQty = watch(`order_units.add.${index}.to_unit_qty`) || 1;
                                const currentFromUnitId = watch(`order_units.add.${index}.from_unit_id`) || "";
                                const currentToUnitId = watch(`order_units.add.${index}.to_unit_id`) || inventoryUnitId || "";

                                return (
                                    <TableRow key={field.id}>
                                        <TableCell className="text-left w-24">
                                            <div className="flex items-center gap-1">
                                                <FormField
                                                    control={control}
                                                    name={`order_units.add.${index}.from_unit_qty`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>

                                                                <>
                                                                    <p className="text-xs font-medium">
                                                                        {field.value}
                                                                    </p>
                                                                    <input
                                                                        type="hidden"
                                                                        {...field}
                                                                        value={field.value}
                                                                    />
                                                                </>

                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={control}
                                                    name={`order_units.add.${index}.from_unit_id`}
                                                    render={({ field }) => (
                                                        <FormItem >
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={(value) => {
                                                                        field.onChange(value);
                                                                    }}
                                                                    value={field.value}
                                                                >
                                                                    <SelectTrigger className="w-20 h-7">
                                                                        <SelectValue placeholder="Unit" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {filteredUnits.map((unit) => (
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
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-left w-28">
                                            <div className="flex items-center gap-2">
                                                <FormField
                                                    control={control}
                                                    name={`order_units.add.${index}.to_unit_qty`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    className="w-20 h-7"
                                                                    min={1}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={control}
                                                    name={`order_units.add.${index}.to_unit_id`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <>
                                                                    <p className="text-xs font-medium">
                                                                        {getUnitName(field.value || inventoryUnitId || "")}
                                                                    </p>
                                                                    <input
                                                                        type="hidden"
                                                                        {...field}
                                                                        value={field.value || inventoryUnitId || ""}
                                                                    />
                                                                </>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                            </div>

                                        </TableCell>
                                        <TableCell className="text-left">
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
                                        <TableCell className="text-left w-28">
                                            {currentFromUnitId && currentToUnitId ? (
                                                <div>
                                                    <p className="text-xs font-medium">{`1 ${getUnitName(currentFromUnitId)} = ${currentToUnitQty} ${getUnitName(currentToUnitId)}`}</p>
                                                    <p className="text-muted-foreground text-[11px]">{`Qty x ${currentToUnitQty}`}</p>
                                                </div>
                                            ) : ''}
                                        </TableCell>
                                        {currentMode === formType.EDIT && (
                                            <TableCell className="text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeOrderUnit(index)}
                                                    className="text-red-500 rounded-full p-2"
                                                    aria-label="Remove order unit"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    {!inventoryUnitId ? (
                        <p className="text-gray-500 mb-4">Please select inventory unit first</p>
                    ) : (
                        <p className="text-gray-500 mb-4">No order units defined yet</p>
                    )}
                </div>
            )}
        </Card>
    );
}
