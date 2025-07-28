"use client";

import { Plus, FileDown, Printer } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  TaxProfileEditDto,
  TaxProfileFormData,
  TaxProfileGetAllDto,
} from "@/dtos/tax-profile.dto";
import { toastSuccess } from "@/components/ui-custom/Toast";
import { FormTaxProfile } from "./FormTaxProfile";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { boolFilterOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { useAuth } from "@/context/AuthContext";
import {
  useDeleteTaxProfile,
  useTaxProfileMutation,
  useTaxProfileQuery,
  useUpdateTaxProfile,
} from "@/hooks/useTaxProfile";
import TaxProfileList from "./TaxProfileList";

export function TaxProfileComponent() {
  const { token, tenantId } = useAuth();
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tTaxProfile = useTranslations("TaxProfile");
  const { taxProfiles: taxProfileData, isLoading } = useTaxProfileQuery(
    token,
    tenantId
  );
  const [taxProfiles, setTaxProfiles] = useState<TaxProfileGetAllDto[]>([]);

  useEffect(() => {
    if (taxProfileData?.data) {
      setTaxProfiles(taxProfileData.data);
    }
  }, [taxProfileData?.data]);

  const { mutate: createTaxProfile } = useTaxProfileMutation(token, tenantId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const { mutate: updateTaxProfile } = useUpdateTaxProfile(
    token,
    tenantId,
    editingProfile ?? ""
  );

  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);
  const { mutate: deleteTaxProfile } = useDeleteTaxProfile(
    token,
    tenantId,
    deleteProfileId ?? ""
  );

  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [filter, setFilter] = useURL("filter");
  const [statusOpen, setStatusOpen] = useState(false);

  const title = tTaxProfile("title");

  const sortFields = useMemo(
    () => [
      { key: "name", label: tHeader("name") },
      { key: "is_active", label: tHeader("status") },
    ],
    [tHeader]
  );

  useEffect(() => {
    if (search) {
      setSort("");
    }
  }, [search, setSort]);

  const handleSetFilter = useCallback(
    (filterValue: string) => {
      setFilter(filterValue);
    },
    [setFilter]
  );

  const handleSetSort = useCallback(
    (sortValue: string) => {
      setSort(sortValue);
    },
    [setSort]
  );

  const handleAddNew = useCallback(() => {
    setEditingProfile(null);
    setIsDialogOpen(true);
  }, []);

  const actionButtons = useMemo(
    () => (
      <div
        className="action-btn-container"
        data-id="delivery-point-list-action-buttons"
      >
        <Button size="sm" onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          {tCommon("add")}
        </Button>
        <Button
          variant="outline"
          className="group"
          size="sm"
          data-id="delivery-point-export-button"
        >
          <FileDown className="h-4 w-4" />
          {tCommon("export")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          data-id="delivery-point-print-button"
        >
          <Printer className="h-4 w-4" />
          {tCommon("print")}
        </Button>
      </div>
    ),
    [tCommon, handleAddNew]
  );

  const filters = useMemo(
    () => (
      <div className="filter-container" data-id="delivery-point-list-filters">
        <SearchInput
          defaultValue={search}
          onSearch={setSearch}
          placeholder={tCommon("search")}
          data-id="delivery-point-list-search-input"
        />
        <div className="flex items-center gap-2">
          <StatusSearchDropdown
            options={boolFilterOptions}
            value={filter}
            onChange={handleSetFilter}
            open={statusOpen}
            onOpenChange={setStatusOpen}
            data-id="delivery-point-status-search-dropdown"
          />
          <SortComponent
            fieldConfigs={sortFields}
            sort={sort}
            setSort={handleSetSort}
            data-id="delivery-point-sort-dropdown"
          />
        </div>
      </div>
    ),
    [
      search,
      setSearch,
      tCommon,
      filter,
      handleSetFilter,
      statusOpen,
      setStatusOpen,
      sortFields,
      sort,
      handleSetSort,
    ]
  );
  const handleEdit = useCallback((profileId: string) => {
    setEditingProfile(profileId);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteTaxProfile(undefined, {
      onSuccess: () => {
        setTaxProfiles((prev) => prev.filter((profile) => profile.id !== id));
        toastSuccess({ message: tTaxProfile("tax_profile_deleted") });
        setDeleteProfileId(null);
      },
    });
  }, [deleteTaxProfile, tTaxProfile]);

  const content = useMemo(() => {
    return (
      <TaxProfileList
        taxProfiles={taxProfiles}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }, [taxProfiles, isLoading, handleEdit, handleDelete]);

  const handleCreate = (data: TaxProfileFormData) => {
    createTaxProfile(data, {
      onSuccess: () => {
        setTaxProfiles((prev) => [...prev, data as TaxProfileGetAllDto]);
        setIsDialogOpen(false);
        toastSuccess({ message: tTaxProfile("tax_profile_created") });
      },
    });
  };

  const handleUpdate = (data: TaxProfileFormData) => {
    updateTaxProfile(data as TaxProfileEditDto, {
      onSuccess: () => {
        setTaxProfiles((prev) =>
          prev.map((profile) =>
            profile.id === editingProfile ? { ...profile, ...data } : profile
          )
        );
        toastSuccess({ message: tTaxProfile("tax_profile_updated") });
        setIsDialogOpen(false);
        setEditingProfile(null);
      },
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProfile(null);
  };

  const handleSubmit = (data: TaxProfileFormData) => {
    if (editingProfile) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <>
      <DataDisplayTemplate
        title={title}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />
      <FormTaxProfile
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        editingProfile={
          editingProfile
            ? taxProfiles.find((p) => p.id === editingProfile)
            : null
        }
        onCancel={handleDialogClose}
      />

      <AlertDialog
        open={deleteProfileId !== null}
        onOpenChange={() => setDeleteProfileId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tTaxProfile("confirm_delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tTaxProfile("confirm_delete_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProfileId && handleDelete(deleteProfileId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              {tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
