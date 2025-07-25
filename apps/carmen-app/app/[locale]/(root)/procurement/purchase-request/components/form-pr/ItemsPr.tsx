import { UseFormReturn } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestCreateFormDto, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Package, Plus, Trash2 } from "lucide-react";
import LocationLookup from "@/components/lookup/LocationLookup";
import FormDisplay from "./FormDisplay";
import { UpdatableItem, DeletionTarget } from "./MainForm";
import { motion } from "framer-motion";
import { buttonVariants, fadeVariants, slideUpVariants } from "@/utils/framer-variants";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/hooks/useCurrency";
import { useAuth } from "@/context/AuthContext";
import ViewItems from "./ViewItems";

interface ItemsPrProps {
    form: UseFormReturn<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>;
    currentFormType: formType;
    updatableItems: UpdatableItem[];
    selectedProductIds: Set<string>;
    addFields: any[];
    updateFields: any[];
    handleAddNewItem: () => void;
    handleProductSelect: (
        productId: string,
        context: { type: "add" | "update"; index: number } | { type: "pristine"; item: UpdatableItem }
    ) => void;
    setDeletionTarget: (target: DeletionTarget | null) => void;
}

export default function ItemsPr({
    form,
    currentFormType,
    updatableItems,
    selectedProductIds,
    addFields,
    updateFields,
    handleAddNewItem,
    handleProductSelect,
    setDeletionTarget,
}: ItemsPrProps) {
    const isViewMode = currentFormType === formType.VIEW;
    const { getCurrencyCode } = useCurrency();
    const { currencyBase } = useAuth();
    return (
        <div className="space-y-4">
            <motion.div
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">Purchase Request Items</h3>
                    </div>
                    {!isViewMode && (
                        <motion.div
                            variants={buttonVariants}
                            initial="idle"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button
                                variant="outline"
                                onClick={handleAddNewItem}
                                className="text-sm px-3 py-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Item
                            </Button>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Pristine Items (Only in Edit mode) */}
            {currentFormType === formType.EDIT &&
                updatableItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        variants={slideUpVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            ease: "easeOut"
                        }}
                        className="flex gap-2 items-start p-2 border rounded-md border-dashed bg-blue-50/50 hover:bg-blue-50 transition-colors"
                    >
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <LocationLookup
                                            value={item.location_id}
                                            onValueChange={(value) => {
                                                handleProductSelect(value, { type: 'pristine', item });
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <motion.div
                            variants={buttonVariants}
                            initial="idle"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button
                                variant="ghost"
                                onClick={() => setDeletionTarget({ type: 'pristine', item })}
                                className="h-10 w-10 p-0 text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </motion.div>
                ))}

            {/* View mode items (read-only) */}
            <ViewItems
                updatableItems={updatableItems}
                getCurrencyCode={getCurrencyCode}
                currencyName={currencyBase?.name}
            />

            {/* Updated Items */}
            <FormDisplay
                fields={updateFields}
                form={form}
                formPath="purchase_request_detail.update"
                selectedProductIds={selectedProductIds}
                isViewMode={isViewMode}
                handleProductSelect={handleProductSelect}
                setDeletionTarget={setDeletionTarget}
            />

            {/* Added Items */}
            <FormDisplay
                fields={addFields}
                form={form}
                formPath="purchase_request_detail.add"
                selectedProductIds={selectedProductIds}
                isViewMode={isViewMode}
                itemClassName="bg-green-50"
                handleProductSelect={handleProductSelect}
                setDeletionTarget={setDeletionTarget}
            />
        </div>
    );
}