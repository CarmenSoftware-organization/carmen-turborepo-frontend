"use client";

import { useState, useCallback, useMemo, memo, useEffect } from "react";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { useTree } from "@headless-tree/react";
import { syncDataLoaderFeature, hotkeysCoreFeature } from "@headless-tree/core";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2 } from "lucide-react";
import { useProductQuery } from "@/hooks/useProductQuery";
import { useAuth } from "@/context/AuthContext";
import { ProductGetDto } from "@/dtos/product.dto";
import { useTranslations } from "next-intl";

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
    const [searchQuery, setSearchQuery] = useState("");
    const tCommon = useTranslations("Common");
    const [searchTrigger, setSearchTrigger] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        new Set(initialSelectedIds.map(id => `product-${id}`))
    );
    const [selectedItemsCache, setSelectedItemsCache] = useState<Record<string, TreeNodeData>>({});

    const handleSearch = useCallback(() => {
        setSearchTrigger(searchQuery.trim());
    }, [searchQuery]);

    const handleSearchQueryChange = useCallback((value: string) => {
        setSearchQuery(value);
        // Clear search trigger immediately when query is empty
        if (!value.trim()) {
            setSearchTrigger("");
        }
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
        return products.data.filter((product: ProductGetDto) => {
            // Cache toLowerCase results to avoid multiple calls
            const nameLC = product.name?.toLowerCase();
            const codeLC = product.code?.toLowerCase();
            const descLC = product.description?.toLowerCase();
            const localNameLC = product.local_name?.toLowerCase();
            const categoryNameLC = product.product_category?.name?.toLowerCase();
            const subCategoryNameLC = product.product_sub_category?.name?.toLowerCase();
            const itemGroupNameLC = product.product_item_group?.name?.toLowerCase();

            return (
                nameLC?.includes(query) ||
                codeLC?.includes(query) ||
                descLC?.includes(query) ||
                localNameLC?.includes(query) ||
                categoryNameLC?.includes(query) ||
                subCategoryNameLC?.includes(query) ||
                itemGroupNameLC?.includes(query)
            );
        });
    }, [products?.data, searchTrigger]);

    const selectedProductIdsArray = useMemo(() => {
        return Array.from(selectedIds).filter(id => id.startsWith('product-')).sort();
    }, [selectedIds]);

    // Stable string for dependency comparison
    const selectedProductIdsKey = useMemo(() => {
        return selectedProductIdsArray.join(',');
    }, [selectedProductIdsArray]);

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

        // Helper to add product to tree structure
        const addProductToTree = (product: ProductGetDto) => {
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
            selectedProductIdsArray.forEach(productId => {
                if (itemsMap[productId]) return;
                const productIdNumber = productId.replace('product-', '');
                const product = products.data.find((p: ProductGetDto) => p.id === productIdNumber);

                if (product) {
                    addProductToTree(product);
                }
            });
        }

        categoryMap.forEach((subCategoryIds, categoryId) => {
            itemsMap[categoryId].children = Array.from(subCategoryIds);
        });

        subCategoryMap.forEach((itemGroupIds, subCategoryId) => {
            itemsMap[subCategoryId].children = Array.from(itemGroupIds);
        });

        itemGroupMap.forEach((productIds, itemGroupId) => {
            itemsMap[itemGroupId].children = Array.from(productIds);
        });

        const roots = Array.from(categoryMap.keys());

        return { items: itemsMap, rootItems: roots };
    }, [filteredProducts, isLoading, selectedProductIdsKey, products?.data, searchTrigger]);

    const searchInput = (
        <div className="flex gap-2">
            <Input
                className="mb-4"
                placeholder={tCommon("search")}
                value={searchQuery}
                onChange={(e) => handleSearchQueryChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <Button onClick={handleSearch} className="mb-4">{tCommon("search")}</Button>
        </div>
    );

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                {searchInput}
                <p className="text-muted-foreground">{tCommon("loading")}</p>
            </div>
        );
    }

    if (!products?.data) {
        return (
            <div className="p-6 space-y-4">
                {searchInput}
                <p className="text-muted-foreground">{tCommon("data_not_found")}</p>
            </div>
        );
    }

    if (rootItems.length === 0) {
        return (
            <div className="p-6 space-y-4">
                {searchInput}
                <p className="text-muted-foreground">
                    {tCommon("data_not_found")}
                </p>
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
    initialProducts = []
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
}) {
    // Local search for selected products (left panel)
    const [selectedSearchQuery, setSelectedSearchQuery] = useState("");
    const tCommon = useTranslations("Common");
    // Get all item IDs recursively
    const getAllItemIds = useCallback((itemId: string): string[] => {
        const item = items[itemId] || selectedItemsCache[itemId];
        if (!item) return [];

        const ids = [itemId];
        if (item.children) {
            item.children.forEach(childId => {
                ids.push(...getAllItemIds(childId));
            });
        }
        return ids;
    }, [items, selectedItemsCache]);

    // Get all product IDs under a node (recursively)
    const getAllProductIds = useCallback((itemId: string): string[] => {
        const item = items[itemId] || selectedItemsCache[itemId];
        if (!item) return [];

        if (item.type === 'product') {
            return [itemId];
        }

        const productIds: string[] = [];
        (item.children || []).forEach(childId => {
            productIds.push(...getAllProductIds(childId));
        });
        return productIds;
    }, [items, selectedItemsCache]);

    // Handle checkbox change
    const handleCheckboxChange = useCallback((itemId: string, checked: boolean) => {
        const item = items[itemId] || selectedItemsCache[itemId];
        if (!item) return;

        setSelectedIds(prev => {
            const newSet = new Set(prev);

            if (item.type === 'product') {
                // Toggle single product
                if (checked) {
                    newSet.add(itemId);
                    // Cache the product when selected
                    setSelectedItemsCache(prevCache => ({
                        ...prevCache,
                        [itemId]: item
                    }));
                } else {
                    newSet.delete(itemId);
                }
            } else {
                // Toggle all products under this node
                const productIds = getAllProductIds(itemId);
                if (checked) {
                    // Cache all products when selecting a category/subcategory/itemgroup
                    const newCache: Record<string, TreeNodeData> = {};
                    productIds.forEach(id => {
                        newSet.add(id);
                        const productItem = items[id] || selectedItemsCache[id];
                        if (productItem) {
                            newCache[id] = productItem;
                        }
                    });
                    setSelectedItemsCache(prevCache => ({
                        ...prevCache,
                        ...newCache
                    }));
                } else {
                    productIds.forEach(id => newSet.delete(id));
                }
            }

            return newSet;
        });
    }, [items, selectedItemsCache, getAllProductIds]);

    // Check if an item is checked (for indeterminate state)
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

    // Filter selected products based on search query
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

    // Get only newly selected products for confirm button
    const selectedProducts = useMemo(() => {
        const initialIds = new Set(initialProducts.map(p => p.key));
        return Array.from(selectedIds)
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
                    code: item.code,
                };
            });
    }, [selectedIds, items, selectedItemsCache, initialProducts]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 h-54">
                {/* Left: Selected Products */}
                <div className="border rounded-lg p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold">
                            {tCommon("init_products")}
                        </h3>
                        {selectedProducts.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                data-id="remove-all-selected-products"
                                onClick={() => {
                                    const initialIds = new Set(initialProducts.map(p => `product-${p.key}`));
                                    setSelectedIds(initialIds);
                                    setSelectedItemsCache({});
                                }}
                            >
                                remove all
                            </Button>
                        )}
                    </div>

                    {/* Search for Selected Products */}
                    <div className="relative mb-3">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={tCommon("search")}
                            value={selectedSearchQuery}
                            onChange={(e) => setSelectedSearchQuery(e.target.value)}
                            className="pl-8 h-9 text-xs"
                        />
                    </div>

                    <div className="flex-1 overflow-auto space-y-2">
                        {filteredSelectedProducts.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-xs text-muted-foreground">
                                    {selectedSearchQuery ? "No results found" : "No products selected"}
                                </p>
                            </div>
                        ) : (
                            filteredSelectedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-xs font-medium">
                                                {product.name}
                                                {product.local_name && ` - ${product.local_name}`}
                                            </p>
                                            {product.code && (
                                                <Badge className="text-xs">{product.code}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            handleCheckboxChange(`product-${product.id}`, false);
                                        }}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="border rounded-lg p-4 flex flex-col">
                    <h3 className="text-sm font-semibold mb-3">{tCommon("available_products")}</h3>

                    {/* Search for Tree */}
                    <div>
                        {searchInput}
                    </div>

                    <div className="flex-1 overflow-auto">
                        <Tree tree={tree} indent={24} toggleIconType="chevron" className="overflow-auto">
                            {tree.getItems().map((item) => {
                                const data = item.getItemData();

                                // Skip rendering items without name (fallback items)
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
                    </div>
                </div>
            </div>
        </div>
    );
});
