"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import TreeProductLookup from "./TreeProductLookup";

interface ProductLookupDialogProps {
    onSelect?: (productIds: { id: string }[]) => void;
    triggerButton?: React.ReactNode;
}

export default function ProductLookupDialog({ onSelect, triggerButton }: ProductLookupDialogProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (productIds: { id: string }[]) => {
        onSelect?.(productIds);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || <Button variant="outline">Select Products</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Select Products</DialogTitle>
                    <DialogDescription>
                        Search and select products from the tree
                    </DialogDescription>
                </DialogHeader>
                <TreeProductLookup onSelect={handleSelect} />
            </DialogContent>
        </Dialog>
    );
}
