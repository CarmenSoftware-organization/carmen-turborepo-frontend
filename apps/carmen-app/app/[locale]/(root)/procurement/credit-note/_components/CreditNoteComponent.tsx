"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Grid, List, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import CreditNoteList from "./CreditNoteList";
import { VIEW } from "@/constants/enum";
import CreditNoteGrid from "./CreditNoteGrid";
import { useCreditNoteQuery } from "../_hooks/use-credit-note";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/lib/navigation";
import { parseSortString } from "@/utils/table";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

const sortFields = [{ key: "name", label: "Name" }];

export default function CreditNoteComponent() {
  const tCommon = useTranslations("Common");
  const tDataControls = useTranslations("DataControls");
  const tCreditNote = useTranslations("CreditNote");
  const router = useRouter();
  const { token, buCode } = useAuth();
  const { search, setSearch, sort, setSort, pageNumber, perpageNumber, handlePageChange, handleSetPerpage } = useListPageState();
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [view, setView] = useState<VIEW>(VIEW.LIST);

  const { creditNotes, isLoading } = useCreditNoteQuery(token, buCode, {
    search,
    sort,
    page: pageNumber,
    perpage: perpageNumber,
  });

  const totalItems = creditNotes?.paginate.total;
  const perpageItem = creditNotes?.paginate.perpage;

  const title = tCreditNote("title");

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2" data-id="credit-note-action-buttons">
      <Button
        size={"sm"}
        data-id="credit-note-new-button"
        onClick={() => {
          router.push("/procurement/credit-note/new");
        }}
      >
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
      <Button
        variant="outlinePrimary"
        className="group"
        size={"sm"}
        data-id="credit-note-list-export-button"
        onClick={() => {
          alert("export");
        }}
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>
      <Button variant="outlinePrimary" size={"sm"} data-id="credit-note-list-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="credit-note-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="credit-note-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="credit-note-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="credit-note-list-sort-dropdown"
        />
        <Button size={"sm"}>
          <Filter className="h-4 w-4" />
          {tDataControls("add_filter")}
        </Button>
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
  );

  const ViewComponent = view === VIEW.LIST ? CreditNoteList : CreditNoteGrid;

  const content = (
    <ViewComponent
      creditNotes={creditNotes?.data ?? []}
      isLoading={isLoading}
      totalItems={totalItems ?? 0}
      currentPage={creditNotes?.paginate.page ?? 1}
      totalPages={creditNotes?.paginate.pages ?? 1}
      perpage={perpageItem ?? 10}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onSort={setSort}
      setPerpage={handleSetPerpage}
    />
  );

  return (
    <DataDisplayTemplate
      title={title}
      actionButtons={actionButtons}
      filters={filters}
      content={content}
    />
  );
}
