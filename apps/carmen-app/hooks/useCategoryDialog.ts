import { useState, useCallback, useEffect } from "react";
import { CategoryNode, CategoryFormData, SubCategoryFormData, ItemGroupFormData } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";

type formSubmitType = CategoryFormData | SubCategoryFormData | ItemGroupFormData;

export interface UseCategoryDialogProps {
    onFormSubmit: (data: formSubmitType & { is_edit_type?: boolean }) => Promise<void> | void;
    categoryData?: CategoryNode[];
}

export interface UseCategoryDialogReturn {
    dialogOpen: boolean;
    dialogMode: formType;
    selectedNode: CategoryNode | undefined;
    parentNode: CategoryNode | undefined;
    handleDialogChange: (open: boolean) => void;
    handleEdit: (node: CategoryNode) => void;
    handleAdd: (parent?: CategoryNode) => void;
    handleFormSubmit: (data: formSubmitType & { is_edit_type?: boolean }) => void;
}

export const useCategoryDialog = ({
    onFormSubmit,
    categoryData = []
}: UseCategoryDialogProps): UseCategoryDialogReturn => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
    const [selectedNode, setSelectedNode] = useState<CategoryNode | undefined>();
    const [parentNode, setParentNode] = useState<CategoryNode | undefined>();

    // When editing, find and set the parent node based on the selected node
    useEffect(() => {
        if (dialogMode === formType.EDIT && selectedNode && categoryData.length > 0) {
            // For subcategories and item groups, we need to find their parent
            if (selectedNode.type === "subcategory" && selectedNode.product_category_id) {
                // Find parent category
                const parentCategory = findCategoryById(categoryData, selectedNode.product_category_id);
                if (parentCategory) {
                    setParentNode(parentCategory);
                }
            } else if (selectedNode.type === "itemGroup" && selectedNode.product_subcategory_id) {
                // Find parent subcategory
                const parentSubCategory = findSubCategoryById(categoryData, selectedNode.product_subcategory_id);
                if (parentSubCategory) {
                    setParentNode(parentSubCategory);
                }
            }
        }
    }, [dialogMode, selectedNode, categoryData]);

    // Helper function to find a category by ID
    const findCategoryById = (nodes: CategoryNode[], id: string): CategoryNode | undefined => {
        for (const node of nodes) {
            if (node.id === id) {
                return node;
            }
        }
        return undefined;
    };

    // Helper function to find a subcategory by ID
    const findSubCategoryById = (nodes: CategoryNode[], id: string): CategoryNode | undefined => {
        for (const category of nodes) {
            if (category.children) {
                for (const subCategory of category.children) {
                    if (subCategory.id === id) {
                        return subCategory;
                    }
                }
            }
        }
        return undefined;
    };

    const handleDialogChange = useCallback((open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setSelectedNode(undefined);
            setParentNode(undefined);
        }
    }, []);

    const handleEdit = useCallback((node: CategoryNode) => {
        setDialogMode(formType.EDIT);
        setSelectedNode(node);
        setDialogOpen(true);
    }, []);

    const handleAdd = useCallback((parent?: CategoryNode) => {
        setDialogMode(formType.ADD);
        setParentNode(parent);
        setSelectedNode(undefined);
        setDialogOpen(true);
    }, []);

    const handleFormSubmit = useCallback((data: formSubmitType & { is_edit_type?: boolean }) => {
        try {
            onFormSubmit(data);
        } catch (error) {
            console.error("Error in form submission:", error);
        }
    }, [onFormSubmit]);

    return {
        dialogOpen,
        dialogMode,
        selectedNode,
        parentNode,
        handleDialogChange,
        handleEdit,
        handleAdd,
        handleFormSubmit
    };
}; 