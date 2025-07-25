import { UseFormReturn, FieldArrayWithId } from "react-hook-form";
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
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { DeletionTarget } from "./MainForm";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLookup from "@/components/lookup/ProductLookup";
import { motion } from "framer-motion";
import { slideUpVariants, buttonVariants } from "@/utils/framer-variants";

type FormPath = "purchase_request_detail.add" | "purchase_request_detail.update";

interface FormDisplayProps {
    fields: FieldArrayWithId<any, any, "id">[];
    form: UseFormReturn<any>;
    formPath: FormPath;
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
    selectedProductIds,
    isViewMode,
    itemClassName,
    handleProductSelect,
    setDeletionTarget,
}: FormDisplayProps) {
    const contextType = formPath === 'purchase_request_detail.add' ? 'add' : 'update';

    return (
        <>
            {fields.map((field, index) => {
                return (
                    <motion.div
                        key={field.id}
                        variants={slideUpVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            ease: "easeOut"
                        }}
                        className={clsx(
                            "flex gap-2 items-start p-2 border rounded-md transition-all hover:shadow-md",
                            itemClassName,
                            contextType === "add" && "hover:bg-green-50/70"
                        )}
                    >
                        <div className="grid grid-cols-4 gap-2 flex-grow">
                            <FormField
                                control={form.control}
                                name={`${formPath}.${index}.location_id` as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <LocationLookup
                                                value={field.value || ""}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                }}
                                                disabled={isViewMode}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`${formPath}.${index}.product_id` as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product</FormLabel>
                                        <FormControl>
                                            <ProductLookup
                                                value={field.value || ""}
                                                onValueChange={(value) => {
                                                    handleProductSelect(value, { type: contextType, index });
                                                }}
                                                disabled={isViewMode}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`${formPath}.${index}.requested_qty` as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(Number(e.target.value))}
                                                disabled={isViewMode}
                                                className="transition-all focus:ring-2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`${formPath}.${index}.description` as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isViewMode}
                                                placeholder="Item description"
                                                className="transition-all focus:ring-2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <motion.div
                            variants={buttonVariants}
                            initial="idle"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button
                                variant="ghost"
                                onClick={() => setDeletionTarget({ type: contextType, index })}
                                disabled={isViewMode}
                                className="h-10 w-10 p-0 text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </motion.div>
                );
            })}
        </>
    );
}