export interface TreeNodeData {
  id: string;
  name: string;
  local_name?: string;
  code?: string;
  description?: string;
  type: "category" | "product" | "subcategory" | "itemgroup";
  children: string[];
  productData?: any; // To store full product data if needed
  product_category?: { id: string; name: string };
  product_sub_category?: { id: string; name: string };
  product_item_group?: { id: string; name: string };
  inventory_unit_name?: string;
}

export interface MoqItem {
  id: string;
  unit_id: string;
  unit_name: string;
  note: string;
  qty: number;
}
