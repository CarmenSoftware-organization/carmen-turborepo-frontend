"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useGrnQuery } from "@/hooks/use-grn";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useTranslations } from "next-intl";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import { useState } from "react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import SortComponent from "@/components/ui-custom/SortComponent";
import GoodsReceivedNoteList from "./GoodsReceivedNoteList";
import { parseSortString } from "@/utils/table";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import GoodsReceivedNoteDialog from "./GoodsReceivedNoteDialog";
import SignInDialog from "@/components/SignInDialog";

export default function GoodsReceivedNoteComponent() {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const { search, setSearch, sort, setSort, pageNumber, perpageNumber, handlePageChange, handleSetPerpage } = useListPageState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const { data, isLoading } = useGrnQuery(token, buCode, {
    page: pageNumber,
    sort,
    search,
  });

  console.log(data);

  const sortFields = [{ key: "name", label: "Name" }];

  const title = tHeader("title_goods_received_note");

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2" data-id="grn-action-buttons">
      <Button size={"sm"} onClick={() => setDialogOpen(true)} data-id="grn-new-button">
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
      <Button
        variant="outlinePrimary"
        className="group"
        size={"sm"}
        data-id="grn-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>
      <Button variant="outlinePrimary" size={"sm"} data-id="grn-list-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="grn-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="grn-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="grn-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="grn-list-sort-dropdown"
        />
        <Button size={"sm"}>
          <Filter className="h-4 w-4" />
          {tCommon("filter")}
        </Button>
      </div>
    </div>
  );

  const content = (
    <GoodsReceivedNoteList
      goodsReceivedNotes={data?.data.data ?? []}
      currentPage={data?.data.paginate?.page ?? 1}
      totalPages={data?.data.paginate?.pages ?? 1}
      totalItems={data?.data.paginate?.total ?? 0}
      perpage={perpageNumber}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      sort={parseSortString(sort)}
      onSort={setSort}
      setPerpage={handleSetPerpage}
    />
  );

  return (
    <>
      <DataDisplayTemplate
        title={title}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />
      <GoodsReceivedNoteDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
