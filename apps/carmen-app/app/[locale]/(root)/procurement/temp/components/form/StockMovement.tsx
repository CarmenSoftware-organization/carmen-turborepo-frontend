"use client";

import { CreateGRNDto } from "@/dtos/grn.dto";
import { Control } from "react-hook-form";
import { formType } from "@/dtos/form.dto";

interface StockMovementProps {
    readonly control: Control<CreateGRNDto>;
    readonly mode: formType;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function StockMovement({ control: _control, mode: _mode }: StockMovementProps) {
    return (
        <div className="p-2">
            <p className="pl-2 text-base font-medium">Stock Movement</p>
            <div className="text-center py-8 text-muted-foreground">
                <p>Stock Movement functionality is not implemented yet.</p>
                <p className="text-sm">This feature will be available in a future update.</p>
            </div>
        </div>
    );
}

