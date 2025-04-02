"use client";

import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"
import TreeNode from "./TreeNode"
import { CategoryDialog } from "./CategoryDialog"
import { formType } from "@/dtos/form.dto"
import {
    CategoryFormData,
    CategoryNode,
    ItemGroupFormData,
    SubCategoryFormData,
    CategoryDto
} from "@/dtos/category.dto";
import { generateNanoid } from "@/utils/nano-id";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCategory } from "@/hooks/useCategory";
import { useSubCategory } from "@/hooks/useSubCategory";
import { useItemGroup } from "@/hooks/useItemGroup";
import { toastSuccess } from "@/components/ui-custom/Toast";
import SignInDialog from "@/components/SignInDialog";

// Define the extended SubCategory type with product_category_id
interface ExtendedSubCategory {
    id: string;
    code: string;
    name: string;
    description?: string;
    product_category_id: string;
}

// Type guard function
function hasProductCategoryId(obj: unknown): obj is ExtendedSubCategory {
    return obj !== null && typeof obj === 'object' && 'product_category_id' in obj;
}

export default function CategoryComponent() {
    const { categories, isPending: isCategoriesPending, handleSubmit: submitCategory, isUnauthorized } = useCategory();
    const { subCategories, isPending: isSubCategoriesPending, fetchSubCategories } = useSubCategory();
    const { itemGroups, isPending: isItemGroupsPending, fetchItemGroups } = useItemGroup();

    const isLoading = isCategoriesPending || isSubCategoriesPending || isItemGroupsPending;

    const [categoryData, setCategoryData] = useState<CategoryNode[]>([]);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // Build tree data from API data
    const buildCategoryTree = useCallback(() => {
        if (!categories || !subCategories || !itemGroups) return [];

        // Map ItemGroup to CategoryNode
        const mapItemGroups = (subcategoryId: string): CategoryNode[] => {
            return itemGroups
                .filter(item => item.product_subcategory_id === subcategoryId)
                .map(item => ({
                    id: item.id || generateNanoid(),
                    name: item.name,
                    code: item.code,
                    description: item.description,
                    type: "itemGroup" as const,
                    children: []
                }));
        };

        // Map SubCategory to CategoryNode
        const mapSubCategories = (categoryId: string): CategoryNode[] => {
            return (subCategories as unknown[])
                .filter(sub => hasProductCategoryId(sub) && sub.product_category_id === categoryId)
                .map(sub => ({
                    id: (sub as ExtendedSubCategory).id || generateNanoid(),
                    name: (sub as ExtendedSubCategory).name,
                    code: (sub as ExtendedSubCategory).code,
                    description: (sub as ExtendedSubCategory).description,
                    type: "subcategory" as const,
                    children: mapItemGroups((sub as ExtendedSubCategory).id || '')
                }));
        };

        // Map Category to CategoryNode
        return categories.map(cat => ({
            id: cat.id || generateNanoid(),
            name: cat.name,
            code: cat.code,
            description: cat.description,
            type: "category" as const,
            children: mapSubCategories(cat.id || '')
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

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
    const [selectedNode, setSelectedNode] = useState<CategoryNode | undefined>();
    const [parentNode, setParentNode] = useState<CategoryNode | undefined>();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [nodeToDelete, setNodeToDelete] = useState<CategoryNode | undefined>();

    const handleEdit = (node: CategoryNode) => {
        console.log('handleEdit called with node:', node);
        setDialogMode(formType.EDIT);
        setSelectedNode(node);
        setDialogOpen(true);
    };

    const handleAdd = (parent?: CategoryNode) => {
        console.log('handleAdd called with parent:', parent);
        setDialogMode(formType.ADD);
        setParentNode(parent);
        setSelectedNode(undefined);
        setDialogOpen(true);
    };

    const expandAll = () => {
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
    };

    const collapseAll = () => {
        const topLevelOnly: Record<string, boolean> = {};
        categoryData.forEach((category) => {
            topLevelOnly[category.id] = false;
        });
        setExpanded(topLevelOnly);
    };

    const toggleExpand = (id: string) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const updateNodeInTree = (nodes: CategoryNode[], updatedNode: CategoryNode): CategoryNode[] => {
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
    };

    const addNodeToTree = (nodes: CategoryNode[], newNode: CategoryNode, parentId?: string): CategoryNode[] => {
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
    };

    const handleFormSubmit = (data: CategoryFormData | SubCategoryFormData | ItemGroupFormData) => {
        console.log('handle form submit', data);
        console.log('dialog mode', dialogMode);
        console.log('selected node', selectedNode);
        console.log('parent node', parentNode);

        const getNodeType = () => {
            if (dialogMode === formType.EDIT && selectedNode) {
                return selectedNode.type;
            }
            // For new nodes, determine type based on parent
            if (!parentNode) return "category";
            if (parentNode.type === "category") return "subcategory";
            return "itemGroup";
        };

        // Generate a new ID for new nodes
        const id = dialogMode === formType.EDIT && selectedNode
            ? (selectedNode.id || generateNanoid())
            : generateNanoid();

        // Get node type
        const nodeType = getNodeType();

        // Create the node with all required properties
        const newNode: CategoryNode = {
            id,
            name: data.name,
            code: data.code,
            description: data.description,
            type: nodeType,
            children: dialogMode === formType.EDIT && selectedNode
                ? selectedNode.children || []
                : []
        };

        // Update UI immediately
        if (dialogMode === formType.EDIT) {
            setCategoryData(prev => updateNodeInTree(prev, newNode));
        } else {
            setCategoryData(prev => addNodeToTree(prev, newNode, parentNode?.id));
            if (parentNode?.id) {
                setExpanded(prev => ({
                    ...prev,
                    [parentNode.id]: true
                }));
            }
        }

        // Submit to API based on node type
        try {
            const formData = {
                ...data,
                id: newNode.id,
                is_active: true // Add is_active for CategoryDto
            };

            if (nodeType === 'category') {
                // For category, use the submitCategory function without selectedNode
                // when in ADD mode or if selectedNode is undefined
                if (dialogMode === formType.EDIT && selectedNode) {
                    // When editing, we need the existing category ID
                    submitCategory(formData as CategoryDto, dialogMode, {
                        ...formData,
                        id: selectedNode.id
                    } as CategoryDto);
                } else {
                    // When creating new, we don't need selectedNode
                    submitCategory(formData as CategoryDto, dialogMode);
                }
                toastSuccess({ message: 'Category saved successfully' });
            } else if (nodeType === 'subcategory') {
                // For subcategory, just refresh the data after a delay
                // This is a temporary solution until we add proper API integration
                setTimeout(() => {
                    fetchSubCategories();
                    toastSuccess({ message: 'Subcategory saved successfully' });
                }, 500);
            } else {
                // For item group, just refresh the data after a delay
                // This is a temporary solution until we add proper API integration
                setTimeout(() => {
                    fetchItemGroups();
                    toastSuccess({ message: 'Item group saved successfully' });
                }, 500);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }

        handleDialogChange(false);
    };

    const handleDialogChange = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setSelectedNode(undefined);
            setParentNode(undefined);
            setDialogMode(formType.ADD);
        }
    };

    const handleDelete = (node: CategoryNode) => {
        setNodeToDelete(node);
        setDeleteDialogOpen(true);
    };

    const getDeleteMessage = (node: CategoryNode) => {
        switch (node.type) {
            case "category":
                return `This will permanently delete category "${node.name}" and all its sub-categories and item groups.`;
            case "subcategory":
                return `This will permanently delete sub-category "${node.name}" and all its item groups.`;
            default:
                return `This will permanently delete item group "${node.name}".`;
        }
    };

    const deleteNodeFromTree = (nodes: CategoryNode[], nodeId: string): CategoryNode[] => {
        return nodes.map(node => {
            // If this is the node to delete, filter it out
            if (node.id === nodeId) {
                return null;
            }

            // If node has children, process them
            if (node.children && node.children.length > 0) {
                const filteredChildren = deleteNodeFromTree(node.children, nodeId);
                return {
                    ...node,
                    children: filteredChildren.filter(Boolean)
                };
            }

            return node;
        }).filter(Boolean) as CategoryNode[];
    };

    const handleConfirmDelete = () => {
        if (nodeToDelete) {
            setCategoryData(prev => deleteNodeFromTree(prev, nodeToDelete.id));
            setDeleteDialogOpen(false);
            setNodeToDelete(undefined);
        }
    };

    // Get node type label for display
    const getNodeTypeLabel = (type?: string) => {
        switch (type) {
            case "subcategory": return "Sub Category";
            case "itemGroup": return "Item Group";
            default: return "Category";
        }
    };

    // Render content based on loading state
    const renderContent = () => {
        if (isUnauthorized) {
            return (
                <SignInDialog
                    open={true}
                    onOpenChange={() => !isUnauthorized}
                />
            );
        }

        if (isCategoriesPending) {
            return (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        return categoryData.map((node) => (
            <TreeNode
                key={node.id}
                node={node}
                expanded={expanded}
                toggleExpand={toggleExpand}
                onEdit={handleEdit}
                onAdd={handleAdd}
                onDelete={handleDelete}
            />
        ));
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="container flex items-center justify-end">
                <div className="flex gap-2">
                    <Button variant="outline" onClick={expandAll}>
                        Expand All
                    </Button>
                    <Button variant="outline" onClick={collapseAll}>
                        Collapse All
                    </Button>
                    <Button onClick={() => handleAdd()}>
                        <Plus className="h-4 w-4" /> Add Category
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : renderContent()}
            <CategoryDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                mode={dialogMode}
                selectedNode={selectedNode}
                parentNode={parentNode}
                parentType={(parentNode?.type === "itemGroup" ? "subcategory" : parentNode?.type) ?? "root"}
                onSubmit={handleFormSubmit}
            />
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {getNodeTypeLabel(nodeToDelete?.type)}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {nodeToDelete && getDeleteMessage(nodeToDelete)}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setNodeToDelete(undefined)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
