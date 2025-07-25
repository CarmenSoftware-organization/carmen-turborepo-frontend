import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { MapPin, Package } from 'lucide-react';
import { UpdatableItem } from './MainForm';
import TableRowMotion from '@/components/framer-motion/TableRowMotion';
import TableHeadItemPr from './TableHeadItemPr';
import { formType } from '@/dtos/form.dto';
interface ViewItemsProps {
    updatableItems?: UpdatableItem[];
    getCurrencyCode?: (currencyId: string) => string;
    currencyName?: string;
    mode: formType;
}

export default function ViewItems({
    updatableItems = [],
    getCurrencyCode,
    currencyName,
    mode
}: ViewItemsProps) {
    return (
        <div>
            {updatableItems.map((item, index) => (
                <TableRowMotion key={item.id} index={index} >
                    <Table>
                        <TableHeadItemPr mode={mode} />
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
                </TableRowMotion>
            ))}
        </div>
    );
}