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
import { parseSortString } from "@/utils/table-sort";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

export function TaxProfileComponent() {
  const { token, tenantId } = useAuth();
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tTaxProfile = useTranslations("TaxProfile");
  const [page, setPage] = useURL("page");
  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [filter, setFilter] = useURL("filter");
  const [perpage, setPerpage] = useURL("perpage");

  const { taxProfiles: taxProfileData, isLoading } = useTaxProfileQuery(
    token,
    tenantId,
    {
      search,
      filter,
      sort,
      page: page ? parseInt(page) : 1,
      perpage: perpage ? parseInt(perpage) : 10,
    },
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


  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedTaxProfiles, setSelectedTaxProfiles] = useState<string[]>([]);

  const currentPage = taxProfileData?.paginate.page ?? 1;
  const totalPages = taxProfileData?.paginate.pages ?? 1;
  const totalItems = taxProfileData?.paginate.total ?? taxProfileData?.data?.length ?? 0;

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
          variant="outlinePrimary"
          className="group"
          size="sm"
          data-id="delivery-point-export-button"
        >
          <FileDown className="h-4 w-4" />
          {tCommon("export")}
        </Button>
        <Button
          variant="outlinePrimary"
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
        <div className="fxr-c gap-2">
          <StatusSearchDropdown
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

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage.toString());
  }, [setPage]);

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSelectedTaxProfiles(taxProfiles?.map((tp: any) => tp.id) ?? []);
    } else {
      setSelectedTaxProfiles([]);
    }
  };

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const handleSort = useCallback((field: string) => {
    if (!sort) {
      setSort(`${field}:asc`);
    } else {
      const [currentField, currentDirection] = sort.split(':');

      if (currentField === field) {
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        setSort(`${field}:${newDirection}`);
      } else {
        setSort(`${field}:asc`);
      }
      setPage("1");
    }
  }, [setSort, sort, setPage]);

  const handleSelect = (id: string) => {
    setSelectedTaxProfiles((prev) => {
      if (prev.includes(id)) {
        return prev.filter(tpId => tpId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const content = (
    <TaxProfileList
      taxProfiles={taxProfiles}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalItems={totalItems}
      sort={parseSortString(sort)}
      onSort={handleSort}
      selectedTaxProfiles={selectedTaxProfiles}
      onSelectAll={handleSelectAll}
      onSelect={handleSelect}
      perpage={taxProfileData?.paginate.perpage}
      setPerpage={handleSetPerpage}
    />
  );

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
