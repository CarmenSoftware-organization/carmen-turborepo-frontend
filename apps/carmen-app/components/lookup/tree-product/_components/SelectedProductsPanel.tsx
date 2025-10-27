import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import SearchInput from '@/components/ui-custom/SearchInput';

interface SelectedProduct {
    id: string;
    name: string;
    local_name?: string;
    code?: string;
    isInitial: boolean;
}

interface SelectedProductsPanelProps {
    readonly allProducts: SelectedProduct[];
    readonly onRemoveProduct: (productId: string) => void;
    readonly onRemoveAll: () => void;
    readonly hasSelectedProducts: boolean;
}

export function SelectedProductsPanel({
    allProducts,
    onRemoveProduct,
    onRemoveAll,
    hasSelectedProducts
}: SelectedProductsPanelProps) {
    const [selectedSearchQuery, setSelectedSearchQuery] = useState("");
    const tCommon = useTranslations("Common");

    const filteredSelectedProducts = useMemo(() => {
        if (!selectedSearchQuery.trim()) return allProducts;

        const query = selectedSearchQuery.toLowerCase();
        return allProducts.filter(product => {
            const nameMatch = product.name?.toLowerCase().includes(query);
            const localNameMatch = product.local_name?.toLowerCase().includes(query);
            const codeMatch = product.code?.toLowerCase().includes(query);
            return nameMatch || localNameMatch || codeMatch;
        });
    }, [allProducts, selectedSearchQuery]);

    return (
        <div className="border border-border rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">
                    {tCommon("init_products")}
                </h3>
                {hasSelectedProducts && (
                    <Button
                        variant="ghost"
                        size="sm"
                        data-id="remove-all-selected-products"
                        onClick={onRemoveAll}
                        className="text-destructive"
                    >
                        <Trash2 />
                        {tCommon("un_select_all")}
                    </Button>
                )}
            </div>

            <SearchInput
                defaultValue={selectedSearchQuery}
                onSearch={setSelectedSearchQuery}
                placeholder={tCommon("search")}
                data-id="product-location-search-input"
                containerClassName="w-full"
            />

            <div className="flex-1 overflow-auto space-y-2 max-h-80 pt-4">
                {filteredSelectedProducts.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-xs text-muted-foreground">
                            {selectedSearchQuery ? tCommon("no_data") : tCommon("not_product_selected")}
                        </p>
                    </div>
                ) : (
                    filteredSelectedProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between px-0"
                        >
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-xs font-medium">
                                        {product.name}
                                        {product.local_name && ` - ${product.local_name}`}
                                    </p>
                                    {product.code && (
                                        <Badge variant={'product_badge'} className="text-xs">
                                            {product.code}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveProduct(product.id)}
                                data-id="remove-selected-product"
                                className="text-destructive"
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
