import { UseFormReturn, FieldArrayWithId } from "react-hook-form";
import { DeletionTarget } from "./page";
import { PrFormValue, Product } from "./mock-pr";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import clsx from "clsx";

type FormPath = "items.add" | "items.update";

interface FormDisplayProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: FieldArrayWithId<PrFormValue, any, "id">[];
    form: UseFormReturn<PrFormValue>;
    formPath: FormPath;
    allProducts: Product[];
    selectedProductIds: Set<string>;
    isViewMode: boolean;
    itemClassName?: string;
    handleProductSelect: (
        productId: string,
        context: { type: "add" | "update"; index: number }
    ) => void;
    setDeletionTarget: (target: DeletionTarget | null) => void;
}

export default function FormDisplay({
    fields,
    form,
    formPath,
    allProducts,
    selectedProductIds,
    isViewMode,
    itemClassName,
    handleProductSelect,
    setDeletionTarget,
}: FormDisplayProps) {
    const contextType = formPath === 'items.add' ? 'add' : 'update';

    return (
        <>
            {fields.map((field, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const availableProducts = allProducts.filter(p => !selectedProductIds.has(p.id) || p.id === (field as any).product_id);
                return (
                    <div key={field.id} className={clsx("flex gap-2 items-start p-2 border rounded-md", itemClassName)}>
                        <div className="grid grid-cols-3 gap-2 flex-grow">
                            <FormField
                                control={form.control}
                                name={`${formPath}.${index}.product_id`}
                                render={({ field: selectField }) => (
                                    <FormItem>
                                        <FormLabel>Product</FormLabel>
                                        <Select
                                            onValueChange={(value) => handleProductSelect(value, { type: contextType, index })}
                                            value={selectField.value}
                                            disabled={isViewMode}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a product" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableProducts.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`${formPath}.${index}.quantity`}
                                render={({ field: quantityField }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...quantityField}
                                                onChange={e => quantityField.onChange(Number(e.target.value))}
                                                disabled={isViewMode}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`${formPath}.${index}.unit`}
                                render={({ field: unitField }) => (
                                    <FormItem>
                                        <FormLabel>Unit</FormLabel>
                                        <FormControl>
                                            <Input {...unitField} disabled />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => setDeletionTarget({ type: contextType, index })}
                            disabled={isViewMode}
                            aria-label="Remove Item"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            })}
        </>
    );
}