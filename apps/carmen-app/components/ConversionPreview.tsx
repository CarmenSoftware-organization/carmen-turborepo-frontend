"use client";

import { useEffect, useState } from "react";

interface Props {
    readonly fromUnitId: string;
    readonly toUnitId: string;
    readonly fromUnitQty: number;
    readonly toUnitQty: number;
    readonly getUnitName: (id: string) => string;
}

export default function ConversionPreview({
    fromUnitId,
    toUnitId,
    fromUnitQty,
    toUnitQty,
    getUnitName,
}: Props) {
    const [conversionPreview, setConversionPreview] = useState<{ unitRatio: string; qtyMultiplier: string }>({
        unitRatio: '',
        qtyMultiplier: ''
    });

    useEffect(() => {
        if (fromUnitId && toUnitId) {
            setConversionPreview({
                unitRatio: `1 ${getUnitName(fromUnitId)} = ${toUnitQty} ${getUnitName(toUnitId)}`,
                qtyMultiplier: `Qty x ${toUnitQty * fromUnitQty}`
            });
        }
    }, [fromUnitId, toUnitId, toUnitQty, fromUnitQty, getUnitName]);

    return (
        <div>
            <p className="text-xs font-medium">{conversionPreview.unitRatio}</p>
            <p className="text-muted-foreground text-[11px]">{conversionPreview.qtyMultiplier}</p>
        </div>
    );
}