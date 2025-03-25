"use client";

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Plus } from "lucide-react"
import TreeNode from "./TreeNode"
import { mockCategories, mockSubCategories, mockItemGroups } from "@/mock-data/category"
import { CategoryDialog } from "./CategoryDialog"
import { formType } from "@/dtos/form.dto"
import { CategoryFormData, CategoryNode, ItemGroupFormData, SubCategoryFormData } from "@/dtos/category";
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

const createItemGroupNode = (itemGroup: typeof mockItemGroups[0]): CategoryNode => ({
    id: itemGroup.id,
    name: itemGroup.name,
    description: itemGroup.description,
    type: "itemGroup" as const,
    children: []
});

const createSubCategoryNode = (subCategory: typeof mockSubCategories[0]): CategoryNode => {
    const itemGroups = mockItemGroups
        .filter(item => item.sub_category_id === subCategory.id)
        .map(createItemGroupNode);

    return {
        id: subCategory.id,
        name: subCategory.name,
        description: subCategory.description,
        type: "subcategory" as const,
        children: itemGroups
    };
};

const createCategoryNode = (category: typeof mockCategories[0]): CategoryNode => {
    const subCategories = mockSubCategories
        .filter(sub => sub.category_id === category.id)
        .map(createSubCategoryNode);

    return {
        id: category.id,
        name: category.name,
        description: category.description,
        type: "category" as const,
        children: subCategories
    };
};

export default function CategoryComponent() {
    const [categoryData, setCategoryData] = useState<CategoryNode[]>(() =>
        mockCategories.map(createCategoryNode)
    );

    const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
        const initialExpanded: Record<string, boolean> = {};
        categoryData.forEach((category) => {
            initialExpanded[category.id] = true;
        });
        return initialExpanded;
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
    const [selectedNode, setSelectedNode] = useState<CategoryNode | undefined>();
    const [parentNode, setParentNode] = useState<CategoryNode | undefined>();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [nodeToDelete, setNodeToDelete] = useState<CategoryNode | undefined>();

    const handleEdit = (node: CategoryNode) => {
        setDialogMode(formType.EDIT);
        setSelectedNode(node);
        setDialogOpen(true);
    };

    const handleAdd = (parent?: CategoryNode) => {
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
        const getNodeType = () => {
            if (dialogMode === formType.EDIT) {
                return selectedNode!.type;
            }
            // For new nodes, determine type based on parent
            if (!parentNode) return "category";
            if (parentNode.type === "category") return "subcategory";
            return "itemGroup";
        };

        const newNode: CategoryNode = {
            id: dialogMode === formType.EDIT ? selectedNode!.id : generateNanoid(),
            name: data.name,
            description: data.description,
            type: getNodeType(),
            children: dialogMode === formType.EDIT ? selectedNode!.children : []
        };

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

    const getNodeTypeLabel = (type?: string) => {
        switch (type) {
            case "subcategory": return "Sub Category";
            case "itemGroup": return "Item Group";
            default: return "Category";
        }
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
            {categoryData.map((node) => (
                <TreeNode
                    key={node.id}
                    node={node}
                    expanded={expanded}
                    toggleExpand={toggleExpand}
                    onEdit={handleEdit}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                />
            ))}
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
