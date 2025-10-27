export interface TreeNodeData {
    id: string;
    name: string;
    code?: string;
    description?: string;
    local_name?: string;
    type: 'category' | 'subcategory' | 'itemgroup' | 'product';
    children?: string[];
}
export interface ProductData {
    id: string;
    name: string;
    local_name?: string;
    code?: string;
    description?: string;
    product_category?: {
        id: string;
        name: string;
    };
    product_sub_category?: {
        id: string;
        name: string;
    };
    product_item_group?: {
        id: string;
        name: string;
    };
}

export interface TreeStructure {
    items: Record<string, TreeNodeData>;
    rootItems: string[];
}

export type ViewMode = 'tree' | 'list';
