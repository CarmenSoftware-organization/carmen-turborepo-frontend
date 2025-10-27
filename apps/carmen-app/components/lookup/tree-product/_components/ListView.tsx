import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { TreeNodeData } from '../types';

interface ListViewProps {
    readonly availableProducts: TreeNodeData[];
    readonly selectedIds: Set<string>;
    readonly handleCheckboxChange: (itemId: string, checked: boolean) => void;
}

export function ListView({ availableProducts, selectedIds, handleCheckboxChange }: ListViewProps) {
    const tCommon = useTranslations("Common");

    const selectedCount = availableProducts.filter(p => selectedIds.has(p.id)).length;
    const allSelected = availableProducts.length > 0 && selectedCount === availableProducts.length;
    const someSelected = selectedCount > 0 && selectedCount < availableProducts.length;

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2 p-1 mb-1">
                    <Checkbox
                        checked={allSelected}
                        ref={(el) => {
                            if (el) {
                                const inputEl = el.querySelector('input[type="checkbox"]') as HTMLInputElement;
                                if (inputEl) {
                                    inputEl.indeterminate = someSelected;
                                }
                            }
                        }}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                for (const product of availableProducts) {
                                    handleCheckboxChange(product.id, true);
                                }
                            } else {
                                for (const product of availableProducts) {
                                    handleCheckboxChange(product.id, false);
                                }
                            }
                        }}
                    />
                    <p className="text-sm font-medium">
                        {tCommon("select_all")}
                    </p>
                </div>
                <Badge variant={'active'} className="text-xs">
                    {tCommon("result")} {availableProducts.length}
                </Badge>
            </div>

            {availableProducts.map((product) => {
                const productId = product.id;
                const isSelected = selectedIds.has(productId);
                return (
                    <label
                        key={product.id}
                        className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-sm cursor-pointer"
                    >
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                                handleCheckboxChange(productId, checked === true);
                            }}
                        />
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-xs font-medium">
                                    {product.name}
                                    {product.local_name && ` - ${product.local_name}`}
                                </p>
                                {product.code && (
                                    <Badge variant={'product_badge'} className="text-xs">{product.code}</Badge>
                                )}
                            </div>
                        </div>
                    </label>
                );
            })}
        </div>
    );
}
