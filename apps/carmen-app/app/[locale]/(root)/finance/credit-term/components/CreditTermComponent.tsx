"use client";

import { useAuth } from "@/context/AuthContext";
import {
  FileDown,
  Filter,
  Plus,
  Printer,
  CreditCard,
  CheckCircle,
  XCircle,
  StickyNote,
  Trash2,
  SquarePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useState } from "react";
import { useURL } from "@/hooks/useURL";
import { statusOptions } from "@/constants/options";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditTermGetAllDto,
  CreateCreditTermFormValues,
} from "@/dtos/credit-term.dto";
import { Badge } from "@/components/ui/badge";
import CreditTermDialog from "./CreditTermDialog";
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

const sortFields = [
  { key: "name", label: "Name" }
];

export default function CreditTermComponent() {
  const { token, tenantId } = useAuth();
  const queryClient = useQueryClient();
  const { creditTerms } = useCreditTermQuery(token, tenantId);
  const [selectedCreditTerm, setSelectedCreditTerm] =
    useState<CreditTermGetAllDto | null>(null);
  const { mutate: createCreditTerm, isPending: isCreating } =
    useCreateCreditTerm(token, tenantId);
  const { mutate: updateCreditTerm, isPending: isUpdating } =
    useUpdateCreditTerm(token, tenantId, selectedCreditTerm?.id || "");
  const { mutate: deleteCreditTerm, isPending: isDeleting } =
    useDeleteCreditTerm(token, tenantId, selectedCreditTerm?.id || "");
  const tCommon = useTranslations("Common");
  const [search, setSearch] = useURL("search");
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [sort, setSort] = useURL("sort");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<formType | undefined>(undefined);

  const title = "Credit Term";

  const handleCreateCreditTerm = (data: CreateCreditTermFormValues) => {
    createCreditTerm(data, {
      onSuccess: () => {
        setDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["credit-term", tenantId] });
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
        queryClient.invalidateQueries({ queryKey: ["credit-term", tenantId] });
        toastSuccess({ message: "Credit term updated successfully" });
      },
    });
  };

  const handleDeleteCreditTerm = () => {
    if (!selectedCreditTerm?.id) return;
    deleteCreditTerm(undefined, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedCreditTerm(null);
        queryClient.invalidateQueries({ queryKey: ["credit-term", tenantId] });
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
      </div>
    </div>
  );

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {creditTerms?.data.map((creditTerm: CreditTermGetAllDto) => (
        <Card
          key={creditTerm.id}
          className="group border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-border/80"
        >
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-border/50">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-200">
                    {creditTerm.name}
                  </CardTitle>
                </div>
              </div>
              <Badge
                variant={creditTerm.is_active ? "active" : "inactive"}
                className={`
                  flex items-center gap-1 text-xs px-2 py-1 rounded-full border-0
                  ${creditTerm.is_active
                    ? "text-green-700 ring-1 ring-green-200"
                    : "text-gray-600 ring-1 ring-gray-200"
                  }
                `}
              >
                {creditTerm.is_active ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {creditTerm.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-4">
            {creditTerm.description && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {creditTerm.description}
                </p>
              </div>
            )}

            {creditTerm.note && (
              <div className="flex items-start gap-2 p-1 rounded-lg border border-border/30">
                <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Note
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {creditTerm.note}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenEditDialog(creditTerm)}
                disabled={isUpdating}
              >
                <SquarePen className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenDeleteDialog(creditTerm)}
                disabled={isDeleting}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
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
