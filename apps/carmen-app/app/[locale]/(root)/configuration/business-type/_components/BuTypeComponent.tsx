"use client";

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  BuTypeEditDto,
  BuTypeFormDto,
  BuTypeGetAllDto,
} from "@/dtos/bu-type.dto";
import { useURL } from "@/hooks/useURL";
import { Plus, Printer, FileDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
  useBuTypeMutation,
  useBuTypeQuery,
  useDeleteBuType,
  useUpdateBuType,
} from "../_hooks/use-bu-type";
import { toastSuccess } from "@/components/ui-custom/Toast";
import BuTypeList from "./BuTypeList";
import { parseSortString } from "@/utils/table";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { FormBuTypeDialog } from "./FormBuTypeDialog";
import { configurationPermission } from "@/lib/permission";

export default function BusinessTypeComponent() {
  const { token, buCode, permissions } = useAuth();
  const businessTypePerms = configurationPermission.get(permissions, "business_type");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tBusinessType = useTranslations("BusinessType");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");
  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [filter, setFilter] = useURL("filter");
  const [statusOpen, setStatusOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<BuTypeFormDto | null>(
    null
  );
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);

  const { buTypes, isLoading } = useBuTypeQuery(token, buCode, {
    page: page ? Number(page) : 1,
    perpage: perpage,
    search,
    filter,
    sort
  });

  const [buTypesData, setBuTypesData] = useState<BuTypeGetAllDto[]>([]);

  useEffect(() => {
    if (buTypes?.data) {
      setBuTypesData(buTypes.data);
    }
  }, [buTypes]);

  const { mutate: createBuType } = useBuTypeMutation(token, buCode);

  const { mutate: updateBuType } = useUpdateBuType(
    token,
    buCode,
    editingProfileId ?? ""
  );

  const { mutate: deleteBuType } = useDeleteBuType(token, buCode);
  const title = tBusinessType("title");

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

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const handleAddNew = () => {
    setEditingProfile(null);
    setEditingProfileId(null);
    setIsDialogOpen(true);
  };

  const actionButtons = (
    <div
      className="action-btn-container"
      data-id="bu-type-list-action-buttons"
    >
      {businessTypePerms.canCreate && (
        <Button size="sm" onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          {tCommon("add")}
        </Button>
      )}
      <Button
        variant="outlinePrimary"
        className="group"
        size="sm"
        data-id="bu-type-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button
        variant="outlinePrimary"
        size="sm"
        data-id="bu-type-print-button"
      >
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="bu-type-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="bu-type-search-input"
      />
      <div className="fxr-c gap-2">
        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="bu-type-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="bu-type-sort-dropdown"
        />
      </div>
    </div>
  );

  const handleEdit = (id: string) => {
    const buType = buTypesData.find((bt) => bt.id === id);
    if (buType) {
      const formData: BuTypeFormDto = {
        name: buType.name,
        description: buType.description,
        note: buType.note,
        is_active: buType.is_active,
      };
      setEditingProfile(formData);
      setEditingProfileId(id);
      setIsDialogOpen(true);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handleCreate = (data: BuTypeFormDto) => {
    createBuType(data, {
      onSuccess: () => {
        setBuTypesData((prev) => [...prev, data as BuTypeGetAllDto]);
        setIsDialogOpen(false);
        toastSuccess({ message: tBusinessType("business_type_created") });
      },
    });
  };

  const updateBuTypeInList = (prev: BuTypeGetAllDto[], updatedData: BuTypeEditDto) => {
    return prev.map((bu) =>
      bu.id === updatedData.id ? { ...bu, ...updatedData } : bu
    );
  };

  const handleUpdateSuccess = (data: BuTypeEditDto) => {
    setBuTypesData((prev) => updateBuTypeInList(prev, data));
    toastSuccess({ message: tBusinessType("business_type_updated") });
    setIsDialogOpen(false);
    setEditingProfileId(null);
  };

  const handleUpdate = (data: BuTypeEditDto) => {
    updateBuType(data, {
      onSuccess: () => handleUpdateSuccess(data),
    });
  };

  const handleDelete = (id: string) => {
    setDeleteProfileId(id);
  };

  const handleDeleteSuccess = (deletedId: string) => {
    setBuTypesData((prev) => prev.filter((bu) => bu.id !== deletedId));
    toastSuccess({ message: tBusinessType("business_type_deleted") });
    setDeleteProfileId(null);
  };

  const confirmDelete = () => {
    if (!deleteProfileId) return;

    deleteBuType(deleteProfileId, {
      onSuccess: () => handleDeleteSuccess(deleteProfileId),
    });
  };

  const content = (
    <BuTypeList
      buTypes={buTypesData}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      currentPage={Number(page || "1")}
      totalPages={buTypes?.paginate.pages ?? 1}
      totalItems={buTypes?.paginate.total ?? buTypes?.data?.length ?? 0}
      perpage={buTypes?.paginate.perpage ?? 10}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onSort={setSort}
      setPerpage={handleSetPerpage}
      canUpdate={businessTypePerms.canUpdate}
      canDelete={businessTypePerms.canDelete}
    />
  )

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProfile(null);
    setEditingProfileId(null);
  };

  const handleSubmit = (data: BuTypeFormDto) => {
    if (editingProfile && editingProfileId) {
      const editDto: BuTypeEditDto = {
        id: editingProfileId,
        ...data,
      };
      handleUpdate(editDto);
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

      <FormBuTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        editingProfile={editingProfile}
        onCancel={handleDialogClose}
      />

      <AlertDialog
        open={deleteProfileId !== null}
        onOpenChange={() => setDeleteProfileId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tBusinessType("confirm_delete")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tBusinessType("confirm_delete_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
