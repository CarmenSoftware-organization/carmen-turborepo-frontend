import { useState, useEffect, useCallback } from "react";
import { CategoryDto, SubCategoryDto, ItemGroupDto, CategoryNode } from "@/dtos/category.dto";
import { generateNanoid } from "@/utils/nano-id";


interface UseCategoryTreeProps {
    categories: CategoryDto[];
    subCategories: SubCategoryDto[];
    itemGroups: ItemGroupDto[];
    isLoading: boolean;
}

interface UseCategoryTreeReturn {
    categoryData: CategoryNode[];
    expanded: Record<string, boolean>;
    handleEdit: (node: CategoryNode) => void;
    handleAdd: (parent?: CategoryNode) => void;
    handleDelete: (node: CategoryNode) => void;
    expandAll: () => void;
    collapseAll: () => void;
    toggleExpand: (id: string) => void;
    updateNodeInTree: (nodes: CategoryNode[], updatedNode: CategoryNode) => CategoryNode[];
    addNodeToTree: (nodes: CategoryNode[], newNode: CategoryNode, parentId?: string) => CategoryNode[];
    deleteNodeFromTree: (nodes: CategoryNode[], nodeId: string) => CategoryNode[];
}

export const useCategoryTree = ({
    categories,
    subCategories,
    itemGroups,
    isLoading
}: UseCategoryTreeProps): UseCategoryTreeReturn => {
    const [categoryData, setCategoryData] = useState<CategoryNode[]>([]);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // Build tree data from API data
    const buildCategoryTree = useCallback(() => {
        if (!categories || !subCategories || !itemGroups) return [];

        // Map ItemGroup to CategoryNode
        const mapItemGroups = (subcategoryId: string): CategoryNode[] => {
            const parentSubCategory = subCategories.find(sub => sub.id === subcategoryId);
            return itemGroups
                .filter(item => item.product_subcategory_id === subcategoryId)
                .map(item => ({
                    id: item.id || generateNanoid(),
                    name: item.name,
                    code: item.code,
                    description: item.description,
                    type: "itemGroup" as const,
                    children: [],
                    product_subcategory_id: item.product_subcategory_id,
                    is_active: item.is_active,
                    price_deviation_limit: item.price_deviation_limit,
                    qty_deviation_limit: item.qty_deviation_limit,
                    is_used_in_recipe: item.is_used_in_recipe ?? parentSubCategory?.is_used_in_recipe ?? false,
                    is_sold_directly: item.is_sold_directly ?? parentSubCategory?.is_sold_directly ?? false
                }));
        };

        // Map SubCategory to CategoryNode
        const mapSubCategories = (categoryId: string): CategoryNode[] => {
            const parentCategory = categories.find(cat => cat.id === categoryId);
            return subCategories
                .filter(sub => sub.product_category_id === categoryId)
                .map(sub => ({
                    id: sub.id || generateNanoid(),
                    name: sub.name,
                    code: sub.code,
                    description: sub.description,
                    type: "subcategory" as const,
                    children: mapItemGroups(sub.id || ''),
                    product_category_id: sub.product_category_id,
                    is_active: sub.is_active,
                    price_deviation_limit: sub.price_deviation_limit,
                    qty_deviation_limit: sub.qty_deviation_limit,
                    is_used_in_recipe: sub.is_used_in_recipe ?? parentCategory?.is_used_in_recipe ?? false,
                    is_sold_directly: sub.is_sold_directly ?? parentCategory?.is_sold_directly ?? false
                }));
        };

        // Map Category to CategoryNode
        return categories.map(cat => ({
            id: cat.id || generateNanoid(),
            name: cat.name,
            code: cat.code,
            description: cat.description,
            type: "category" as const,
            children: mapSubCategories(cat.id || ''),
            is_active: cat.is_active,
            price_deviation_limit: cat.price_deviation_limit,
            qty_deviation_limit: cat.qty_deviation_limit,
            is_used_in_recipe: cat.is_used_in_recipe,
            is_sold_directly: cat.is_sold_directly
        }));
    }, [categories, subCategories, itemGroups]);

    // Initialize or update tree when API data changes
    useEffect(() => {
        if (!isLoading) {
            const tree = buildCategoryTree();
            setCategoryData(tree);

            // Initialize expanded state
            const initialExpanded: Record<string, boolean> = {};
            tree.forEach(category => {
                initialExpanded[category.id] = true;
            });
            setExpanded(initialExpanded);
        }
    }, [isLoading, buildCategoryTree]);

    const handleEdit = useCallback((node: CategoryNode) => {
        console.log('handleEdit called with node:', node);
    }, []);

    const handleAdd = useCallback((parent?: CategoryNode) => {
        console.log('handleAdd called with parent:', parent);
    }, []);

    const handleDelete = useCallback((node: CategoryNode) => {
        console.log('handleDelete called with node:', node);
    }, []);

    const expandAll = useCallback(() => {
        const allExpanded: Record<string, boolean> = {};

        const addAllNodes = (nodes: CategoryNode[]) => {
            nodes.forEach((node) => {
                allExpanded[node.id] = true;
                if (node.children && node.children.length > 0) {
                    addAllNodes(node.children);
                }
            });
        };

        addAllNodes(categoryData);
        setExpanded(allExpanded);
    }, [categoryData]);

    const collapseAll = useCallback(() => {
        const topLevelOnly: Record<string, boolean> = {};
        categoryData.forEach((category) => {
            topLevelOnly[category.id] = false;
        });
        setExpanded(topLevelOnly);
    }, [categoryData]);

    const toggleExpand = useCallback((id: string) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }, []);

    const updateNodeInTree = useCallback((nodes: CategoryNode[], updatedNode: CategoryNode): CategoryNode[] => {
        return nodes.map(node => {
            if (node.id === updatedNode.id) {
                return { ...node, ...updatedNode };
            }
            if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: updateNodeInTree(node.children, updatedNode)
                };
            }
            return node;
        });
    }, []);

    const addNodeToTree = useCallback((nodes: CategoryNode[], newNode: CategoryNode, parentId?: string): CategoryNode[] => {
        if (!parentId) {
            return [...nodes, newNode];
        }

        return nodes.map(node => {
            if (node.id === parentId) {
                return {
                    ...node,
                    children: [...(node.children || []), newNode]
                };
            }
            if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: addNodeToTree(node.children, newNode, parentId)
                };
            }
            return node;
        });
    }, []);

    const deleteNodeFromTree = useCallback((nodes: CategoryNode[], nodeId: string): CategoryNode[] => {
        return nodes.filter(node => {
            if (node.id === nodeId) {
                return false;
            }
            if (node.children && node.children.length > 0) {
                node.children = deleteNodeFromTree(node.children, nodeId);
            }
            return true;
        });
    }, []);

    return {
        categoryData,
        expanded,
        handleEdit,
        handleAdd,
        handleDelete,
        expandAll,
        collapseAll,
        toggleExpand,
        updateNodeInTree,
        addNodeToTree,
        deleteNodeFromTree
    };
}; 