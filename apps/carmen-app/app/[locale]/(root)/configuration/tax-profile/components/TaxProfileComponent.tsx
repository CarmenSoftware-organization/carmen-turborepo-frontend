"use client";

import { Plus, FileDown, Printer } from "lucide-react";
import { useEffect, useState } from "react";
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
import { configurationPermission } from "@/lib/permission";

export function TaxProfileComponent() {
  const { token, buCode, permissions } = useAuth();

  // Get permissions for tax_profile resource
  const taxProfilePerms = configurationPermission.get(permissions, "tax_profile");

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
    buCode,
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

  const { mutate: createTaxProfile } = useTaxProfileMutation(token, buCode);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const { mutate: updateTaxProfile } = useUpdateTaxProfile(
    token,
    buCode,
    editingProfile ?? ""
  );

  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);
  const { mutate: deleteTaxProfile } = useDeleteTaxProfile(
    token,
    buCode,
    deleteProfileId ?? ""
  );


  const [statusOpen, setStatusOpen] = useState(false);

  const currentPage = taxProfileData?.paginate.page ?? 1;
  const totalPages = taxProfileData?.paginate.pages ?? 1;
  const totalItems = taxProfileData?.paginate.total ?? taxProfileData?.data?.length ?? 0;

  const title = tTaxProfile("title");

  const sortFields = [
    {
      key: "name",
      label: tHeader("name"),
    },
    {
      key: "is_active",
      label: tHeader("status"),
    },
  ];

  useEffect(() => {
    if (search) {
      setSort("");
    }
  }, [search, setSort]);

  const handleAddNew = () => {
    setEditingProfile(null);
    setIsDialogOpen(true);
  };

  const actionButtons = (
    <div
      className="action-btn-container"
      data-id="tax-profile-action-buttons"
    >
      {taxProfilePerms.canCreate && (
        <Button size="sm" onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          {tCommon("add")}
        </Button>
      )}
      <Button
        variant="outlinePrimary"
        className="group"
        size="sm"
        data-id="tax-profile-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button
        variant="outlinePrimary"
        size="sm"
        data-id="tax-profile-print-button"
      >
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="tax-profile-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="tax-profile-search-input"
      />
      <div className="fxr-c gap-2">
        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="tax-profile-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="tax-profile-sort-dropdown"
        />
      </div>
    </div>
  );

  const handleEdit = (profileId: string) => {
    setEditingProfile(profileId);
    setIsDialogOpen(true);
  };

  const onDeleteSuccess = (id: string) => {
    setTaxProfiles((prev) => prev.filter((profile) => profile.id !== id));
    toastSuccess({ message: tTaxProfile("tax_profile_deleted") });
    setDeleteProfileId(null);
  };

  const handleDelete = (id: string) => {
    deleteTaxProfile(undefined, {
      onSuccess: () => onDeleteSuccess(id),
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const content = (
    <TaxProfileList
      taxProfiles={taxProfiles}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      perpage={taxProfileData?.paginate.perpage ?? 10}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onSort={setSort}
      setPerpage={handleSetPerpage}
      canUpdate={taxProfilePerms.canUpdate}
      canDelete={taxProfilePerms.canDelete}
    />
  );

  const onCreateSuccess = (data: TaxProfileFormData) => {
    setTaxProfiles((prev) => [...prev, data as TaxProfileGetAllDto]);
    setIsDialogOpen(false);
    toastSuccess({ message: tTaxProfile("tax_profile_created") });
  };

  const handleCreate = (data: TaxProfileFormData) => {
    createTaxProfile(data, {
      onSuccess: () => onCreateSuccess(data),
    });
  };

  const onUpdateSuccess = (data: TaxProfileFormData) => {
    setTaxProfiles((prev) =>
      prev.map((profile) =>
        profile.id === editingProfile ? { ...profile, ...data } : profile
      )
    );
    toastSuccess({ message: tTaxProfile("tax_profile_updated") });
    setIsDialogOpen(false);
    setEditingProfile(null);
  };

  const handleUpdate = (data: TaxProfileFormData) => {
    updateTaxProfile(data as TaxProfileEditDto, {
      onSuccess: () => onUpdateSuccess(data),
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
