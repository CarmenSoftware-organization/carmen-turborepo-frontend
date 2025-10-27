"use client";

import { useState, useCallback, useMemo, memo, useEffect } from "react";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { useTree } from "@headless-tree/react";
import { syncDataLoaderFeature, hotkeysCoreFeature } from "@headless-tree/core";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FolderTree, List, Trash2 } from "lucide-react";
import { useProductQuery } from "@/hooks/useProductQuery";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import SearchInput from "../ui-custom/SearchInput";

interface TreeNodeData {
    id: string;
    name: string;
    code?: string;
    description?: string;
    local_name?: string;
    type: 'category' | 'subcategory' | 'itemgroup' | 'product';
    children?: string[];
}

interface TreeProductLookupProps {
    readonly onSelect?: (productIds: { id: string }[]) => void;
    readonly initialSelectedIds?: string[];
    readonly initialProducts?: { key: string; title: string }[];
}

export default function TreeProductLookup({ onSelect, initialSelectedIds = [], initialProducts = [] }: TreeProductLookupProps) {
    const { token, buCode } = useAuth();
    const tCommon = useTranslations("Common");
    const [searchTrigger, setSearchTrigger] = useState("");
    const [viewMode, setViewMode] = useState<'tree' | 'list'>('list');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        new Set(initialSelectedIds.map(id => `product-${id}`))
    );
    const [selectedItemsCache, setSelectedItemsCache] = useState<Record<string, TreeNodeData>>({});

    const handleSearch = useCallback((value: string) => {
        setSearchTrigger(value.trim());
    }, []);

    // Load all products once (no search param)
    const { products, isLoading } = useProductQuery({
        token,
        buCode,
        params: {
            perpage: -1
        }
    });

    // Filter products on client side when search is triggered
    const filteredProducts = useMemo(() => {
        if (!products?.data || !searchTrigger.trim()) {
            return products?.data || [];
        }

        const query = searchTrigger.toLowerCase().trim();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return products.data.filter((product: any) => {
            // Search in product name and local_name
            const nameLC = product.name?.toLowerCase();
            const localNameLC = product.local_name?.toLowerCase();
            return nameLC?.includes(query) || localNameLC?.includes(query);
        });
    }, [products?.data, searchTrigger]);

    const selectedProductIdsArray = useMemo(() => {
        return Array.from(selectedIds)
            .filter(id => id.startsWith('product-'))
            .sort((a, b) => a.localeCompare(b));
    }, [selectedIds]);

    // Build tree data structure from filtered product data + keep selected items
    const { items, rootItems } = useMemo((): { items: Record<string, TreeNodeData>; rootItems: string[] } => {
        if (isLoading || !filteredProducts) {
            return {
                items: {},
                rootItems: []
            };
        }

        const itemsMap: Record<string, TreeNodeData> = {};
        const categoryMap = new Map<string, Set<string>>();
        const subCategoryMap = new Map<string, Set<string>>();
        const itemGroupMap = new Map<string, Set<string>>();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addProductToTree = (product: any) => {
            const category = product.product_category;
            const subCategory = product.product_sub_category;
            const itemGroup = product.product_item_group;

            if (!category || !subCategory || !itemGroup) return;

            const categoryId = `category-${category.id}`;
            const subCategoryId = `subcategory-${subCategory.id}`;
            const itemGroupId = `itemgroup-${itemGroup.id}`;
            const productId = `product-${product.id}`;

            // Add category
            if (!itemsMap[categoryId]) {
                itemsMap[categoryId] = {
                    id: categoryId,
                    name: category.name,
                    code: categoryId.replace('category-', ''),
                    type: 'category',
                    children: []
                };
            }

            // Add subcategory
            if (!itemsMap[subCategoryId]) {
                itemsMap[subCategoryId] = {
                    id: subCategoryId,
                    name: subCategory.name,
                    code: subCategoryId.replace('subcategory-', ''),
                    type: 'subcategory',
                    children: []
                };
            }

            // Add item group
            if (!itemsMap[itemGroupId]) {
                itemsMap[itemGroupId] = {
                    id: itemGroupId,
                    name: itemGroup.name,
                    code: itemGroupId.replace('itemgroup-', ''),
                    type: 'itemgroup',
                    children: []
                };
            }

            // Add product
            itemsMap[productId] = {
                id: productId,
                name: product.name,
                code: product.code,
                description: product.description,
                local_name: product.local_name,
                type: 'product',
                children: []
            };

            // Build relationships
            if (!categoryMap.has(categoryId)) {
                categoryMap.set(categoryId, new Set());
            }
            categoryMap.get(categoryId)!.add(subCategoryId);

            if (!subCategoryMap.has(subCategoryId)) {
                subCategoryMap.set(subCategoryId, new Set());
            }
            subCategoryMap.get(subCategoryId)!.add(itemGroupId);

            if (!itemGroupMap.has(itemGroupId)) {
                itemGroupMap.set(itemGroupId, new Set());
            }
            itemGroupMap.get(itemGroupId)!.add(productId);
        };

        for (const product of filteredProducts) {
            addProductToTree(product);
        }

        if (searchTrigger.trim() && products?.data && selectedProductIdsArray.length > 0) {
            for (const productId of selectedProductIdsArray) {
                if (itemsMap[productId]) continue;
                const productIdNumber = productId.replace('product-', '');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const product = products.data.find((p: any) => p.id === productIdNumber);

                if (product) {
                    addProductToTree(product);
                }
            }
        }

        for (const [categoryId, subCategoryIds] of categoryMap) {
            itemsMap[categoryId].children = Array.from(subCategoryIds);
        }

        for (const [subCategoryId, itemGroupIds] of subCategoryMap) {
            itemsMap[subCategoryId].children = Array.from(itemGroupIds);
        }

        for (const [itemGroupId, productIds] of itemGroupMap) {
            itemsMap[itemGroupId].children = Array.from(productIds);
        }

        const roots = Array.from(categoryMap.keys());

        return { items: itemsMap, rootItems: roots };
    }, [filteredProducts, isLoading, selectedProductIdsArray, products?.data, searchTrigger]);

    const searchInput = (
        <SearchInput
            defaultValue={searchTrigger}
            onSearch={handleSearch}
            placeholder={tCommon("search")}
            containerClassName="mb-4 w-full"
        />
    );

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                {searchInput}
                <p className="text-muted-foreground">{tCommon("loading")}</p>
            </div>
        );
    }

    return (
        <TreeProductLookupContent
            items={items}
            rootItems={rootItems}
            searchInput={searchInput}
            hasSearch={!!searchTrigger.trim()}
            onSelect={onSelect}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            selectedItemsCache={selectedItemsCache}
            setSelectedItemsCache={setSelectedItemsCache}
            initialProducts={initialProducts}
            viewMode={viewMode}
            setViewMode={setViewMode}
        />
    );
}

