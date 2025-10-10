"use client";

import { useState, useCallback, useMemo } from "react";
import { Tree, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { useTree } from "@headless-tree/react";
import { syncDataLoaderFeature, hotkeysCoreFeature } from "@headless-tree/core";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProductQuery } from "@/hooks/useProductQuery";
import { useAuth } from "@/context/AuthContext";
import { ProductGetDto } from "@/dtos/product.dto";

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
    onSelect?: (productIds: { id: string }[]) => void;
}

export default function TreeProductLookup({ onSelect }: TreeProductLookupProps = {}) {
    const { token, buCode } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTrigger, setSearchTrigger] = useState("");

    const handleSearch = useCallback(() => {
        setSearchTrigger(searchQuery);
    }, [searchQuery]);

    const { products, isLoading } = useProductQuery({
        token,
        buCode,
        params: {
            search: searchTrigger,
            perpage: -1
        }
    });

    // Build tree data structure from product data
    const { items, rootItems } = useMemo((): { items: Record<string, TreeNodeData>; rootItems: string[] } => {
        if (isLoading || !products?.data) {
            return {
                items: {},
                rootItems: []
            };
        }

        const itemsMap: Record<string, TreeNodeData> = {};
        const categoryMap = new Map<string, Set<string>>();
        const subCategoryMap = new Map<string, Set<string>>();
        const itemGroupMap = new Map<string, Set<string>>();

        products.data.forEach((product: ProductGetDto) => {
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
        });

        // Assign children arrays
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
    }, [products?.data, isLoading]);

    const searchInput = (
        <Input
            className="mb-4"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            }}
        />
    );

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                {searchInput}
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!products?.data || rootItems.length === 0) {
        return (
            <div className="p-6 space-y-4">
                {searchInput}
                <p className="text-muted-foreground">No data available</p>
            </div>
        );
    }

    return <TreeProductLookupContent items={items} rootItems={rootItems} searchInput={searchInput} hasSearch={!!searchTrigger} onSelect={onSelect} />;
}

function TreeProductLookupContent({ items, rootItems, searchInput, hasSearch, onSelect }: { items: Record<string, TreeNodeData>; rootItems: string[]; searchInput: React.ReactNode; hasSearch: boolean; onSelect?: (productIds: { id: string }[]) => void }) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Get all item IDs recursively
    const getAllItemIds = useCallback((itemId: string): string[] => {
        const item = items[itemId];
        if (!item) return [];

        const ids = [itemId];
        if (item.children) {
            item.children.forEach(childId => {
                ids.push(...getAllItemIds(childId));
            });
        }
        return ids;
    }, [items]);

    // Get all product IDs under a node (recursively)
    const getAllProductIds = useCallback((itemId: string): string[] => {
        const item = items[itemId];
        if (!item) return [];

        if (item.type === 'product') {
            return [itemId];
        }

        const productIds: string[] = [];
        (item.children || []).forEach(childId => {
            productIds.push(...getAllProductIds(childId));
        });
        return productIds;
    }, [items]);

    // Handle checkbox change
    const handleCheckboxChange = useCallback((itemId: string, checked: boolean) => {
        const item = items[itemId];
        if (!item) return;

        setSelectedIds(prev => {
            const newSet = new Set(prev);

            if (item.type === 'product') {
                // Toggle single product
                if (checked) {
                    newSet.add(itemId);
                } else {
                    newSet.delete(itemId);
                }
            } else {
                // Toggle all products under this node
                const productIds = getAllProductIds(itemId);
                if (checked) {
                    productIds.forEach(id => newSet.add(id));
                } else {
                    productIds.forEach(id => newSet.delete(id));
                }
            }

            return newSet;
        });
    }, [items, getAllProductIds]);

    // Check if an item is checked (for indeterminate state)
    const getCheckboxState = useCallback((itemId: string): { checked: boolean; indeterminate: boolean } => {
        const item = items[itemId];
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
    }, [items, selectedIds, getAllProductIds]);

    // Get selected products as array
    const selectedProducts = useMemo(() => {
        return Array.from(selectedIds)
            .filter(id => items[id]?.type === 'product')
            .map(id => ({
                id: id.replace('product-', ''),
                name: items[id].name,
                code: items[id].code,
            }));
    }, [selectedIds, items]);

    // Log selected products when changed
    useMemo(() => {
        console.log('Selected products:', selectedProducts);
    }, [selectedProducts]);

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
                return items[itemId];
            },
            getChildren: (itemId) => {
                if (itemId === 'root') return rootItems;
                return items[itemId]?.children ?? [];
            }
        },
        initialState: {
            expandedItems: hasSearch ? rootItems.flatMap(id => getAllItemIds(id)).filter(id => items[id]?.type !== 'product') : rootItems.slice(0, 3)
        },
        features: [syncDataLoaderFeature, hotkeysCoreFeature]
    });

    return (
        <div className="p-6 space-y-4">
            {searchInput}
            <Tree tree={tree} indent={24} toggleIconType="chevron" className="max-h-[600px] overflow-auto">
                {tree.getItems().map((item) => {
                    const data = item.getItemData();
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
                                                <p>{data.name} - {data.local_name}</p>
                                                <Badge>{data.code}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground text-left ml-4">{data.description ? data.description : '-'}</p>
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
                                            <p>{data.name}</p>
                                            <Badge variant="secondary">{data.children?.length || 0}</Badge>
                                        </div>
                                    )}
                                </TreeItemLabel>
                            </div>
                        </TreeItem>
                    );
                })}
            </Tree>
            {onSelect && (
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={() => {
                            const productIds = Array.from(selectedIds)
                                .filter(id => items[id]?.type === 'product')
                                .map(id => ({ id }));
                            onSelect(productIds);
                        }}
                    >
                        Confirm Selection ({Array.from(selectedIds).filter(id => items[id]?.type === 'product').length})
                    </Button>
                </div>
            )}
        </div>
    );
}
