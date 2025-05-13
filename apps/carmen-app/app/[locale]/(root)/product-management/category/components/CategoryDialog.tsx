import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CategoryNode, NODE_TYPE } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { CategoryForm } from "./forms/CategoryForm";
import { SubCategoryForm } from "./forms/SubCategoryForm";
import { ItemGroupForm } from "./forms/ItemGroupForm";
import type { CategoryFormData, SubCategoryFormData, ItemGroupFormData } from "@/dtos/category.dto";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
    const tCategory = useTranslations("Category");
    const tCommon = useTranslations("Common");
    const [effectiveParentNode, setEffectiveParentNode] = useState<CategoryNode | undefined>(parentNode);

    // Update parent node when props change
    useEffect(() => {
        setEffectiveParentNode(parentNode);
    }, [parentNode]);

    const getNodeTypeLabel = (type?: string) => {
        switch (type) {
            case NODE_TYPE.CATEGORY: return tCategory("category");
            case NODE_TYPE.SUBCATEGORY: return tCategory("subcategory");
            case NODE_TYPE.ITEM_GROUP: return tCategory("itemGroup");
            default: return tCategory("category");
        }
    };

    const getTitle = () => {
        const prefix = mode === formType.EDIT ? tCommon("edit") : tCommon("add");
        if (mode === formType.EDIT && selectedNode) {
            return `${prefix} ${getNodeTypeLabel(selectedNode.type)}`;
        }

        if (!parentNode) {
            return `${prefix} ${tCategory("category")}`;
        }

        if (parentNode.type === NODE_TYPE.CATEGORY) {
            return `${prefix} ${tCategory("subcategory")}`;
        }

        return `${prefix} ${tCategory("itemGroup")}`;
    };

    const handleFormSubmit = (data: CategoryFormData | SubCategoryFormData | ItemGroupFormData) => {
        if (onSubmit) {
            onSubmit(data);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    const renderForm = () => {
        // Edit mode
        if (mode === formType.EDIT && selectedNode) {
            if (selectedNode.type === NODE_TYPE.CATEGORY) {
                return <CategoryForm
                    mode={mode}
                    selectedNode={selectedNode}
                    onSubmit={handleFormSubmit}
                    onCancel={handleClose}
                />;
            } else if (selectedNode.type === NODE_TYPE.SUBCATEGORY) {
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
        }

        // Add mode
        if (!parentNode) {
            return <CategoryForm
                mode={mode}
                onSubmit={handleFormSubmit}
                onCancel={handleClose}
            />;
        } else if (parentNode.type === NODE_TYPE.CATEGORY) {
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
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{getTitle()}</DialogTitle>
                </DialogHeader>
                {open && renderForm()}
            </DialogContent>
        </Dialog>
    );
} 