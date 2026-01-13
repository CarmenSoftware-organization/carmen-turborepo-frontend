"use client";
import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronDown, Package, Folder } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Product, WorkflowCreateModel } from "@/dtos/workflows.dto";
import { UseFormReturn } from "react-hook-form";

interface ProductListWithAssigned extends Product {
  isAssigned: boolean;
}

interface TreeNode {
  id: string;
  name: string;
  type: "category" | "subCategory" | "itemGroup" | "product";
  children?: TreeNode[];
  isSelected?: boolean;
  product?: Product;
}

interface WorkflowProductsProps {
  form: UseFormReturn<WorkflowCreateModel>;
  listProduct: Product[];
  isEditing: boolean;
  onSave: (products: Product[]) => void;
}

// Memoized TreeNodeItem component to prevent unnecessary re-renders
interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  expandedIds: Set<string>;
  searchTerm: string;
  isEditing: boolean;
  onToggle: (nodeId: string) => void;
  onSelect: (node: TreeNode) => void;
}

const TreeNodeItem = memo(({ node, level, expandedIds, searchTerm, isEditing, onToggle, onSelect }: TreeNodeItemProps) => {
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const lowerSearchTerm = searchTerm.toLowerCase();

  // Check if this node or any of its children match the search
  const matchesSearch = (() => {
    if (!searchTerm) return true;

    const nameMatches = node.name.toLowerCase().includes(lowerSearchTerm);
    if (nameMatches) return true;

    if (node.type === "product" && node.product?.code) {
      if (node.product.code.toLowerCase().includes(lowerSearchTerm)) return true;
    }

    // Check if any children match
    if (hasChildren) {
      const checkChildren = (children: TreeNode[]): boolean => {
        return children.some((child) => {
          if (child.name.toLowerCase().includes(lowerSearchTerm)) return true;
          if (child.type === "product" && child.product?.code?.toLowerCase().includes(lowerSearchTerm)) {
            return true;
          }
          if (child.children) return checkChildren(child.children);
          return false;
        });
      };
      return checkChildren(node.children!);
    }

    return false;
  })();

  if (!matchesSearch) return null;

  return (
    <div className={cn("py-1", level > 0 && "ml-6")}>
      <div className="flex items-center gap-2">
        {hasChildren && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => onToggle(node.id)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
        {!hasChildren && <div className="w-4" />}
        <Checkbox
          checked={node.isSelected || false}
          disabled={!isEditing}
          onCheckedChange={() => onSelect(node)}
        />
        {node.type === "product" ? (
          <Package className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Folder className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm">
          {node.type === "product" && node.product
            ? `${node.product.code} - ${node.name}`
            : node.name}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {node.children!.map((child) => (
            <MemoizedTreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              searchTerm={searchTerm}
              isEditing={isEditing}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNodeItem.displayName = "TreeNodeItem";

const MemoizedTreeNodeItem = memo(TreeNodeItem);

function buildProductTree(products: ProductListWithAssigned[]): TreeNode[] {
  const categories = new Map<string, TreeNode>();
  const subCategories = new Map<string, TreeNode>();
  const itemGroups = new Map<string, TreeNode>();

  products.forEach((product) => {
    if (!categories.has(product.product_category.name)) {
      if (product.product_category?.name) {
        categories.set(product.product_category.name, {
          id: product.product_category.id,
          name: product.product_category.name,
          type: "category",
          children: [],
          isSelected: false,
        });
      }
    }

    const subCategoryKey = `${product.product_category.id}-${product.product_sub_category.id}`;

    if (!subCategories.has(subCategoryKey) && product.product_sub_category.name) {
      if (product.product_sub_category.name) {
        subCategories.set(subCategoryKey, {
          id: product.product_sub_category.id,
          name: product.product_sub_category.name,
          type: "subCategory",
          children: [],
          isSelected: false,
        });
        categories
          .get(product.product_category.name)
          ?.children?.push(subCategories.get(subCategoryKey)!);
      }
    }

    const itemGroupKey = `${subCategoryKey}-${product.product_item_group.id}`;
    if (!itemGroups.has(itemGroupKey) && product.product_item_group.name) {
      if (product.product_item_group.name) {
        itemGroups.set(itemGroupKey, {
          id: product.product_item_group.id,
          name: product.product_item_group.name,
          type: "itemGroup",
          children: [],
          isSelected: false,
        });
      }
      subCategories.get(subCategoryKey)?.children?.push(itemGroups.get(itemGroupKey)!);
    }

    // Add product to its item group
    const productNode: TreeNode = {
      id: `product-${product.id}`,
      name: product.name,
      type: "product",
      isSelected: product.isAssigned,
      product: product,
    };
    itemGroups.get(itemGroupKey)?.children?.push(productNode);
  });

  return Array.from(categories.values());
}

// Deep clone a node and update selection
function updateNodeSelection(node: TreeNode, isSelected: boolean): TreeNode {
  const newNode: TreeNode = { ...node, isSelected };
  if (node.children) {
    newNode.children = node.children.map((child) => updateNodeSelection(child, isSelected));
  }
  return newNode;
}

// Find and update a node in the tree by id
function updateNodeInTree(nodes: TreeNode[], nodeId: string, isSelected: boolean): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return updateNodeSelection(node, isSelected);
    }
    if (node.children) {
      return { ...node, children: updateNodeInTree(node.children, nodeId, isSelected) };
    }
    return node;
  });
}

// Get all selected products
function getSelectedProducts(nodes: TreeNode[]): Product[] {
  const result: Product[] = [];
  const traverse = (children: TreeNode[]) => {
    for (const node of children) {
      if (node.type === "product" && node.isSelected && node.product) {
        result.push(node.product);
      }
      if (node.children) {
        traverse(node.children);
      }
    }
  };
  traverse(nodes);
  return result;
}

const WorkflowProducts: React.FC<WorkflowProductsProps> = ({
  form,
  listProduct,
  isEditing,
  onSave,
}: WorkflowProductsProps) => {
  const tWf = useTranslations("Workflow");
  const initialProducts = form.getValues("data")?.products || [];

  // State for product tree
  const [productTree, setProductTree] = useState<TreeNode[]>(() => {
    const allProducts = listProduct.map((p) => ({
      ...p,
      isAssigned: initialProducts.some((ip) => ip.id === p.id),
    }));
    return buildProductTree(allProducts);
  });

  // Track expanded nodes separately for better performance
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const [searchTerm, setSearchTerm] = useState("");

  // Debounced save to parent
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Debounced save function
  const triggerSave = useCallback((products: Product[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onSave(products);
    }, 300);
  }, [onSave]);

  // Immediate save (called when leaving the tab or saving form)
  useEffect(() => {
    return () => {
      // Save immediately when component unmounts
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      const selectedProducts = getSelectedProducts(productTree);
      onSave(selectedProducts);
    };
  }, [productTree, onSave]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleToggle = useCallback((nodeId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const handleSelect = useCallback((node: TreeNode) => {
    if (!isEditing) return;

    const newSelectionState = !node.isSelected;
    const updatedTree = updateNodeInTree(productTree, node.id, newSelectionState);
    setProductTree(updatedTree);

    // Trigger debounced save
    const selectedProducts = getSelectedProducts(updatedTree);
    triggerSave(selectedProducts);
  }, [isEditing, productTree, triggerSave]);

  // Auto-expand first level by default
  useEffect(() => {
    if (expandedIds.size === 0 && productTree.length > 0) {
      const defaultExpanded = new Set<string>();
      productTree.forEach((category: TreeNode) => {
        defaultExpanded.add(category.id);
        category.children?.forEach((sub: TreeNode) => {
          defaultExpanded.add(sub.id);
        });
      });
      setExpandedIds(defaultExpanded);
    }
  }, [productTree]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{tWf("assign_products")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">{tWf("search_products")}</Label>
              <Input
                id="search"
                placeholder={tWf("search_by_name_or_code")}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="border rounded-md p-4">
              {productTree.map((node: TreeNode) => (
                <MemoizedTreeNodeItem
                  key={node.id}
                  node={node}
                  level={0}
                  expandedIds={expandedIds}
                  searchTerm={searchTerm}
                  isEditing={isEditing}
                  onToggle={handleToggle}
                  onSelect={handleSelect}
                />
              ))}
              {productTree.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {tWf("no_products_found")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowProducts;