const TreeProductLookupContent = memo(function TreeProductLookupContent({
    items,
    rootItems,
    searchInput,
    hasSearch,
    onSelect,
    selectedIds,
    setSelectedIds,
    selectedItemsCache,
    setSelectedItemsCache,
    initialProducts = [],
    viewMode,
    setViewMode
}: {
    items: Record<string, TreeNodeData>;
    rootItems: string[];
    searchInput: React.ReactNode;
    hasSearch: boolean;
    onSelect?: (productIds: { id: string }[]) => void;
    selectedIds: Set<string>;
    setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    selectedItemsCache: Record<string, TreeNodeData>;
    setSelectedItemsCache: React.Dispatch<React.SetStateAction<Record<string, TreeNodeData>>>;
    initialProducts?: { key: string; title: string }[];
    viewMode: 'tree' | 'list';
    setViewMode: React.Dispatch<React.SetStateAction<'tree' | 'list'>>;
}) {
    const [selectedSearchQuery, setSelectedSearchQuery] = useState("");
    const tCommon = useTranslations("Common");

    const getAllItemIds = useCallback((itemId: string): string[] => {
        const item = items[itemId] || selectedItemsCache[itemId];
        if (!item) return [];

        const ids = [itemId];
        if (item.children) {
            for (const childId of item.children) {
                ids.push(...getAllItemIds(childId));
            }
        }
        return ids;
    }, [items, selectedItemsCache]);

    const getAllProductIds = useCallback((itemId: string): string[] => {
        const item = items[itemId] || selectedItemsCache[itemId];
        if (!item) return [];

        if (item.type === 'product') {
            return [itemId];
        }

        const productIds: string[] = [];
        for (const childId of (item.children || [])) {
            productIds.push(...getAllProductIds(childId));
        }
        return productIds;
    }, [items, selectedItemsCache]);

    const handleProductSelection = useCallback((itemId: string, item: TreeNodeData, checked: boolean, newSet: Set<string>) => {
        if (checked) {
            newSet.add(itemId);
            setSelectedItemsCache(prevCache => ({
                ...prevCache,
                [itemId]: item
            }));
        } else {
            newSet.delete(itemId);
        }
    }, [setSelectedItemsCache]);

    const handleGroupSelection = useCallback((itemId: string, checked: boolean, newSet: Set<string>) => {
        const productIds = getAllProductIds(itemId);

        if (checked) {
            const newCache: Record<string, TreeNodeData> = {};
            for (const id of productIds) {
                newSet.add(id);
                const productItem = items[id] || selectedItemsCache[id];
                if (productItem) {
                    newCache[id] = productItem;
                }
            }
            setSelectedItemsCache(prevCache => ({
                ...prevCache,
                ...newCache
            }));
        } else {
            for (const id of productIds) {
                newSet.delete(id);
            }
        }
    }, [getAllProductIds, items, selectedItemsCache, setSelectedItemsCache]);

    const handleCheckboxChange = useCallback((itemId: string, checked: boolean) => {
        const item = items[itemId] || selectedItemsCache[itemId];
        if (!item) return;

        setSelectedIds(prev => {
            const newSet = new Set(prev);

            if (item.type === 'product') {
                handleProductSelection(itemId, item, checked, newSet);
            } else {
                handleGroupSelection(itemId, checked, newSet);
            }

            return newSet;
        });
    }, [items, selectedItemsCache, setSelectedIds, handleProductSelection, handleGroupSelection]);

    const getCheckboxState = useCallback((itemId: string): { checked: boolean; indeterminate: boolean } => {
        const item = items[itemId] || selectedItemsCache[itemId];
        if (!item) return { checked: false, indeterminate: false };

        if (item.type === 'product') {
            return { checked: selectedIds.has(itemId), indeterminate: false };
        }

        const productIds = getAllProductIds(itemId);
        const selectedCount = productIds.filter(id => selectedIds.has(id)).length;

        if (selectedCount === 0) {
            return { checked: false, indeterminate: false };
        } else if (selectedCount === productIds.length) {
            return { checked: true, indeterminate: false };
        } else {
            return { checked: false, indeterminate: true };
        }
    }, [items, selectedItemsCache, selectedIds, getAllProductIds]);

    // Get all products (initial + newly selected)
    const allProducts = useMemo(() => {
        // Convert initial products - only show if still selected
        const initial = initialProducts
            .filter(p => selectedIds.has(`product-${p.key}`))  // Only show if still checked
            .map(p => {
                const item = items[`product-${p.key}`] || selectedItemsCache[`product-${p.key}`];
                return {
                    id: p.key,
                    name: item?.name || p.title,
                    local_name: item?.local_name,
                    code: item?.code,
                    isInitial: true,
                };
            });

        // Get newly selected products (not in initial)
        const initialIds = new Set(initialProducts.map(p => p.key));
        const newlySelected = Array.from(selectedIds)
            .filter(id => {
                const item = items[id] || selectedItemsCache[id];
                const productId = id.replace('product-', '');
                return item?.type === 'product' && !initialIds.has(productId);
            })
            .map(id => {
                const item = items[id] || selectedItemsCache[id];
                return {
                    id: id.replace('product-', ''),
                    name: item.name,
                    local_name: item.local_name,
                    code: item.code,
                    isInitial: false,
                };
            });

        return [...initial, ...newlySelected];
    }, [selectedIds, items, selectedItemsCache, initialProducts]);

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

    // Auto-trigger onSelect when selection changes (send ALL selected products including initial)
    useEffect(() => {
        if (onSelect) {
            const allProductIds = Array.from(selectedIds)
                .filter(id => {
                    const item = items[id] || selectedItemsCache[id];
                    return item?.type === 'product';
                })
                .map(id => ({ id: id.replace('product-', '') }));
            onSelect(allProductIds);
        }
    }, [selectedIds]);

    const tree = useTree<TreeNodeData>({
        rootItemId: 'root',
        getItemName: (item) => {
            const data = item.getItemData();
            if (data?.type === 'product' && data.code && data.description) {
                return `${data.name} (${data.code}) - ${data.description}`;
            }
            return data?.name || '';
        },
        isItemFolder: (item) => {
            const children = item.getItemData()?.children ?? [];
            return children.length > 0;
        },
        dataLoader: {
            getItem: (itemId) => {
                if (itemId === 'root') {
                    return { id: 'root', name: 'Root', type: 'category' as const, children: rootItems } as TreeNodeData;
                }
                const item = items[itemId];
                // Must return a valid object, never undefined
                if (!item) {
                    return { id: itemId, name: '', type: 'product' as const, children: [] } as TreeNodeData;
                }
                return item;
            },
            getChildren: (itemId) => {
                if (itemId === 'root') return rootItems;
                const item = items[itemId];
                if (!item) return [];
                return item.children ?? [];
            }
        },
        initialState: {
            expandedItems: hasSearch
                ? rootItems.flatMap(id => getAllItemIds(id)).filter(id => items[id] && items[id]?.type !== 'product')
                : rootItems.slice(0, 3).filter(id => items[id])
        },
        features: [syncDataLoaderFeature, hotkeysCoreFeature]
    });

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 h-54">
                <div className="border border-border rounded-lg p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">
                            {tCommon("init_products")}
                        </h3>
                        {selectedIds.size > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                data-id="remove-all-selected-products"
                                onClick={() => {
                                    setSelectedIds(new Set<string>());
                                    setSelectedItemsCache({});
                                }}
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
                                                <Badge variant={'product_badge'} className="text-xs">{product.code}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            handleCheckboxChange(`product-${product.id}`, false);
                                        }}
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

                    <div className="flex-1 overflow-auto max-h-80">
                        {(() => {
                            // Empty state
                            if (rootItems.length === 0) {
                                return (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-sm text-muted-foreground">{tCommon("data_not_found")}</p>
                                    </div>
                                );
                            }

                            // Tree view
                            if (viewMode === 'tree') {
                                return (
                                    <Tree tree={tree} indent={24} toggleIconType="chevron" className="overflow-auto">
                                        {tree.getItems().map((item) => {
                                            const data = item.getItemData();
                                            if (!data.name) {
                                                return null;
                                            }
                                            const checkboxState = getCheckboxState(data.id);
                                            return (
                                                <TreeItem key={item.getId()} item={item} asChild>
                                                    <div>
                                                        <TreeItemLabel>
                                                            {data.type === 'product' ? (
                                                                <div className="w-full">
                                                                    <div className="flex items-center space-x-2 ml-4">
                                                                        <Checkbox
                                                                            checked={checkboxState.checked}
                                                                            onCheckedChange={(checked) => {
                                                                                handleCheckboxChange(data.id, checked === true);
                                                                            }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                        <p className="text-xs">{data.name} - {data.local_name}</p>
                                                                        <Badge>{data.code}</Badge>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <Checkbox
                                                                        checked={checkboxState.indeterminate ? "indeterminate" : checkboxState.checked}
                                                                        onCheckedChange={(checked) => {
                                                                            handleCheckboxChange(data.id, checked === true);
                                                                        }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                    <p className="text-xs">{data.name}</p>
                                                                    <Badge variant="secondary">{data.children?.length || 0}</Badge>
                                                                </div>
                                                            )}
                                                        </TreeItemLabel>
                                                    </div>
                                                </TreeItem>
                                            );
                                        })}
                                    </Tree>
                                );
                            }

                            const availableProducts = Object.values(items)
                                .filter(item => item.type === 'product');
                            const selectedCount = availableProducts.filter(p => selectedIds.has(p.id)).length;
                            const allSelected = availableProducts.length > 0 && selectedCount === availableProducts.length;
                            const someSelected = selectedCount > 0 && selectedCount < availableProducts.length;

                            return (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between border-b border-border pb-2">
                                        <div className="flex items-center gap-2 px-2 py-1">
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
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
});
