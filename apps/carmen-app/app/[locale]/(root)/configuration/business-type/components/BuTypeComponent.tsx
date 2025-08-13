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
import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@/hooks/useBuType";
import { toastSuccess } from "@/components/ui-custom/Toast";
import BuTypeList from "./BuTypeList";
import { parseSortString } from "@/utils/table-sort";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { FormBuTypeDialog } from "./FormBuTypeDialog";

export default function BusinessTypeComponent() {
  const { token, tenantId } = useAuth();
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

  const { buTypes, isLoading } = useBuTypeQuery(token, tenantId, {
    page: page ? parseInt(page) : 1,
    perpage: perpage,
    search,
    filter,
    sort
  });

  const [buTypesData, setBuTypesData] = useState<BuTypeGetAllDto[]>([]);
  const [selectedBuTypes, setSelectedBuTypes] = useState<string[]>([]);

  useEffect(() => {
    if (buTypes?.data) {
      setBuTypesData(buTypes.data);
    }
  }, [buTypes]);

  const { mutate: createBuType } = useBuTypeMutation(token, tenantId);

  const { mutate: updateBuType } = useUpdateBuType(
    token,
    tenantId,
    editingProfileId ?? ""
  );

  const { mutate: deleteBuType } = useDeleteBuType(
    token,
    tenantId,
    deleteProfileId ?? ""
  );
  const title = tBusinessType("title");

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

  const handleSelectAll = useCallback((isChecked: boolean) => {
    if (isChecked) {
      setSelectedBuTypes(buTypesData.map((bu) => bu.id));
    } else {
      setSelectedBuTypes([]);
    }
  }, [buTypesData]);

  const handleSelect = useCallback((id: string) => {
    setSelectedBuTypes((prev) => {
      if (prev.includes(id)) {
        return prev.filter(buId => buId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handleSetFilter = useCallback(
    (filterValue: string) => {
      setFilter(filterValue);
    },
    [setFilter]
  );

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

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const handleAddNew = useCallback(() => {
    setEditingProfile(null);
    setEditingProfileId(null);
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
            setSort={handleSort}
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
      handleSort,
    ]
  );

  const handleEdit = useCallback((id: string) => {
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
  }, [buTypesData]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage.toString());
  }, [setPage]);

  const handleCreate = (data: BuTypeFormDto) => {
    createBuType(data, {
      onSuccess: () => {
        setBuTypesData((prev) => [...prev, data as BuTypeGetAllDto]);
        setIsDialogOpen(false);
        toastSuccess({ message: tBusinessType("business_type_created") });
      },
    });
  };

  const handleUpdate = (data: BuTypeEditDto) => {
    updateBuType(data, {
      onSuccess: () => {
        setBuTypesData((prev) =>
          prev.map((bu) => (bu.id === data.id ? { ...bu, ...data } : bu))
        );
        toastSuccess({ message: tBusinessType("business_type_updated") });
        setIsDialogOpen(false);
        setEditingProfileId(null);
      },
    });
  };

  const handleDelete = useCallback((id: string) => {
    setDeleteProfileId(id);
  }, []);

  const confirmDelete = () => {
    if (deleteProfileId) {
      deleteBuType(undefined, {
        onSuccess: () => {
          setBuTypesData((prev) => prev.filter((bu) => bu.id !== deleteProfileId));
          toastSuccess({ message: tBusinessType("business_type_deleted") });
          setDeleteProfileId(null);
        },
      });
    }
  };

  const content = (
    <BuTypeList
      buTypes={buTypesData}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      currentPage={parseInt(page || "1")}
      totalPages={buTypes?.paginate.pages ?? 1}
      onPageChange={handlePageChange}
      totalItems={buTypes?.paginate.total ?? buTypes?.data?.length ?? 0}
      sort={parseSortString(sort)}
      onSort={handleSort}
      selectedBuTypes={selectedBuTypes}
      onSelectAll={handleSelectAll}
      onSelect={handleSelect}
      perpage={buTypes?.paginate.perpage}
      setPerpage={handleSetPerpage}
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
