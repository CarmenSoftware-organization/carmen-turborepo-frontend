import React from 'react';
import {
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { formType } from '@/dtos/form.dto';

interface TableHeadItemPrProps {
    readonly mode: formType;
}

export default function TableHeadItemPr({ mode }: TableHeadItemPrProps) {
    return (
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
                {mode !== formType.VIEW && (
                    <TableHead className="w-[120px] text-right font-semibold">More</TableHead>
                )}
            </TableRow>
        </TableHeader>
    );
} 