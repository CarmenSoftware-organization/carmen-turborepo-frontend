export interface TreeNodeData {
  id: string;
  name: string;
  local_name?: string;
  code?: string;
  type: "category" | "product";
  children: string[];
  productData?: any; // To store full product data if needed
}

export interface MoqItem {
  id: string;
  unit_id: string;
  unit_name: string;
  note: string;
  qty: number;
}
