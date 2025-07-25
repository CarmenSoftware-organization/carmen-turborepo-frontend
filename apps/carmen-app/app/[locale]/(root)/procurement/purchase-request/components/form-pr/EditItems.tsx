import { formType } from "@/dtos/form.dto";
import { DeletionTarget, UpdatableItem } from "./MainForm";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { motion } from "framer-motion";
import { buttonVariants } from "@/utils/framer-variants";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import LocationLookup from "@/components/lookup/LocationLookup";
import TableRowMotion from "@/components/framer-motion/TableRowMotion";

interface EditItemsProps {
    readonly currentFormType: formType;
    readonly updatableItems: UpdatableItem[];
    readonly handleProductSelect: (
        productId: string,
        context: { type: "add" | "update"; index: number } | { type: "pristine"; item: UpdatableItem }
    ) => void;
    readonly setDeletionTarget: (target: DeletionTarget | null) => void;
}

export default function EditItems({
    currentFormType,
    updatableItems,
    handleProductSelect,
    setDeletionTarget,
}: EditItemsProps) {
    if (currentFormType !== formType.EDIT) return null;

    return (
        <>
            {updatableItems.map((item, index) => (
                <TableRowMotion
                    key={item.id}
                    index={index}
                    classNames="flex gap-2 items-start p-2 border rounded-md border-dashed bg-blue-50/50 hover:bg-blue-50 transition-colors"
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
                </TableRowMotion>
            ))}
        </>
    );
}
