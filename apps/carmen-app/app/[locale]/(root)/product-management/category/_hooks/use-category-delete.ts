import { useState, useCallback } from "react";
import { CategoryNode } from "@/dtos/category.dto";

export interface UseCategoryDeleteProps {
    onDelete: (node: CategoryNode) => Promise<void> | void;
    getDeleteMessage?: (node: CategoryNode) => string;
}

export interface UseCategoryDeleteReturn {
    deleteDialogOpen: boolean;
    nodeToDelete: CategoryNode | undefined;
    handleDelete: (node: CategoryNode) => void;
    handleDeleteDialogChange: (open: boolean) => void;
    handleConfirmDelete: () => void;
    getDeleteMessage: (node: CategoryNode) => string;
}

const TYPE_LABELS: Record<CategoryNode['type'], string> = {
    category: 'Category',
    subcategory: 'Subcategory',
    itemGroup: 'Item Group'
};

export const useCategoryDelete = ({
    onDelete,
    getDeleteMessage: customGetDeleteMessage
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

    const defaultGetDeleteMessage = useCallback((node: CategoryNode) => {
        const type = TYPE_LABELS[node.type];
        return `Are you sure you want to delete this ${type}? This action cannot be undone.`;
    }, []);

    const getDeleteMessage = customGetDeleteMessage || defaultGetDeleteMessage;

    return {
        deleteDialogOpen,
        nodeToDelete,
        handleDelete,
        handleDeleteDialogChange,
        handleConfirmDelete,
        getDeleteMessage
    };
}; 