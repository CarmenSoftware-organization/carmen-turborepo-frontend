import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CategoryNode } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { CategoryForm } from "./forms/CategoryForm";
import { SubCategoryForm } from "./forms/SubCategoryForm";
import { ItemGroupForm } from "./forms/ItemGroupForm";
import type { CategoryFormData, SubCategoryFormData, ItemGroupFormData } from "@/dtos/category.dto";
import { useEffect, useState } from "react";

interface CategoryDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly selectedNode?: CategoryNode;
    readonly parentNode?: CategoryNode;
    readonly onSubmit?: (data: CategoryFormData | SubCategoryFormData | ItemGroupFormData) => void;
}

export function CategoryDialog({
    open,
    onOpenChange,
    mode,
    selectedNode,
    parentNode,
    onSubmit
}: CategoryDialogProps) {
    const [effectiveParentNode, setEffectiveParentNode] = useState<CategoryNode | undefined>(parentNode);

    // Update parent node when props change
    useEffect(() => {
        setEffectiveParentNode(parentNode);
    }, [parentNode]);

    const getNodeTypeLabel = (type?: string) => {
        switch (type) {
            case "category": return "Category";
            case "subcategory": return "Sub Category";
            case "itemGroup": return "Item Group";
            default: return "Category";
        }
    };

    const getTitle = () => {
        const prefix = mode === formType.EDIT ? "Edit" : "New";
        if (mode === formType.EDIT && selectedNode) {
            return `${prefix} ${getNodeTypeLabel(selectedNode.type)}`;
        }

        if (!parentNode) {
            return `${prefix} Category`;
        }

        if (parentNode.type === "category") {
            return `${prefix} Sub Category`;
        }

        return `${prefix} Item Group`;
    };

    const description = mode === formType.EDIT
        ? "Edit the details of the selected item"
        : "Add a new item to the hierarchy";

    const handleFormSubmit = (data: CategoryFormData | SubCategoryFormData | ItemGroupFormData) => {
        if (onSubmit) {
            onSubmit(data);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    const renderForm = () => {
        if (mode === formType.EDIT && selectedNode) {
            // For edit mode, use the selectedNode type
            if (selectedNode.type === "category") {
                return <CategoryForm
                    mode={mode}
                    selectedNode={selectedNode}
                    onSubmit={handleFormSubmit}
                    onCancel={handleClose}
                />;
            } else if (selectedNode.type === "subcategory") {
                return <SubCategoryForm
                    mode={mode}
                    selectedNode={selectedNode}
                    parentNode={effectiveParentNode}
                    onSubmit={handleFormSubmit}
                    onCancel={handleClose}
                />;
            } else {
                return <ItemGroupForm
                    mode={mode}
                    selectedNode={selectedNode}
                    parentNode={effectiveParentNode}
                    onSubmit={handleFormSubmit}
                    onCancel={handleClose}
                />;
            }
        } else {
            // For add mode, use the parentNode type
            if (!parentNode) {
                return <CategoryForm
                    mode={mode}
                    onSubmit={handleFormSubmit}
                    onCancel={handleClose}
                />;
            } else if (parentNode.type === "category") {
                return <SubCategoryForm
                    mode={mode}
                    parentNode={effectiveParentNode}
                    onSubmit={handleFormSubmit}
                    onCancel={handleClose}
                />;
            } else {
                return <ItemGroupForm
                    mode={mode}
                    parentNode={effectiveParentNode}
                    onSubmit={handleFormSubmit}
                    onCancel={handleClose}
                />;
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{getTitle()}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {open && renderForm()}
            </DialogContent>
        </Dialog>
    );
} 