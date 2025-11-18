"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, X, ChevronRight, ChevronDown, Package, Folder } from "lucide-react";
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
  isExpanded?: boolean;
  isIndeterminate?: boolean;
  product?: Product;
}

interface WorkflowProductsProps {
  form: UseFormReturn<WorkflowCreateModel>;
  listProduct: Product[];
  isEditing: boolean;
  onSave: (products: Product[]) => void;
}

function buildProductTree(products: ProductListWithAssigned[]): TreeNode[] {
  const categories = new Map<string, TreeNode>();
  const subCategories = new Map<string, TreeNode>();
  const itemGroups = new Map<string, TreeNode>();

  products.forEach((product) => {
    if (!categories.has(product.product_category.name)) {
      if (product.product_category.name) {
        categories.set(product.product_category.name, {
          id: product.product_category.id,
          name: product.product_category.name,
          type: "category",
          children: [],
          isExpanded: true,
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
          isExpanded: true,
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
          isExpanded: true,
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

function updateNodeSelection(node: TreeNode, isSelected: boolean): void {
  node.isSelected = isSelected;
  node.isIndeterminate = false;
  node.children?.forEach((child) => updateNodeSelection(child, isSelected));
}

const WorkflowProducts: React.FC<WorkflowProductsProps> = ({
  form,
  listProduct,
  isEditing,
  onSave,
}: WorkflowProductsProps) => {
  const initialProducts = form.getValues("data")?.products || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [productTree, setProductTree] = useState<TreeNode[]>(() => {
    const allProducts = listProduct.map((p) => ({
      ...p,
      isAssigned: initialProducts.some((ip) => ip.id === p.id),
    }));
    return buildProductTree(allProducts);
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleNodeToggle = (node: TreeNode) => {
    node.isExpanded = !node.isExpanded;
    setProductTree([...productTree]);
  };

  const handleNodeSelect = (node: TreeNode) => {
    if (!isEditing) return;

    const newIsSelected = !node.isSelected;
    updateNodeSelection(node, newIsSelected);
    setProductTree([...productTree]);
    handleSaveProducts();
  };

  const handleSaveProducts = () => {
    const getSelectedProducts = (nodes: TreeNode[]): Product[] => {
      return nodes.flatMap((node) => {
        if (node.type === "product" && node.isSelected && node.product) {
          return [node.product];
        }
        return node.children ? getSelectedProducts(node.children) : [];
      });
    };

    const selectedProducts = getSelectedProducts(productTree);
    onSave(selectedProducts);
  };

  const handleCancelProducts = () => {
    const allProducts = listProduct.map((p) => ({
      ...p,
      isAssigned: initialProducts.some((ip) => ip.id === p.id),
    }));
    setProductTree(buildProductTree(allProducts));
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isMatchingSearch =
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.type === "product" &&
        node.product?.code.toLowerCase().includes(searchTerm.toLowerCase()));

    if (
      searchTerm &&
      !isMatchingSearch &&
      !node.children?.some(
        (child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (child.type === "product" &&
            child.product?.code.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    ) {
      return null;
    }

    return (
      <div key={node.id} className={cn("py-1", level > 0 && "ml-6")}>
        <div className="flex items-center gap-2">
          {node.children && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => handleNodeToggle(node)}
            >
              {node.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!node.children && <div className="w-4" />}
          <Checkbox
            checked={node.isSelected}
            disabled={!isEditing}
            onCheckedChange={() => handleNodeSelect(node)}
            className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:opacity-80"
            {...(node.isIndeterminate && { "data-state": "indeterminate" })}
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
        {node.children && node.isExpanded && (
          <div className="mt-1">
            {node.children.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Assign Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Products</Label>
              <Input
                id="search"
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="border rounded-md p-4">
              {productTree.map((node) => renderTreeNode(node))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowProducts;
