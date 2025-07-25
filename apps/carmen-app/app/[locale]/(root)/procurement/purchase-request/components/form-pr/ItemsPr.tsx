import { UseFormReturn } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestCreateFormDto, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import LocationLookup from "@/components/lookup/LocationLookup";
import FormDisplay from "./FormDisplay";
import { UpdatableItem, DeletionTarget } from "./MainForm";
import { motion } from "framer-motion";
import { buttonVariants, fadeVariants, slideUpVariants } from "@/utils/framer-variants";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { useCurrency } from "@/hooks/useCurrency";
import { useAuth } from "@/context/AuthContext";
import ViewItems from "./ViewItems";
import TableRowMotion from "@/components/framer-motion/TableRowMotion";
import { Checkbox } from "@/components/ui/checkbox";
import EditItems from "./EditItems";

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

            {/* {currentFormType === formType.EDIT && (
                <EditItems
                    currentFormType={currentFormType}
                    updatableItems={updatableItems}
                    handleProductSelect={handleProductSelect}
                    setDeletionTarget={setDeletionTarget}
                />
            )}

            <ViewItems
                updatableItems={updatableItems}
                getCurrencyCode={getCurrencyCode}
                currencyName={currencyBase?.name}
                mode={currentFormType}
            /> */}

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