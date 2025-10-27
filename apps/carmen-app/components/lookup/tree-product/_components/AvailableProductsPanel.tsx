import { Button } from '@/components/ui/button';
import { FolderTree, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TreeInstance } from '@headless-tree/core';
import { TreeNodeData, ViewMode } from '../types';
import { TreeView } from './TreeView';
import { ListView } from './ListView';

interface AvailableProductsPanelProps {
    readonly searchInput: React.ReactNode;
    readonly viewMode: ViewMode;
    readonly setViewMode: (mode: ViewMode) => void;
    readonly rootItems: string[];
    readonly items: Record<string, TreeNodeData>;
    readonly tree: TreeInstance<TreeNodeData>;
    readonly selectedIds: Set<string>;
    readonly getCheckboxState: (itemId: string) => { checked: boolean; indeterminate: boolean };
    readonly handleCheckboxChange: (itemId: string, checked: boolean) => void;
}

export function AvailableProductsPanel({
    searchInput,
    viewMode,
    setViewMode,
    rootItems,
    items,
    tree,
    selectedIds,
    getCheckboxState,
    handleCheckboxChange
}: AvailableProductsPanelProps) {
    const tCommon = useTranslations("Common");

    const renderContent = () => {
        if (rootItems.length === 0) {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">{tCommon("data_not_found")}</p>
                </div>
            );
        }
        if (viewMode === 'tree') {
            return (
                <TreeView
                    tree={tree}
                    getCheckboxState={getCheckboxState}
                    handleCheckboxChange={handleCheckboxChange}
                />
            );
        }
        const availableProducts = Object.values(items).filter(item => item.type === 'product');
        return (
            <ListView
                availableProducts={availableProducts}
                selectedIds={selectedIds}
                handleCheckboxChange={handleCheckboxChange}
            />
        );
    };

    return (
        <div className="border border-border rounded-lg p-3 flex flex-col">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold">{tCommon("available_products")}</h3>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant={viewMode === 'tree' ? 'default' : 'ghost'}
                        data-id="tree-view"
                        className="h-7 w-7"
                        onClick={() => setViewMode('tree')}
                    >
                        <FolderTree />
                    </Button>
                    <Button
                        size="sm"
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        data-id="list-view"
                        className="h-7 w-7"
                        onClick={() => setViewMode('list')}
                    >
                        <List />
                    </Button>
                </div>
            </div>
            <div>
                {searchInput}
            </div>
            <div className="flex-1 overflow-auto max-h-96 mt-2">
                {renderContent()}
            </div>
        </div>
    );
}
