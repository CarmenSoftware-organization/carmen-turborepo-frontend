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

interface CategoryDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly selectedNode?: CategoryNode;
    readonly parentNode?: CategoryNode;
    readonly parentType?: "root" | "category" | "subcategory";
    readonly onSubmit?: (data: CategoryFormData | SubCategoryFormData | ItemGroupFormData) => void;
}

export function CategoryDialog({
    open,
    onOpenChange,
    mode,
    selectedNode,
    parentNode,
    parentType = "root",
    onSubmit
}: CategoryDialogProps) {
    const getNodeTypeLabel = (type?: string) => {
        switch (type) {
            case "root": return "Category";
            case "category": return "Sub Category";
            case "subcategory": return "Item Group";
            default: return "Item Group";
        }
    };

    const getTitle = () => {
        const prefix = mode === formType.EDIT ? "Edit" : "New";
        const nodeType = mode === formType.EDIT
            ? getNodeTypeLabel(selectedNode?.type)
            : getNodeTypeLabel(parentType);
        return `${prefix} ${nodeType}`;
    };

    const description = mode === formType.EDIT
        ? "Edit the details of the selected item"
        : "Add a new item to the hierarchy";

    const renderForm = () => {
        if (parentType === "root") {
            return <CategoryForm
                mode={mode}
                selectedNode={selectedNode}
                onSubmit={onSubmit!}
                onCancel={handleClose}
            />;
        }
        if (parentType === "category") {
            return <SubCategoryForm
                mode={mode}
                selectedNode={selectedNode}
                parentNode={parentNode}
                onSubmit={onSubmit!}
                onCancel={handleClose}
            />;
        }
        return <ItemGroupForm
            mode={mode}
            selectedNode={selectedNode}
            parentNode={parentNode}
            onSubmit={onSubmit!}
            onCancel={handleClose}
        />;
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{getTitle()}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {renderForm()}
            </DialogContent>
        </Dialog>
    );
} 