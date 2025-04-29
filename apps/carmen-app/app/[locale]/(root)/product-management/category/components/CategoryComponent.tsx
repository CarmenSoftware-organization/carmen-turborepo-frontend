"use client";

import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Plus } from "lucide-react"
import TreeNode from "./TreeNode"
import { CategoryDialog } from "./CategoryDialog"
import { useCategory } from "@/hooks/useCategory";
import { useSubCategory } from "@/hooks/useSubCategory";
import { useItemGroup } from "@/hooks/useItemGroup";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import SignInDialog from "@/components/SignInDialog";
import { formType } from "@/dtos/form.dto";
import { CategoryDto, SubCategoryDto, ItemGroupDto, CategoryNode } from "@/dtos/category.dto";
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
import { useState, useEffect } from "react";
import { useCategoryTree } from "@/hooks/useCategoryTree";
import { useCategoryDialog } from "@/hooks/useCategoryDialog";
import { useCategoryDelete } from "@/hooks/useCategoryDelete";
import { ScrollArea } from "@/components/ui/scroll-area";
import CategoryLoading from "@/components/loading/CategoryLoading";

export default function CategoryComponent() {
    const [signInOpen, setSignInOpen] = useState(false);
    const {
        categories,
        isPending: isCategoriesPending,
        handleSubmit: submitCategory,
        handleDelete: deleteCategory,
        isUnauthorized
    } = useCategory();


    // Set dialog to open when unauthorized
    useEffect(() => {
        if (isUnauthorized) {
            setSignInOpen(true);
        }
    }, [isUnauthorized]);

    const { subCategories, isPending: isSubCategoriesPending, handleSubmit: submitSubCategory } = useSubCategory();
    const { itemGroups, isPending: isItemGroupsPending, handleSubmit: submitItemGroup } = useItemGroup();

    const isLoading = isCategoriesPending || isSubCategoriesPending || isItemGroupsPending;

    const {
        categoryData,
        expanded,
        expandAll,
        collapseAll,
        toggleExpand
    } = useCategoryTree({
        categories,
        subCategories,
        itemGroups,
        isLoading
    });

    const {
        dialogOpen,
        dialogMode,
        selectedNode,
        parentNode,
        handleDialogChange,
        handleEdit: dialogHandleEdit,
        handleAdd: dialogHandleAdd,
        handleFormSubmit
    } = useCategoryDialog({
        categoryData,
        onFormSubmit: async (data) => {
            try {
                let success = false;
                let result;

                if (dialogMode === formType.EDIT && selectedNode) {
                    // Edit mode
                    if (selectedNode.type === "category") {
                        const categoryDto: CategoryDto = {
                            id: selectedNode.id,
                            code: data.code,
                            name: data.name,
                            description: data.description,
                            is_active: true,
                            price_deviation_limit: data.price_deviation_limit ?? 0,
                            qty_deviation_limit: data.qty_deviation_limit ?? 0,
                            is_used_in_recipe: data.is_used_in_recipe ?? false,
                            is_sold_directly: data.is_sold_directly ?? false
                        };
                        result = await submitCategory(categoryDto, dialogMode, categoryDto);
                        success = !!result;
                    } else if (selectedNode.type === "subcategory") {
                        const subCategoryDto: SubCategoryDto = {
                            id: selectedNode.id,
                            code: data.code,
                            name: data.name,
                            description: data.description,
                            is_active: true,
                            product_category_id: parentNode?.id ?? selectedNode.product_category_id ?? "",
                            price_deviation_limit: data.price_deviation_limit ?? 0,
                            qty_deviation_limit: data.qty_deviation_limit ?? 0,
                            is_used_in_recipe: data.is_used_in_recipe ?? false,
                            is_sold_directly: data.is_sold_directly ?? false
                        };
                        result = await submitSubCategory(subCategoryDto, dialogMode, subCategoryDto);
                        success = !!result;
                    } else {
                        const itemGroupDto: ItemGroupDto = {
                            id: selectedNode.id,
                            code: data.code,
                            name: data.name,
                            description: data.description,
                            is_active: true,
                            product_subcategory_id: parentNode?.id ?? selectedNode.product_subcategory_id ?? "",
                            price_deviation_limit: data.price_deviation_limit ?? 0,
                            qty_deviation_limit: data.qty_deviation_limit ?? 0,
                            is_used_in_recipe: data.is_used_in_recipe ?? false,
                            is_sold_directly: data.is_sold_directly ?? false
                        };
                        result = await submitItemGroup(itemGroupDto, dialogMode, itemGroupDto);
                        success = !!result;
                    }
                } else {
                    // Add mode
                    const isCategory = !parentNode;
                    const isSubCategory = parentNode?.type === "category";

                    if (isCategory) {
                        const categoryDto: CategoryDto = {
                            id: "", // Will be set by the backend
                            code: data.code,
                            name: data.name,
                            description: data.description,
                            is_active: true,
                            price_deviation_limit: data.price_deviation_limit ?? 0,
                            qty_deviation_limit: data.qty_deviation_limit ?? 0,
                            is_used_in_recipe: data.is_used_in_recipe ?? false,
                            is_sold_directly: data.is_sold_directly ?? false
                        };
                        result = await submitCategory(categoryDto, dialogMode);
                        success = !!result;
                    } else if (isSubCategory) {
                        const subCategoryDto: SubCategoryDto = {
                            id: "", // Will be set by the backend
                            code: data.code,
                            name: data.name,
                            description: data.description,
                            is_active: true,
                            product_category_id: parentNode!.id,
                            price_deviation_limit: data.price_deviation_limit ?? 0,
                            qty_deviation_limit: data.qty_deviation_limit ?? 0,
                            is_used_in_recipe: data.is_used_in_recipe ?? false,
                            is_sold_directly: data.is_sold_directly ?? false
                        };
                        result = await submitSubCategory(subCategoryDto, dialogMode);
                        success = !!result;
                    } else {
                        const itemGroupDto: ItemGroupDto = {
                            id: "", // Will be set by the backend
                            code: data.code,
                            name: data.name,
                            description: data.description,
                            is_active: true,
                            product_subcategory_id: parentNode!.id,
                            price_deviation_limit: data.price_deviation_limit ?? 0,
                            qty_deviation_limit: data.qty_deviation_limit ?? 0,
                            is_used_in_recipe: data.is_used_in_recipe ?? false,
                            is_sold_directly: data.is_sold_directly ?? false
                        };
                        result = await submitItemGroup(itemGroupDto, dialogMode);
                        success = !!result;
                    }
                }

                if (success) {
                    toastSuccess({ message: "Operation completed successfully" });
                    handleDialogChange(false); // Close dialog only on success
                } else {
                    toastError({ message: "Operation failed. Please try again." });
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                toastError({ message: "Operation failed. Please try again." });
                // Don't close dialog on error
            }
        }
    });

    const {
        deleteDialogOpen,
        nodeToDelete,
        handleDeleteDialogChange,
        handleConfirmDelete,
        handleDelete: deleteHandleDelete,
        getDeleteMessage
    } = useCategoryDelete({
        onDelete: async (node) => {
            try {
                let success = false;
                const nodeType = node.type;
                let result;

                if (nodeType === "category") {
                    // Use direct deleteCategory service instead of setting is_active flag
                    const categoryDto: CategoryDto = {
                        id: node.id,
                        code: node.code,
                        name: node.name,
                        description: node.description,
                        is_active: true,
                        price_deviation_limit: node.price_deviation_limit ?? 0,
                        qty_deviation_limit: node.qty_deviation_limit ?? 0,
                        is_used_in_recipe: node.is_used_in_recipe ?? false,
                        is_sold_directly: node.is_sold_directly ?? false
                    };
                    result = await deleteCategory(categoryDto);
                    success = !!result;
                } else if (nodeType === "subcategory") {
                    const subCategoryDto: SubCategoryDto = {
                        id: node.id,
                        code: node.code,
                        name: node.name,
                        description: node.description,
                        is_active: false,
                        product_category_id: node.product_category_id ?? "",
                        price_deviation_limit: node.price_deviation_limit ?? 0,
                        qty_deviation_limit: node.qty_deviation_limit ?? 0,
                        is_used_in_recipe: node.is_used_in_recipe ?? false,
                        is_sold_directly: node.is_sold_directly ?? false
                    };
                    result = await submitSubCategory(subCategoryDto, formType.EDIT, subCategoryDto);
                    success = !!result;
                } else {
                    // Must be itemGroup
                    const itemGroupDto: ItemGroupDto = {
                        id: node.id,
                        code: node.code,
                        name: node.name,
                        description: node.description,
                        is_active: false,
                        product_subcategory_id: node.product_subcategory_id ?? "",
                        price_deviation_limit: node.price_deviation_limit ?? 0,
                        qty_deviation_limit: node.qty_deviation_limit ?? 0,
                        is_used_in_recipe: node.is_used_in_recipe ?? false,
                        is_sold_directly: node.is_sold_directly ?? false
                    };
                    result = await submitItemGroup(itemGroupDto, formType.EDIT, itemGroupDto);
                    success = !!result;
                }

                if (success) {
                    toastSuccess({ message: "Item deleted successfully" });
                    handleDeleteDialogChange(false); // Close dialog only on success
                } else {
                    toastError({ message: "Delete operation failed. Please try again." });
                }
            } catch (error) {
                console.error("Error deleting item:", error);
                toastError({ message: "Delete operation failed. Please try again." });
                // Don't close dialog on error
            }
        }
    });

    // Connect tree events to dialog actions
    const handleEdit = (node: CategoryNode) => {
        dialogHandleEdit(node);
    };

    const handleAdd = (parent?: CategoryNode) => {
        dialogHandleAdd(parent);
    };

    const handleDelete = (node: CategoryNode) => {
        deleteHandleDelete(node);
    };

    const getNodeTypeLabel = (type?: string) => {
        switch (type) {
            case "category":
                return "Category";
            case "subcategory":
                return "Subcategory";
            case "itemGroup":
                return "Item Group";
            default:
                return "Item";
        }
    };

    if (isUnauthorized) {
        return <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />;
    }

    const renderContent = () => {
        if (isLoading) {
            return <CategoryLoading />
        }

        // Default return when not loading and authorized
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Category</h1>
                    <div className="flex items-center gap-2">
                        <Button onClick={expandAll} size={'sm'} variant={'outline'}>
                            <ChevronDown className="h-4 w-4" />
                            Expand All
                        </Button>
                        <Button onClick={collapseAll} size={'sm'} variant={'outline'}>
                            <ChevronUp className="h-4 w-4" />
                            Collapse All
                        </Button>
                        <Button onClick={() => handleAdd()} size={'sm'}>
                            <Plus className="h-4 w-4" />
                            Add Category
                        </Button>
                    </div>

                </div>

                <ScrollArea className="h-[calc(98vh-120px)] border rounded-lg">
                    {categoryData.length > 0 ? (
                        categoryData.map((category: CategoryNode) => (
                            <TreeNode
                                key={category.id}
                                node={category}
                                expanded={expanded}
                                toggleExpand={toggleExpand}
                                onEdit={handleEdit}
                                onAdd={handleAdd}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-muted-foreground">No categories found</p>
                        </div>
                    )}
                </ScrollArea>

                <CategoryDialog
                    open={dialogOpen}
                    onOpenChange={handleDialogChange}
                    mode={dialogMode}
                    selectedNode={selectedNode}
                    parentNode={parentNode}
                    onSubmit={handleFormSubmit}
                />

                <AlertDialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete {getNodeTypeLabel(nodeToDelete?.type)}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {nodeToDelete && getDeleteMessage(nodeToDelete)}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    };

    return renderContent();
}
