"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Grid, List, Plus, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import ListPriceList from "./ListPriceList";
import { useAuth } from "@/context/AuthContext";
import SignInDialog from "@/components/SignInDialog";

import { useRouter } from "@/lib/navigation";
import { useURL } from "@/hooks/useURL";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { VIEW } from "@/constants/enum";
import PriceListGrid from "./PriceListGrid";
import { usePriceList } from "@/hooks/use-price-list";

const sortFields = [{ key: "name", label: "Name" }];

export default function PriceListComponent() {
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const tPriceList = useTranslations("PriceList");
  const { token, buCode } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");
  const [view, setView] = useState<VIEW>(VIEW.LIST);

  const { data: priceLists, isLoading, isUnauthorized } = usePriceList(token, buCode, {
    search,
    page,
    sort,
    perpage,
  });

  const currentPage = priceLists?.paginate?.page ?? 1;
  const totalPages = priceLists?.paginate?.pages ?? 1;
  const totalItems = priceLists?.paginate?.total ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  useEffect(() => {
    if (isUnauthorized) {
      setLoginDialogOpen(true);
    }
  }, [isUnauthorized]);

  const actionButtons = (
    <div className="action-btn-container" data-id="price-list-action-buttons">
      <Button
        size={"sm"}
        onClick={() => {
          router.push("/vendor-management/price-list/new");
        }}
      >
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>

      <Button
        variant="outlinePrimary"
        className="group"
        size={"sm"}
        data-id="price-list-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>

      <Button variant="outlinePrimary" size={"sm"} data-id="price-list-list-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="price-list-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="price-list-list-search-input"
      />
      <div className="flex items-center gap-2">
        <div>
          <SortComponent
            fieldConfigs={sortFields}
            sort={sort}
            setSort={setSort}
            data-id="price-list-list-sort-dropdown"
          />
        </div>
        <Button size={"sm"}>
          <Filter className="h-4 w-4" />
          {tCommon("filter")}
        </Button>
        <div className="hidden lg:flex items-center gap-2">
          <Button
            variant={view === VIEW.LIST ? "default" : "outlinePrimary"}
            size={"sm"}
            onClick={() => setView(VIEW.LIST)}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === VIEW.GRID ? "default" : "outlinePrimary"}
            size={"sm"}
            onClick={() => setView(VIEW.GRID)}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const content = (
    <>
      <div className="block lg:hidden">
        <PriceListGrid
          priceLists={priceLists?.data ?? []}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          perpage={priceLists?.paginate?.perpage ?? 10}
          onPageChange={handlePageChange}
          setPerpage={handleSetPerpage}
        />
      </div>

      <div className="hidden lg:block">
        {view === VIEW.LIST ? (
          <ListPriceList
            priceLists={priceLists?.data ?? []}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            perpage={priceLists?.paginate?.perpage ?? 10}
            onPageChange={handlePageChange}
            setPerpage={handleSetPerpage}
          />
        ) : (
          <PriceListGrid
            priceLists={priceLists?.data ?? []}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            perpage={priceLists?.paginate?.perpage ?? 10}
            onPageChange={handlePageChange}
            setPerpage={handleSetPerpage}
          />
        )}
      </div>
    </>
  );

  return (
    <>
      <DataDisplayTemplate
        content={content}
        title={tPriceList("title")}
        filters={filters}
        actionButtons={actionButtons}
      />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
