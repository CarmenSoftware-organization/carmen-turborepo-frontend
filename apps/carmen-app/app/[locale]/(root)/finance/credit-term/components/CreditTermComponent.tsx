"use client";

import { useAuth } from "@/context/AuthContext";
import {
  FileDown,
  Filter,
  Plus,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useState } from "react";
import { useURL } from "@/hooks/useURL";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import {
  CreditTermGetAllDto,
  CreateCreditTermFormValues,
} from "@/dtos/credit-term.dto";
import CreditTermDialog from "./CreditTermDialog";
import CreditTermList from "./CreditTermList";
import { formType } from "@/dtos/form.dto";
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
import { toastSuccess } from "@/components/ui-custom/Toast";
import {
  useCreateCreditTerm,
  useCreditTermQuery,
  useDeleteCreditTerm,
  useUpdateCreditTerm,
} from "@/hooks/useCreditTerm";
import { useQueryClient } from "@tanstack/react-query";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

const sortFields = [
  { key: "name", label: "Name" },
  { key: "value", label: "Value" },
  { key: "is_active", label: "Status" },
];

export default function CreditTermComponent() {
  const { token, buCode } = useAuth();
  const queryClient = useQueryClient();
  const { creditTerms, isLoading } = useCreditTermQuery(token, buCode);

  const [selectedCreditTerm, setSelectedCreditTerm] =
    useState<CreditTermGetAllDto | null>(null);
  const { mutate: createCreditTerm, isPending: isCreating } =
    useCreateCreditTerm(token, buCode);
  const { mutate: updateCreditTerm, isPending: isUpdating } =
    useUpdateCreditTerm(token, buCode, selectedCreditTerm?.id || "");
  const { mutate: deleteCreditTerm, isPending: isDeleting } =
    useDeleteCreditTerm(token, buCode);

  const tCommon = useTranslations("Common");
  const [search, setSearch] = useURL("search");
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [sort, setSort] = useURL("sort");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<formType | undefined>(undefined);

  const title = "Credit Term";

  // Parse sort string
  const parsedSort = sort
    ? {
      field: sort.split(":")[0],
      direction: sort.split(":")[1] as "asc" | "desc",
    }
    : undefined;

  const handleCreateCreditTerm = (data: CreateCreditTermFormValues) => {
    createCreditTerm(data, {
      onSuccess: () => {
        setDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["credit-term", buCode] });
        toastSuccess({ message: "Credit term created successfully" });
      },
    });
  };

  const handleUpdateCreditTerm = (data: CreateCreditTermFormValues) => {
    if (!selectedCreditTerm?.id) return;
    updateCreditTerm(data, {
      onSuccess: () => {
        setDialogOpen(false);
        setSelectedCreditTerm(null);
        queryClient.invalidateQueries({ queryKey: ["credit-term", buCode] });
        toastSuccess({ message: "Credit term updated successfully" });
      },
    });
  };

  const handleDeleteCreditTerm = () => {
    if (!selectedCreditTerm?.id) return;
    deleteCreditTerm(selectedCreditTerm.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedCreditTerm(null);
        queryClient.invalidateQueries({ queryKey: ["credit-term", buCode] });
        toastSuccess({ message: "Credit term deleted successfully" });
      },
    });
  };

  const handleOpenCreateDialog = () => {
    setDialogMode(formType.ADD);
    setSelectedCreditTerm(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (creditTerm: CreditTermGetAllDto) => {
    setDialogMode(formType.EDIT);
    setSelectedCreditTerm(creditTerm);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (creditTerm: CreditTermGetAllDto) => {
    setSelectedCreditTerm(creditTerm);
    setDeleteDialogOpen(true);
  };

  const actionButtons = (
    <div className="action-btn-container" data-id="credit-term-action-buttons">
      <Button size={"sm"} onClick={handleOpenCreateDialog}>
        <Plus className="h-4 w-4" />
        New Credit Term
      </Button>
      <Button
        variant="outline"
        className="group"
        size={"sm"}
        data-id="credit-term-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button
        variant="outline"
        size={"sm"}
        data-id="credit-term-list-print-button"
      >
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="credit-term-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="credit-term-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="credit-term-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="credit-term-list-sort-dropdown"
        />
        <Button size={"sm"}>
          <Filter className="h-4 w-4" />
          Add Filter
        </Button>
      </div>
    </div>
  );

  const content = (
    <CreditTermList
      creditTerms={creditTerms || []}
      isLoading={isLoading}
      onEdit={handleOpenEditDialog}
      onDelete={handleOpenDeleteDialog}
      sort={parsedSort}
      onSort={setSort}
      canUpdate={true}
      canDelete={true}
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
      <CreditTermDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={
          dialogMode === formType.ADD
            ? handleCreateCreditTerm
            : handleUpdateCreditTerm
        }
        isLoading={dialogMode === formType.ADD ? isCreating : isUpdating}
        creditTerm={selectedCreditTerm}
        mode={dialogMode}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete Credit Term</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Credit Term &quot;
              {selectedCreditTerm?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCreditTerm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
