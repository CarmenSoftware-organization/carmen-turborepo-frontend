import { CategoryNode, CategoryDto, SubCategoryDto, ItemGroupDto } from "@/dtos/category.dto";

export interface UseCategoryTreeProps {
    categories: CategoryDto[];
    subCategories: SubCategoryDto[];
    itemGroups: ItemGroupDto[];
    isLoading: boolean;
}

export interface UseCategoryTreeReturn {
    categoryData: CategoryNode[];
    expanded: Record<string, boolean>;
    handleEdit: (node: CategoryNode) => void;
    handleAdd: (parent?: CategoryNode) => void;
    handleDelete: (node: CategoryNode) => void;
    expandAll: () => void;
    collapseAll: () => void;
    toggleExpand: (id: string) => void;
    updateNodeInTree: (nodes: CategoryNode[], updatedNode: CategoryNode) => CategoryNode[];
    addNodeToTree: (nodes: CategoryNode[], newNode: CategoryNode, parentId?: string) => CategoryNode[];
    deleteNodeFromTree: (nodes: CategoryNode[], nodeId: string) => CategoryNode[];
} 