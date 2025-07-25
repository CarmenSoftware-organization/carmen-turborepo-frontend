import React from 'react';
import { motion } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { MapPin, Package } from 'lucide-react';
import { UpdatableItem } from './MainForm';

const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

interface ViewItemsProps {
    updatableItems?: UpdatableItem[];
    getCurrencyCode?: (currencyId: string) => string;
    currencyName?: string;
}

export default function ViewItems({
    updatableItems = [],
    getCurrencyCode,
    currencyName
}: ViewItemsProps) {
    return (
        <div>
            {updatableItems.map((item, index) => (
                <motion.div
                    key={item.id}
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "easeOut"
                    }}
                >
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-blue-500" />
                                        <p className="text-sm font-medium">{item.location_name || "-"}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {item.stages_status || ''}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Package className="h-4 w-4 text-blue-500" />
                                        <div>
                                            <p className="text-sm font-medium">{item.product_name || "-"}</p>
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="w-[120px] text-right">
                                    <p className="text-sm text-right font-semibold">
                                        {item.requested_qty} {item.requested_unit_name || "-"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        (≈ {item.requested_base_qty} {item.inventory_unit_name || "-"})
                                    </p>
                                </TableCell>
                                <TableCell className="w-[100px] text-right">
                                    <p className="text-sm text-right font-semibold">
                                        {item.approved_qty} {item.approved_unit_name || "-"}
                                    </p>
                                    <Separator />
                                    <p className="text-xs font-semibold text-blue-500">
                                        FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                                    </p>
                                </TableCell>
                                <TableCell className="w-[100px] text-right">
                                    <p className="text-sm text-right font-semibold">
                                        {getCurrencyCode?.(item.currency_id)} {item.total_price}
                                    </p>
                                    <p className="text-xs font-semibold text-blue-500">
                                        {currencyName} {item.base_total_price}
                                    </p>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </motion.div>
            ))}
        </div>
    );
}