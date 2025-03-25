import { formType } from "@/dtos/form.dto";
import { CategoryFormData, SubCategoryFormData, ItemGroupFormData, CategoryNode } from "@/dtos/category";

export interface CategoryDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly selectedNode?: CategoryNode;
    readonly parentType?: "root" | "category" | "subcategory";
    readonly parentNode?: CategoryNode;
    readonly onSubmit?: (data: CategoryFormData | SubCategoryFormData | ItemGroupFormData) => void;
}

export interface CategoryFormProps {
    readonly mode: formType;
    readonly selectedNode?: CategoryNode;
    readonly parentNode?: CategoryNode;
    readonly onSubmit: (data: CategoryFormData | SubCategoryFormData | ItemGroupFormData) => void;
} 