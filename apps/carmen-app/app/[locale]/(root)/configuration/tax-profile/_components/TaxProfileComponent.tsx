"use client";

import { Plus, FileDown, Printer } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
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
import { TaxProfileEditDto, TaxProfileFormData, TaxProfileGetAllDto } from "@/dtos/tax-profile.dto";
import { toastSuccess } from "@/components/ui-custom/Toast";
import { FormTaxProfile } from "./FormTaxProfile";
import { useTranslations } from "next-intl";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { useAuth } from "@/context/AuthContext";
import TaxProfileList from "./TaxProfileList";
import { configurationPermission } from "@/lib/permission";
import {
  useDeleteTaxProfile,
  useTaxProfileMutation,
  useTaxProfileQuery,
  useUpdateTaxProfile,
} from "@/hooks/use-tax-profile";

export function TaxProfileComponent() {
  const { token, buCode, permissions } = useAuth();
  const queryClient = useQueryClient();

  // Get permissions for tax_profile resource
  const taxProfilePerms = configurationPermission.get(permissions, "tax_profile");

  const tCommon = useTranslations("Common");
  const tTaxProfile = useTranslations("TaxProfile");

  const { taxProfiles: taxProfileData, isLoading } = useTaxProfileQuery(token, buCode);

  // Use data directly from query instead of local state
  const taxProfiles = taxProfileData?.data || [];

  const { mutate: createTaxProfile } = useTaxProfileMutation(token, buCode);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const { mutate: updateTaxProfile } = useUpdateTaxProfile(token, buCode, editingProfile ?? "");

  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);
  const { mutate: deleteTaxProfile } = useDeleteTaxProfile(token, buCode);

  const title = tTaxProfile("title");

  const handleAddNew = () => {
    setEditingProfile(null);
    setIsDialogOpen(true);
  };

  const actionButtons = (
    <div className="action-btn-container" data-id="tax-profile-action-buttons">
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
        <p>{tCommon("export")}</p>
      </Button>

      <Button
        variant="outlinePrimary"
        className="group"
        size="sm"
        data-id="tax-profile-print-button"
      >
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const handleEdit = (profileId: string) => {
    setEditingProfile(profileId);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteProfileId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deleteProfileId) return;

    deleteTaxProfile(deleteProfileId, {
      onSuccess: () => {
        toastSuccess({ message: "Tax profile deleted successfully" });
        queryClient.invalidateQueries({ queryKey: ["tax-profile"] });
        setDeleteProfileId(null);
      },
      onError: () => {
        setDeleteProfileId(null);
      },
    });
  };

  const handleDeleteCancel = () => {
    setDeleteProfileId(null);
  };

  const content = (
    <TaxProfileList
      taxProfiles={taxProfiles}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDeleteClick}
      canUpdate={taxProfilePerms.canUpdate}
      canDelete={taxProfilePerms.canDelete}
    />
  );

  const handleCreate = (data: TaxProfileFormData) => {
    createTaxProfile(data, {
      onSuccess: () => {
        toastSuccess({ message: tTaxProfile("tax_profile_created") });
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ["tax-profile"] });
        setIsDialogOpen(false);
      },
    });
  };

  const handleUpdate = (data: TaxProfileFormData) => {
    updateTaxProfile(data as TaxProfileEditDto, {
      onSuccess: () => {
        toastSuccess({ message: tTaxProfile("tax_profile_updated") });
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ["tax-profile"] });
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
      <DataDisplayTemplate title={title} actionButtons={actionButtons} content={content} />
      <FormTaxProfile
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        editingProfile={
          editingProfile
            ? taxProfiles.find((p: TaxProfileGetAllDto) => p.id === editingProfile)
            : null
        }
        onCancel={handleDialogClose}
      />

      <AlertDialog open={deleteProfileId !== null} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tTaxProfile("del_tax_profile")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tTaxProfile("del_tax_profile_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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
