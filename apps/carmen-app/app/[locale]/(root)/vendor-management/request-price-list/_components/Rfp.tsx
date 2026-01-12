"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDeleteRfp, useRfps } from "@/hooks/use-rfp";
import { useURL } from "@/hooks/useURL";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { FileDown, Filter, Grid, List, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SignInDialog from "@/components/SignInDialog";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import RfpList from "./RfpList";
import RfpGrid from "./RfpGrid";
import { VIEW } from "@/constants/enum";

const sortFields = [{ key: "name", label: "Name" }];

export default function Rfp() {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tRfp = useTranslations("RFP");
  const router = useRouter();

  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [view, setView] = useState<VIEW>(VIEW.LIST);

  const { rfps, isLoading, isUnauthorized } = useRfps(token, buCode, {
    search,
    sort,
    page: page ? Number(page) : 1,
    perpage: perpage ? Number(perpage) : 10,
  });

  const { mutate: deleteRfp, isPending: isDeleting } = useDeleteRfp(token, buCode);

  useEffect(() => {
    if (isUnauthorized) {
      setLoginDialogOpen(true);
    }
  }, [isUnauthorized]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handlePerpageChange = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const onDelete = (rfpId: string) => {
    setDeleteId(rfpId);
    setDeleteDialogOpen(true);
  };

  const onConfirmDelete = () => {
    if (!deleteId) return;
    deleteRfp(deleteId, {
      onSuccess: () => {
        toastSuccess({ message: tRfp("delete_success") });
        setDeleteDialogOpen(false);
        setDeleteId(null);
      },
      onError: (error) => {
        toastError({
          message: error instanceof Error ? error.message : "Failed to delete RFP",
        });
      },
    });
  };

  const title = tRfp("title");

  const actionButtons = (
    <div className="action-btn-container" data-id="rfp-action-buttons">
      <Button
        size={"sm"}
        onClick={() => {
          router.push("/vendor-management/request-price-list/new");
        }}
      >
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>

      <Button
        variant="outlinePrimary"
        className="group"
        size={"sm"}
        data-id="rfp-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>

      <Button variant="outlinePrimary" size={"sm"} data-id="rfp-list-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="vendor-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="vendor-list-search-input"
      />
      <div className="flex items-center gap-2">
        <div>
          <SortComponent
            fieldConfigs={sortFields}
            sort={sort}
            setSort={setSort}
            data-id="pr-list-sort-dropdown"
          />
        </div>

        <Button size={"sm"}>
          <Filter className="h-4 w-4" />
          {tCommon("filter")}
        </Button>

        <div className="hidden lg:block">
          <div className="flex items-center gap-2">
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
    </div>
  );

  const totalItems = rfps?.paginate?.total ?? 0;
  const totalPages = rfps?.paginate?.pages ?? 1;
  const currentPage = rfps?.paginate?.page ?? 1;
  const currentPerpage = rfps?.paginate?.perpage ?? 10;

  const content = (
    <>
      <div className="block lg:hidden">
        <RfpGrid
          rfps={rfps?.data ?? []} // Updated access to data
          isLoading={isLoading}
          onDelete={onDelete}
          // Grid might need pagination props too, but List is priority
        />
      </div>

      <div className="hidden lg:block">
        {view === VIEW.LIST ? (
          <RfpList
            rfps={rfps?.data ?? []} // Updated access to data
            isLoading={isLoading}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            totalItems={totalItems}
            perpage={currentPerpage}
            setPerpage={handlePerpageChange}
            onDelete={onDelete}
          />
        ) : (
          <RfpGrid
            rfps={rfps?.data ?? []} // Updated access to data
            isLoading={isLoading}
            onDelete={onDelete}
          />
        )}
      </div>
    </>
  );

  return (
    <>
      <DataDisplayTemplate
        title={title}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />

      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onConfirmDelete}
        title={tRfp("delete_confirm_title")}
        description={tRfp("delete_confirm_desc")}
        isLoading={isDeleting}
      />
    </>
  );
}
