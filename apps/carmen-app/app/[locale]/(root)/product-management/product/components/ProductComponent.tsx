"use client";

import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useProductQuery } from "@/hooks/useProductQuery";
import { useURL } from "@/hooks/useURL";
import { Link } from "@/lib/navigation";
import { parseSortString } from "@/utils/table-sort";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import ProductList from "./ProductList";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";

export default function ProductComponent() {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tProduct = useTranslations("Products");

  const [search, setSearch] = useURL("search");
  const [status, setStatus] = useURL("status");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");
  const [statusOpen, setStatusOpen] = useState(false);

  const { products, isLoading } = useProductQuery({
    token,
    buCode,
    params: {
      search,
      sort,
      page: page ? Number(page) : 1,
      perpage: perpage ? Number(perpage) : 10,
    }
  });

  const sortFields = [
    { key: "name", label: tHeader("name") },
    { key: "category", label: tHeader("category") },
    { key: "sub_category", label: tHeader("sub_category") },
    { key: "item_group", label: tHeader("item_group") },
  ];

  const title = tProduct("title");

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage.toString());
  }, [setPage]);

  const handlePerpageChange = useCallback((newPerpage: number) => {
    setPerpage(newPerpage.toString());
  }, [setPerpage]);

  const actionButtons = (
    <div className="action-btn-container" data-id="product-list-action-buttons">
      <Button size={"sm"} asChild>
        <Link href="/product-management/product/new">
          <Plus />
          {tCommon("add")}
        </Link>
      </Button>
      <Button
        variant="outlinePrimary"
        className="group"
        size={"sm"}
        data-id="delivery-point-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button
        variant="outlinePrimary"
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

  const totalItems = products?.paginate?.total ?? 0;
  const totalPages = products?.paginate?.pages ?? 1;
  const currentPage = products?.paginate?.page ?? 1;
  const currentPerpage = products?.paginate?.perpage ?? 10;

  const content = (
    <ProductList
      products={products?.data ?? []}
      isLoading={isLoading}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      totalPages={totalPages}
      totalItems={totalItems}
      sort={parseSortString(sort)}
      onSort={setSort}
      perpage={currentPerpage}
      setPerpage={handlePerpageChange}
    />
  )

  return (
    <DataDisplayTemplate
      title={title}
      actionButtons={actionButtons}
      filters={filters}
      content={content}
    />
  )
}