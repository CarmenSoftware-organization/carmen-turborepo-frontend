import { useState, useCallback } from "react";
import { CategoryNode } from "@/dtos/category.dto";

export interface UseCategoryDeleteProps {
    onDelete: (node: CategoryNode) => Promise<void> | void;
}

export interface UseCategoryDeleteReturn {
    deleteDialogOpen: boolean;
    nodeToDelete: CategoryNode | undefined;
    handleDelete: (node: CategoryNode) => void;
    handleDeleteDialogChange: (open: boolean) => void;
    handleConfirmDelete: () => void;
    getDeleteMessage: (node: CategoryNode) => string;
}

export const useCategoryDelete = ({
    onDelete
}: UseCategoryDeleteProps): UseCategoryDeleteReturn => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [nodeToDelete, setNodeToDelete] = useState<CategoryNode | undefined>();

    const handleDelete = useCallback((node: CategoryNode) => {
        setNodeToDelete(node);
        setDeleteDialogOpen(true);
    }, []);

    const handleDeleteDialogChange = useCallback((open: boolean) => {
        setDeleteDialogOpen(open);
        if (!open) {
            setNodeToDelete(undefined);
        }
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (nodeToDelete) {
            try {
                onDelete(nodeToDelete);
            } catch (error) {
                console.error("Error in delete operation:", error);
            }
        }
    }, [nodeToDelete, onDelete]);

    const getDeleteMessage = useCallback((node: CategoryNode) => {
        const type = node.type === "category" ? "Category" :
            node.type === "subcategory" ? "Subcategory" : "Item Group";
        return `Are you sure you want to delete this ${type}? This action cannot be undone.`;
    }, []);

    return {
        deleteDialogOpen,
        nodeToDelete,
        handleDelete,
        handleDeleteDialogChange,
        handleConfirmDelete,
        getDeleteMessage
    };
}; 