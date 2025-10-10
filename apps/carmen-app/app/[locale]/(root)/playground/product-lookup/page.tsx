"use client";

import TreeProductLookup from "./TreeProductLookup";
import ProductLookupDialog from "./ProductLookupDialog";

export default function ProductLookupPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Product Lookup Demo</h1>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Dialog Version</h2>
                <ProductLookupDialog
                    onSelect={(products) => {
                        console.log('Selected products from dialog:', products);
                    }}
                />
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Static Version</h2>
                <TreeProductLookup
                    onSelect={(products) => {
                        console.log('Selected products from static:', products);
                    }}
                />
            </div>
        </div>
    );
}
