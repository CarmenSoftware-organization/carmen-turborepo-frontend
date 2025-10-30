"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Plus, Search, X } from "lucide-react";
import TreeNode from "./TreeNode";
import { CategoryDialog } from "./CategoryDialog";
import { useCategory } from "@/hooks/use-category";
import { useSubCategory } from "@/app/[locale]/(root)/product-management/category/_hooks/use-subcategory";
import { useItemGroup } from "@/hooks/use-item-group";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import SignInDialog from "@/components/SignInDialog";
import { formType } from "@/dtos/form.dto";
import {
  CategoryDto,
  SubCategoryDto,
  ItemGroupDto,
  CategoryNode,
  NODE_TYPE,
} from "@/dtos/category.dto";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useCategoryTree } from "@/app/[locale]/(root)/product-management/category/_hooks/use-category-tree";
import { useCategoryDialog } from "@/app/[locale]/(root)/product-management/category/_hooks/use-category-dialog";
import { useCategoryDelete } from "@/app/[locale]/(root)/product-management/category/_hooks/use-category-delete";
import { ScrollArea } from "@/components/ui/scroll-area";
import CategoryLoading from "@/components/loading/CategoryLoading";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";

export default function CategoryComponent() {
  const tCategory = useTranslations("Category");
  const tCommon = useTranslations("Common");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [signInOpen, setSignInOpen] = useState(false);

  const {
    categories,
    isPending: isCategoriesPending,
    handleSubmit: submitCategory,
    handleDelete: deleteCategory,
    isUnauthorized,
  } = useCategory();

  // Set dialog to open when unauthorized
  useEffect(() => {
    if (isUnauthorized) {
      setSignInOpen(true);
    }
  }, [isUnauthorized]);

  const {
    subCategories,
    isPending: isSubCategoriesPending,
    handleSubmit: submitSubCategory,
    handleDelete: deleteSubCategory,
  } = useSubCategory();

  const {
    itemGroups,
    isPending: isItemGroupsPending,
    handleSubmit: submitItemGroup,
    handleDelete: deleteItemGroup,
  } = useItemGroup();

  const isLoading = isCategoriesPending || isSubCategoriesPending || isItemGroupsPending;

  const { categoryData, expanded, expandAll, collapseAll, toggleExpand } = useCategoryTree({
    categories,
    subCategories,
    itemGroups,
    isLoading,
  });

  const nodeMatchesSearch = useCallback((node: CategoryNode, searchLower: string) => {
    return (
      node.code.toLowerCase().includes(searchLower) ||
      node.name.toLowerCase().includes(searchLower) ||
      node.description?.toLowerCase().includes(searchLower)
    );
  }, []);

  const subcategoryMatchesSearch = useCallback(
    (subcategory: CategoryNode, searchLower: string) => {
      const subcategoryMatches = nodeMatchesSearch(subcategory, searchLower);
      const hasMatchingItemGroup = subcategory.children?.some((itemGroup: CategoryNode) =>
        nodeMatchesSearch(itemGroup, searchLower)
      );
      return subcategoryMatches || hasMatchingItemGroup;
    },
    [nodeMatchesSearch]
  );

  const categoryMatchesSearch = useCallback(
    (category: CategoryNode, searchLower: string) => {
      const categoryMatches = nodeMatchesSearch(category, searchLower);
      const hasMatchingSubcategory = category.children?.some((subcategory: CategoryNode) =>
        subcategoryMatchesSearch(subcategory, searchLower)
      );
      const hasMatchingItemGroup = category.children?.some(
        (itemGroup: CategoryNode) =>
          itemGroup.type === NODE_TYPE.ITEM_GROUP && nodeMatchesSearch(itemGroup, searchLower)
      );
      return categoryMatches || hasMatchingSubcategory || hasMatchingItemGroup;
    },
    [nodeMatchesSearch, subcategoryMatchesSearch]
  );

  const filteredCategoryData = useMemo(() => {
    if (!debouncedSearch) return categoryData;
    const searchLower = debouncedSearch.toLowerCase();
    return categoryData.filter((category) => categoryMatchesSearch(category, searchLower));
  }, [categoryData, debouncedSearch, categoryMatchesSearch]);

  const processSubcategoryExpansion = useCallback(
    (subcategory: CategoryNode, searchLower: string, expandedNodes: Record<string, boolean>) => {
      const subcategoryMatches = nodeMatchesSearch(subcategory, searchLower);
      const hasMatchingItemGroup = subcategory.children?.some((itemGroup: CategoryNode) =>
        nodeMatchesSearch(itemGroup, searchLower)
      );

      if (subcategoryMatches || hasMatchingItemGroup) {
        expandedNodes[subcategory.id] = true;
      }

      return subcategoryMatches || hasMatchingItemGroup;
    },
    [nodeMatchesSearch]
  );

  const searchExpanded = useMemo(() => {
    if (!debouncedSearch) return {};

    const searchLower = debouncedSearch.toLowerCase();
    const expandedNodes: Record<string, boolean> = {};

    for (const category of filteredCategoryData) {
      const categoryMatches = nodeMatchesSearch(category, searchLower);

      const hasMatchingSubcategory = category.children?.some((subcategory) =>
        processSubcategoryExpansion(subcategory, searchLower, expandedNodes)
      );

      const hasMatchingItemGroup = category.children?.some(
        (itemGroup) =>
          itemGroup.type === NODE_TYPE.ITEM_GROUP && nodeMatchesSearch(itemGroup, searchLower)
      );

      if (categoryMatches || hasMatchingSubcategory || hasMatchingItemGroup) {
        expandedNodes[category.id] = true;
      }
    }

    return expandedNodes;
  }, [filteredCategoryData, debouncedSearch, nodeMatchesSearch, processSubcategoryExpansion]);

  const {
    dialogOpen,
    dialogMode,
    selectedNode,
    parentNode,
    handleDialogChange,
    handleEdit: dialogHandleEdit,
    handleAdd: dialogHandleAdd,
    handleFormSubmit,
  } = useCategoryDialog({
    categoryData,
    onFormSubmit: async (data) => {
      try {
        let success = false;
        let result;

        if (dialogMode === formType.EDIT && selectedNode) {
          // Edit mode
          if (selectedNode.type === NODE_TYPE.CATEGORY) {
            const categoryDto: CategoryDto = {
              id: selectedNode.id,
              code: data.code,
              name: data.name,
              description: data.description,
              is_active: true,
              price_deviation_limit: data.price_deviation_limit ?? 0,
              qty_deviation_limit: data.qty_deviation_limit ?? 0,
              is_used_in_recipe: data.is_used_in_recipe ?? false,
              is_sold_directly: data.is_sold_directly ?? false,
            };
            result = await submitCategory(categoryDto, dialogMode, categoryDto);
            success = !!result;
          } else if (selectedNode.type === NODE_TYPE.SUBCATEGORY) {
            const subCategoryDto: SubCategoryDto = {
              id: selectedNode.id,
              code: data.code,
              name: data.name,
              description: data.description,
              is_active: true,
              product_category_id: parentNode?.id ?? selectedNode.product_category_id ?? "",
              price_deviation_limit: data.price_deviation_limit ?? 0,
              qty_deviation_limit: data.qty_deviation_limit ?? 0,
              is_used_in_recipe: data.is_used_in_recipe ?? false,
              is_sold_directly: data.is_sold_directly ?? false,
            };
            result = await submitSubCategory(subCategoryDto, dialogMode, subCategoryDto);
            success = !!result;
          } else {
            const itemGroupDto: ItemGroupDto = {
              id: selectedNode.id,
              code: data.code,
              name: data.name,
              description: data.description,
              is_active: true,
              product_subcategory_id: parentNode?.id ?? selectedNode.product_subcategory_id ?? "",
              price_deviation_limit: data.price_deviation_limit ?? 0,
              qty_deviation_limit: data.qty_deviation_limit ?? 0,
              is_used_in_recipe: data.is_used_in_recipe ?? false,
              is_sold_directly: data.is_sold_directly ?? false,
            };
            result = await submitItemGroup(itemGroupDto, dialogMode, itemGroupDto);
            success = !!result;
          }
        } else {
          // Add mode
          const isCategory = !parentNode;
          const isSubCategory = parentNode?.type === NODE_TYPE.CATEGORY;

          if (isCategory) {
            const categoryDto: CategoryDto = {
              id: "", // Will be set by the backend
              code: data.code,
              name: data.name,
              description: data.description,
              is_active: true,
              price_deviation_limit: data.price_deviation_limit ?? 0,
              qty_deviation_limit: data.qty_deviation_limit ?? 0,
              is_used_in_recipe: data.is_used_in_recipe ?? false,
              is_sold_directly: data.is_sold_directly ?? false,
            };
            result = await submitCategory(categoryDto, dialogMode);
            success = !!result;
          } else if (isSubCategory) {
            const subCategoryDto: SubCategoryDto = {
              id: "", // Will be set by the backend
              code: data.code,
              name: data.name,
              description: data.description,
              is_active: true,
              product_category_id: parentNode!.id,
              price_deviation_limit: data.price_deviation_limit ?? 0,
              qty_deviation_limit: data.qty_deviation_limit ?? 0,
              is_used_in_recipe: data.is_used_in_recipe ?? false,
              is_sold_directly: data.is_sold_directly ?? false,
            };
            result = await submitSubCategory(subCategoryDto, dialogMode);
            success = !!result;
          } else {
            const itemGroupDto: ItemGroupDto = {
              id: "", // Will be set by the backend
              code: data.code,
              name: data.name,
              description: data.description,
              is_active: true,
              product_subcategory_id: parentNode!.id,
              price_deviation_limit: data.price_deviation_limit ?? 0,
              qty_deviation_limit: data.qty_deviation_limit ?? 0,
              is_used_in_recipe: data.is_used_in_recipe ?? false,
              is_sold_directly: data.is_sold_directly ?? false,
            };
            result = await submitItemGroup(itemGroupDto, dialogMode);
            success = !!result;
          }
        }

        if (success) {
          toastSuccess({ message: tCategory("add_success") });
          handleDialogChange(false);
        } else {
          toastError({ message: tCategory("add_error") });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toastError({ message: tCategory("add_error") });
      }
    },
  });

  const {
    deleteDialogOpen,
    nodeToDelete,
    handleDeleteDialogChange,
    handleConfirmDelete,
    handleDelete: deleteHandleDelete,
    getDeleteMessage,
  } = useCategoryDelete({
    getDeleteMessage: (node) => {
      const typeLabel = getNodeTypeLabel(node.type);
      return `${tCommon("del_desc")} ${typeLabel} "${node.name}"?`;
    },
    onDelete: async (node) => {
      try {
        const nodeType = node.type;
        let result;

        if (nodeType === NODE_TYPE.CATEGORY) {
          // Use direct deleteCategory service instead of setting is_active flag
          const categoryDto: CategoryDto = {
            id: node.id,
            code: node.code,
            name: node.name,
            description: node.description,
            is_active: true,
            price_deviation_limit: node.price_deviation_limit ?? 0,
            qty_deviation_limit: node.qty_deviation_limit ?? 0,
            is_used_in_recipe: node.is_used_in_recipe ?? false,
            is_sold_directly: node.is_sold_directly ?? false,
          };
          result = await deleteCategory(categoryDto);
        } else if (nodeType === NODE_TYPE.SUBCATEGORY) {
          const subCategoryDto: SubCategoryDto = {
            id: node.id,
            code: node.code,
            name: node.name,
            description: node.description,
            is_active: true,
            product_category_id: node.product_category_id ?? "",
            price_deviation_limit: node.price_deviation_limit ?? 0,
            qty_deviation_limit: node.qty_deviation_limit ?? 0,
            is_used_in_recipe: node.is_used_in_recipe ?? false,
            is_sold_directly: node.is_sold_directly ?? false,
          };
          result = await deleteSubCategory(subCategoryDto);
        } else {
          const itemGroupDto: ItemGroupDto = {
            id: node.id,
            code: node.code,
            name: node.name,
            description: node.description,
            is_active: true,
            product_subcategory_id: node.product_subcategory_id ?? "",
            price_deviation_limit: node.price_deviation_limit ?? 0,
            qty_deviation_limit: node.qty_deviation_limit ?? 0,
            is_used_in_recipe: node.is_used_in_recipe ?? false,
            is_sold_directly: node.is_sold_directly ?? false,
          };
          result = await deleteItemGroup(itemGroupDto);
        }

        // Check if result indicates success
        // API typically returns { statusCode: 200, data: ... } for success
        const isSuccess =
          result &&
          (result.statusCode === 200 ||
            result.statusCode === 201 ||
            result.statusCode === 204 ||
            (result.data && !result.error));

        console.log("isSuccess", isSuccess);

        if (isSuccess) {
          toastSuccess({ message: tCategory("delete_success") });
          handleDeleteDialogChange(false);
        } else {
          toastError({ message: result?.message || tCategory("delete_error") });
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toastError({ message: tCategory("delete_error") });
      }
    },
  });

  const handleEdit = (node: CategoryNode) => {
    dialogHandleEdit(node);
  };

  const handleAdd = (parent?: CategoryNode) => {
    dialogHandleAdd(parent);
  };

  const handleDelete = (node: CategoryNode) => {
    deleteHandleDelete(node);
  };

  const getNodeTypeLabel = (type?: string) => {
    switch (type) {
      case NODE_TYPE.CATEGORY:
        return tCategory("category");
      case NODE_TYPE.SUBCATEGORY:
        return tCategory("subcategory");
      case NODE_TYPE.ITEM_GROUP:
        return tCategory("itemGroup");
      default:
        return tCategory("itemGroup");
    }
  };

  if (isUnauthorized) {
    return <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />;
  }

  const renderContent = () => {
    if (isLoading) {
      return <CategoryLoading />;
    }

    return (
      <div className="flex flex-col h-screen">
        <div className="sticky top-0 z-10 bg-background space-y-4 pb-4">
          <h1 className="text-2xl font-bold">{tCategory("title")}</h1>
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute inset-y-0 left-0 my-auto ml-2 text-gray-400" size={16} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tCommon("search")}
                className="h-8 w-full border border-border rounded-md p-1 px-8 transition duration-300 ease focus:outline-none focus:border-border hover:border-slate-300 shadow-sm focus:shadow"
                data-id="category-search-input"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 my-auto mr-2 text-gray-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={expandAll} size={"sm"} variant={"outlinePrimary"}>
                <ChevronDown className="h-4 w-4" />
                {tCategory("expand_all")}
              </Button>
              <Button onClick={collapseAll} size={"sm"} variant={"outlinePrimary"}>
                <ChevronUp className="h-4 w-4" />
                {tCategory("collapse_all")}
              </Button>
              <Button onClick={() => handleAdd()} size={"sm"}>
                <Plus className="h-4 w-4" />
                {tCategory("add_category")}
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 border border-border rounded-lg">
          {filteredCategoryData.length > 0 ? (
            <>
              {filteredCategoryData.map((category: CategoryNode) => (
                <TreeNode
                  key={category.id}
                  node={category}
                  expanded={debouncedSearch ? searchExpanded : expanded}
                  toggleExpand={toggleExpand}
                  onEdit={handleEdit}
                  onAdd={handleAdd}
                  onDelete={handleDelete}
                  search={debouncedSearch}
                />
              ))}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full p-8">
              {search ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">
                    {tCategory("no_search_results")}: &quot;{search}&quot;
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tCategory("try_different_keywords")}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">{tCategory("no_category")}</p>
              )}
            </div>
          )}
        </ScrollArea>

        <CategoryDialog
          open={dialogOpen}
          onOpenChange={handleDialogChange}
          mode={dialogMode}
          selectedNode={selectedNode}
          parentNode={parentNode}
          onSubmit={handleFormSubmit}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {tCommon("delete")} {getNodeTypeLabel(nodeToDelete?.type)}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {nodeToDelete && getDeleteMessage(nodeToDelete)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                {tCommon("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return renderContent();
}
