"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { statusOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useCallback, useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import CreditNoteList from "./CreditNoteList";
import { VIEW } from "@/constants/enum";
import CreditNoteGrid from "./CreditNoteGrid";
import ToggleView from "@/components/ui-custom/ToggleView";
import { useCreditNoteQuery } from "@/hooks/useCreditNote";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/lib/navigation";
import { parseSortString } from "@/utils/table-sort";

const sortFields = [{ key: "name", label: "Name" }];

export default function CreditNoteComponent() {
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const { token, tenantId } = useAuth();
  const [search, setSearch] = useURL("search");
  const [status, setStatus] = useURL("status");
  const [page, setPage] = useURL("page");
  const [statusOpen, setStatusOpen] = useState(false);
  const [sort, setSort] = useURL("sort");
  const [view, setView] = useState<VIEW>(VIEW.LIST);

  const { creditNotes, isLoading } = useCreditNoteQuery(token, tenantId, {
    search,
    sort,
    page: page ? parseInt(page) : 1,
  });

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage.toString());
    },
    [setPage]
  );

  const handleSort = useCallback((field: string) => {
    if (!sort) {
      setSort(`${field}:asc`);
    } else {
      const [currentField, currentDirection] = sort.split(':') as [string, string];

      if (currentField === field) {
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        setSort(`${field}:${newDirection}`);
      } else {
        setSort(`${field}:asc`);
      }
      setPage("1");
    }
  }, [setSort, sort, setPage]);

  const totalItems = creditNotes?.paginate.total;
  const perpage = creditNotes?.paginate.perpage;

  const title = "Credit Note";

  const actionButtons = (
    <div className="action-btn-container" data-id="credit-note-action-buttons">
      <Button size={"sm"} data-id="credit-note-new-button" onClick={() => {
        router.push("/procurement/credit-note/new");
      }}>
        <Plus className="h-4 w-4" />
        New Credit Note
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
        {tCommon("export")}
      </Button>
      <Button
        variant="outlinePrimary"
        size={"sm"}
        data-id="credit-note-list-print-button"
      >
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="credit-note-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="credit-note-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          options={statusOptions}
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
          Add Filter
        </Button>
        <ToggleView view={view} setView={setView} />
      </div>
    </div>
  );

  const ViewComponent = view === VIEW.LIST ? CreditNoteList : CreditNoteGrid;

  const content = (
    <ViewComponent
      creditNotes={creditNotes?.data}
      isLoading={isLoading}
      totalItems={totalItems}
      currentPage={creditNotes?.paginate.page}
      totalPages={creditNotes?.paginate.pages}
      perpage={perpage}
      onPageChange={handlePageChange}
      sort={parseSortString(sort) ?? { field: '', direction: 'asc' }}
      onSort={handleSort}
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
