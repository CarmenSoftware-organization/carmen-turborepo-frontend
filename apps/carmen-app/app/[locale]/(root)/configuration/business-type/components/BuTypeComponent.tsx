"use client";

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { boolFilterOptions } from "@/constants/options";
import { useAuth } from "@/context/AuthContext";
import {
  BuTypeEditDto,
  BuTypeFormDto,
  BuTypeGetAllDto,
} from "@/dtos/bu-type.dto";
import { useURL } from "@/hooks/useURL";
import { Plus, Printer, SquarePen, Trash2 } from "lucide-react";
import { FileDown } from "lucide-react";
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
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import {
  useBuTypeMutation,
  useBuTypeQuery,
  useDeleteBuType,
  useUpdateBuType,
} from "@/hooks/useBuType";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { Badge } from "@/components/ui/badge";
import { FormBuType } from "./FormBuType";
import { toastSuccess } from "@/components/ui-custom/Toast";

export default function BusinessTypeComponent() {
  const { token, tenantId } = useAuth();
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tBusinessType = useTranslations("BusinessType");
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

  const { buTypes, isLoading } = useBuTypeQuery(token, tenantId);

  const [buTypesData, setBuTypesData] = useState<BuTypeGetAllDto[]>([]);

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

  const content = useMemo(() => {
    return (
      <Table className="border">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead className="w-56">{tHeader("name")}</TableHead>
            <TableHead className="w-56">{tHeader("note")}</TableHead>
            <TableHead className="w-40">{tHeader("status")}</TableHead>
            <TableHead className="text-right">{tHeader("action")}</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableBodySkeleton rows={5} />
        ) : (
          <TableBody>
            {buTypesData?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-8"
                >
                  {tBusinessType("no_business_type")}
                </TableCell>
              </TableRow>
            ) : (
              buTypesData?.map((bu: BuTypeGetAllDto, index: number) => (
                <TableRow key={bu.id} className="hover:bg-muted/50">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{bu.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {bu.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{bu.note}</TableCell>
                  <TableCell>
                    <Badge variant={bu.is_active ? "active" : "inactive"}>
                      {bu.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(bu.id)}
                        className="h-8 w-8 p-0"
                      >
                        <SquarePen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteProfileId(bu.id)}
                        className="h-8 w-8 p-0 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        )}
      </Table>
    );
  }, [buTypesData]);

  const handleCreate = (data: BuTypeFormDto) => {
    createBuType(data, {
      onSuccess: () => {
        setBuTypesData((prev) => [...prev, data as BuTypeGetAllDto]);
        setIsDialogOpen(false);
        toastSuccess({ message: tBusinessType("business_type_created") });
      },
    });
  };

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

  const handleDelete = (id: string) => {
    deleteBuType(undefined, {
      onSuccess: () => {
        setBuTypesData((prev) => prev.filter((bu) => bu.id !== id));
        toastSuccess({ message: tBusinessType("business_type_deleted") });
        setDeleteProfileId(null);
      },
    });
  };

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

      <FormBuType
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
