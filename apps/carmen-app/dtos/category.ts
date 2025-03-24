export interface CategoryNode {
    id: string;
    name: string;
    description?: string;
    type: "category" | "subcategory" | "itemGroup";
    children?: CategoryNode[];
    itemCount?: number;
} 