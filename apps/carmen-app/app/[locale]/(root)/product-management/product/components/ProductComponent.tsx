"use client";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { statusOptions } from "@/constants/options";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import ProductList from "./ProductList";
import { Link } from "@/lib/navigation";
import SignInDialog from "@/components/SignInDialog";
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
import useProduct from "@/hooks/useProduct";
import { parseSortString } from "@/utils/table-sort";

export function ProductComponent() {
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tProduct = useTranslations("Product");

  const {
    // Data states
    products,
    isLoading,
    totalPages,
    currentPage,
    totalItems,
    // Filter states
    search,
    status,
    statusOpen,
    sort,

    // Delete states
    deleteDialogOpen,
    isDeleting,

    // Auth state
    loginRequired,

    // Setters and handlers
    setSearch,
    setStatus,
    setStatusOpen,
    setSort,
    handlePageChange,
    handleDelete,
    confirmDelete,
    closeDeleteDialog,
    handleSort
  } = useProduct();

  const sortFields = [
    { key: "name", label: tHeader("name") },
    { key: "category", label: tHeader("category") },
    { key: "sub_category", label: tHeader("sub_category") },
    { key: "item_group", label: tHeader("item_group") },
  ];

  const title = tProduct("title");

  const actionButtons = (
    <div className="action-btn-container" data-id="product-list-action-buttons">
      <Button size={"sm"} asChild>
        <Link href="/product-management/product/new">
          <Plus />
          {tCommon("add")}
        </Link>
      </Button>
      <Button
        variant="outline"
        className="group"
        size={"sm"}
        data-id="delivery-point-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button
        variant="outline"
        size={"sm"}
        data-id="delivery-point-print-button"
      >
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="product-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="product-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          options={statusOptions}
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="product-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="product-list-sort-dropdown"
        />
      </div>
    </div>
  );

  const content = (
    <ProductList
      products={products}
      isLoading={isLoading}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      totalPages={totalPages}
      data-id="product-list-template"
      onDelete={handleDelete}
      totalItems={totalItems}
      sort={parseSortString(sort) ?? { field: "name", direction: "asc" }}
      onSort={handleSort}
    />
  );

  return (
    <div>
      <DataDisplayTemplate
        title={title}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />
      <SignInDialog
        open={loginRequired}
        onOpenChange={(open) => !open && window.location.reload()}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
