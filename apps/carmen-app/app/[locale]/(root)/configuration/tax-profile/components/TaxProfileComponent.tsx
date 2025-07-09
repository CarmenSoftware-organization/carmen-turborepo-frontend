"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquarePen, Trash2, Plus, FileDown, Printer } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { taxProfileMock } from "./mock";
import { Badge } from "@/components/ui/badge";
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
import { TaxProfileFormData } from "@/dtos/tax-profile.dto";
import { toastSuccess } from "@/components/ui-custom/Toast";
import { FormTaxProfile } from "./FormTaxProfile";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { boolFilterOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";

export function TaxProfileComponent() {
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const [taxProfiles, setTaxProfiles] = useState(taxProfileMock);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);
  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [filter, setFilter] = useURL("filter");
  const [statusOpen, setStatusOpen] = useState(false);

  const title = "Tax Profile";

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
  const content = useMemo(() => {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {taxProfiles.map((profile) => (
          <Card
            key={profile.id}
            className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {profile.name}
                </CardTitle>
                <Badge variant={profile.is_active ? "active" : "inactive"}>
                  {profile.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Tax Rate: {profile.tax_rate}%
              </div>
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(profile.id)}
                >
                  <SquarePen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-destructive"
                  onClick={() => setDeleteProfileId(profile.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }, [taxProfiles]);

  const handleCreate = (data: TaxProfileFormData) => {
    // TODO: call api to create tax profile
    const newProfile = {
      id: crypto.randomUUID(),
      ...data,
    };
    setTaxProfiles((prev) => [...prev, newProfile]);
    setIsDialogOpen(false);
    toastSuccess({ message: "Tax profile created successfully" });
  };

  const handleEdit = (profileId: string) => {
    // TODO: call api to edit tax profile
    setEditingProfile(profileId);
    setIsDialogOpen(true);
  };

  const handleUpdate = (data: TaxProfileFormData) => {
    // TODO: call api to update tax profile
    if (editingProfile) {
      setTaxProfiles((prev) =>
        prev.map((profile) =>
          profile.id === editingProfile ? { ...profile, ...data } : profile
        )
      );
      toastSuccess({ message: "Tax profile updated successfully" });
      setIsDialogOpen(false);
      setEditingProfile(null);
    }
  };

  const handleDelete = (profileId: string) => {
    // TODO: call api to delete tax profile
    setTaxProfiles((prev) =>
      prev.filter((profile) => profile.id !== profileId)
    );
    toastSuccess({ message: "Tax profile deleted successfully" });
    setDeleteProfileId(null);
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
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Tax Profile? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProfileId && handleDelete(deleteProfileId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
