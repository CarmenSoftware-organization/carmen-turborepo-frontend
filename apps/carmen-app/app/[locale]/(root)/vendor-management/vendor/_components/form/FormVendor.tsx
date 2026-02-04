"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  Plus,
  Save,
  Building2,
  MapPin,
  Phone,
  Info,
  Pencil,
  Loader2,
  User,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { MultiSelectCustom } from "@/components/ui/multi-select-custom";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import { TextareaValidate } from "@/components/ui-custom/TextareaValidate";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { FormBusinessTypeDialog } from "@/components/shared/FormBusinessTypeDialog";

import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import {
  VendorFormValues,
  VendorInitData,
  VendorPayload,
  AddressDto,
  ContactDto,
  createVendorFormSchema,
} from "@/dtos/vendor.dto";
import { useVendorMutation, useUpdateVendor, useDeleteVendor } from "@/hooks/use-vendor";
import { useBuTypeQuery, useBuTypeMutation } from "@/hooks/use-bu-type";
import { BuTypeGetAllDto, BuTypeFormDto } from "@/dtos/bu-type.dto";
import { useRouter } from "@/lib/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import InfoVendor from "./InfoVendor";
import ContactRow from "./ContactRow";
import AddressRow from "./AddressRow";

interface Props {
  readonly mode: formType;
  readonly initData?: VendorInitData;
}

const defaultFormValues: VendorFormValues = {
  id: "",
  name: "",
  code: "",
  description: "",
  business_type: [],
  info: [],
  addresses: [],
  contacts: [],
  vendor_address: { add: [], update: [], remove: [] },
  vendor_contact: { add: [], update: [], remove: [] },
};

const toFormValues = (data: VendorInitData): VendorFormValues => ({
  id: data.id,
  name: data.name,
  code: data.code,
  description: data.description,
  note: data.note,
  business_type: data.business_type,
  info: data.info,
  addresses: data.addresses,
  contacts: data.contacts,
  vendor_address: { add: [], update: [], remove: [] },
  vendor_contact: { add: [], update: [], remove: [] },
});

export default function FormVendor({ mode, initData }: Props) {
  const { token, buCode } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("Vendor");

  // Mutations
  const { mutate: createVendor, isPending: isCreating } = useVendorMutation(token, buCode);
  const { mutate: updateVendor, isPending: isUpdating } = useUpdateVendor(
    token,
    buCode,
    initData?.id ?? ""
  );
  const { buTypes } = useBuTypeQuery(token, buCode, { perpage: -1 });
  const { mutate: createBuType } = useBuTypeMutation(token, buCode);
  const { mutate: deleteVendor, isPending: isDeleting } = useDeleteVendor(token, buCode);

  const BUSINESS_TYPE_OPTIONS =
    buTypes?.data?.map((item: BuTypeGetAllDto) => ({
      label: item.name,
      value: item.id,
    })) || [];

  // Form Mode State
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [isBuTypeDialogOpen, setIsBuTypeDialogOpen] = useState(false);
  const isSubmitting = isCreating || isUpdating;
  const isViewMode = currentMode === formType.VIEW;

  // Schema
  const vendorFormSchema = useMemo(
    () =>
      createVendorFormSchema({
        nameRequired: t("name_required"),
        codeRequired: t("code_required"),
        contactNameRequired: t("contact_name_required"),
        emailInvalid: t("email_invalid"),
      }),
    [t]
  );

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues:
      currentMode === formType.ADD
        ? defaultFormValues
        : initData
          ? toFormValues(initData)
          : defaultFormValues,
  });

  const [addresses, setAddresses] = useState<(AddressDto & { _fieldId: string })[]>(() =>
    (initData?.addresses || []).map((addr, i) => ({ ...addr, _fieldId: `addr-${addr.id || i}` }))
  );
  const [contacts, setContacts] = useState<(ContactDto & { _fieldId: string })[]>(() =>
    (initData?.contacts || []).map((c, i) => ({ ...c, _fieldId: `contact-${c.id || i}` }))
  );

  const [editingAddresses, setEditingAddresses] = useState<Set<string>>(new Set());
  const [editingContacts, setEditingContacts] = useState<Set<string>>(new Set());

  // Deleted IDs for API
  const [deletedAddressIds, setDeletedAddressIds] = useState<string[]>([]);
  const [deletedContactIds, setDeletedContactIds] = useState<string[]>([]);

  // Delete Confirmation Dialog
  const [deleteAddressIndex, setDeleteAddressIndex] = useState<{
    fieldId: string;
    index: number;
  } | null>(null);
  const [deleteContactIndex, setDeleteContactIndex] = useState<{
    fieldId: string;
    index: number;
  } | null>(null);

  // Delete Animation State (track items being animated out)
  const [deletingAddressIds, setDeletingAddressIds] = useState<Set<string>>(new Set());
  const [deletingContactIds, setDeletingContactIds] = useState<Set<string>>(new Set());

  // Delete Vendor Dialog
  const [isDeleteVendorDialogOpen, setIsDeleteVendorDialogOpen] = useState(false);

  // Counter for generating unique field IDs
  const fieldIdCounter = useRef(0);

  // Reset all states when initData changes
  useEffect(() => {
    if (initData && currentMode !== formType.ADD) {
      form.reset(toFormValues(initData));
      setAddresses(
        (initData.addresses || []).map((addr, i) => ({ ...addr, _fieldId: `addr-${addr.id || i}` }))
      );
      setContacts(
        (initData.contacts || []).map((c, i) => ({ ...c, _fieldId: `contact-${c.id || i}` }))
      );
      // Clear all states
      setEditingAddresses(new Set());
      setEditingContacts(new Set());
      setDeletedAddressIds([]);
      setDeletedContactIds([]);
      setDeletingAddressIds(new Set());
      setDeletingContactIds(new Set());
      setDeleteAddressIndex(null);
      setDeleteContactIndex(null);
    }
  }, [form, initData, currentMode]);

  const handleAddAddress = useCallback(() => {
    const newFieldId = `addr-new-${++fieldIdCounter.current}`;
    const newAddress: AddressDto & { _fieldId: string } = {
      _fieldId: newFieldId,
      is_new: true,
      address_type: "",
      data: {
        address_line1: "",
        address_line2: "",
        district: "",
        province: "",
        city: "",
        postal_code: "",
        country: "",
      },
    };
    setAddresses((prev) => [newAddress, ...prev]);
    setEditingAddresses((prev) => new Set(prev).add(newFieldId));
  }, []);

  const handleToggleEditAddress = useCallback((fieldId: string) => {
    setEditingAddresses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  }, []);

  const handleRemoveAddress = useCallback(
    (fieldId: string, index: number) => {
      const itemToDelete = addresses[index];

      // If it's a new item, delete directly without confirmation
      if (itemToDelete?.is_new) {
        setAddresses((prev) => prev.filter((_, i) => i !== index));
        setEditingAddresses((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldId);
          return newSet;
        });
      } else {
        // Show confirmation dialog for existing items
        setDeleteAddressIndex({ fieldId, index });
      }
    },
    [addresses]
  );

  const handleConfirmDeleteAddress = useCallback(() => {
    if (deleteAddressIndex) {
      const { fieldId, index } = deleteAddressIndex;
      const itemToDelete = addresses[index];
      // Track deleted ID for API
      if (itemToDelete?.id) {
        setDeletedAddressIds((prev) => [...prev, itemToDelete.id!]);
        // Also update form value for visibility in watchForm
        const currentDeletes = form.getValues("vendor_address.remove") || [];
        form.setValue("vendor_address.remove", [...currentDeletes, { id: itemToDelete.id! }]);
      }

      // Start animation
      setDeletingAddressIds((prev) => new Set(prev).add(fieldId));
      setDeleteAddressIndex(null);

      // Delay actual removal to allow animation to complete
      setTimeout(() => {
        setAddresses((prev) => prev.filter((_, i) => i !== index));
        setEditingAddresses((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldId);
          return newSet;
        });
        setDeletingAddressIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldId);
          return newSet;
        });
      }, 300);
    }
  }, [deleteAddressIndex, addresses, form]);

  const handleAddContact = useCallback(() => {
    const newFieldId = `contact-new-${++fieldIdCounter.current}`;
    const newContact: ContactDto & { _fieldId: string } = {
      _fieldId: newFieldId,
      is_new: true,
      name: "",
      email: "",
      phone: "",
      is_primary: false,
    };
    setContacts((prev) => [newContact, ...prev]);
    setEditingContacts((prev) => new Set(prev).add(newFieldId));
  }, []);

  const handleToggleEditContact = useCallback((fieldId: string) => {
    setEditingContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  }, []);

  const handleRemoveContact = useCallback(
    (fieldId: string, index: number) => {
      const itemToDelete = contacts[index];

      // If it's a new item, delete directly without confirmation
      if (itemToDelete?.is_new) {
        setContacts((prev) => prev.filter((_, i) => i !== index));
        setEditingContacts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldId);
          return newSet;
        });
      } else {
        // Show confirmation dialog for existing items
        setDeleteContactIndex({ fieldId, index });
      }
    },
    [contacts]
  );

  const handleConfirmDeleteContact = useCallback(() => {
    if (deleteContactIndex) {
      const { fieldId, index } = deleteContactIndex;
      const itemToDelete = contacts[index];

      // Track deleted ID for API
      if (itemToDelete?.id) {
        setDeletedContactIds((prev) => [...prev, itemToDelete.id!]);
        // Also update form value for visibility in watchForm
        const currentDeletes = form.getValues("vendor_contact.remove") || [];
        form.setValue("vendor_contact.remove", [...currentDeletes, { id: itemToDelete.id! }]);
      }

      // Start animation
      setDeletingContactIds((prev) => new Set(prev).add(fieldId));
      setDeleteContactIndex(null);

      // Delay actual removal to allow animation to complete
      setTimeout(() => {
        setContacts((prev) => prev.filter((_, i) => i !== index));
        setEditingContacts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldId);
          return newSet;
        });
        setDeletingContactIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldId);
          return newSet;
        });
      }, 300);
    }
  }, [deleteContactIndex, contacts, form]);

  const handleSetPrimary = useCallback((index: number) => {
    setContacts((prev) =>
      prev.map((contact, i) => ({
        ...contact,
        is_primary: i === index ? !contact.is_primary : false,
      }))
    );
  }, []);

  const handleBusinessTypeChange = useCallback(
    (values: string[], onChange: (value: any) => void) => {
      const selectedTypes = values.map((val: string) => {
        const option = BUSINESS_TYPE_OPTIONS.find(
          (opt: { label: string; value: string }) => opt.value === val
        );
        return { id: val, name: option?.label || "" };
      });
      onChange(selectedTypes);
    },
    [BUSINESS_TYPE_OPTIONS]
  );

  const handleCreateBuType = useCallback(
    (data: BuTypeFormDto) => {
      createBuType(data, {
        onSuccess: () => {
          toastSuccess({ message: t("create_bu_type_success") });
          setIsBuTypeDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ["bu-type", buCode] });
        },
        onError: (error: Error) => {
          toastError({ message: t("create_bu_type_error") });
        },
      });
    },
    [createBuType, t, queryClient, buCode]
  );

  const onSubmit = useCallback(
    (data: VendorFormValues) => {
      // Helper functions
      const isAddressChanged = (current: AddressDto, original?: AddressDto) => {
        if (!original) return true;
        const d1 = current.data;
        const d2 = original.data;
        return (
          current.address_type !== original.address_type ||
          d1.address_line1 !== d2.address_line1 ||
          (d1.address_line2 || "") !== (d2.address_line2 || "") ||
          d1.district !== d2.district ||
          (d1.province || "") !== (d2.province || "") ||
          (d1.city || "") !== (d2.city || "") ||
          d1.postal_code !== d2.postal_code ||
          d1.country !== d2.country
        );
      };

      const isContactChanged = (current: ContactDto, original?: ContactDto) => {
        if (!original) return true;
        return (
          current.name !== original.name ||
          (current.email || "") !== (original.email || "") ||
          (current.phone || "") !== (original.phone || "") ||
          current.is_primary !== original.is_primary
        );
      };

      // Build payloads from local state arrays (exclude _fieldId and is_new from payload)
      const vendorAddressPayload = {
        add:
          addresses.filter((addr) => addr.is_new).map(({ _fieldId, is_new, ...rest }) => rest) ||
          [],
        update:
          addresses
            .filter((addr) => {
              const original = initData?.addresses?.find((o) => o.id === addr.id);
              return addr.id && !addr.is_new && original && isAddressChanged(addr, original);
            })
            .map(({ _fieldId, is_new, ...rest }) => rest) || [],
        remove: deletedAddressIds.map((id) => ({ id })),
      };

      const vendorContactPayload = {
        add:
          contacts
            .filter((contact) => contact.is_new)
            .map(({ _fieldId, is_new, ...rest }) => rest) || [],
        update:
          contacts
            .filter((contact) => {
              const original = initData?.contacts?.find((o) => o.id === contact.id);
              return (
                contact.id && !contact.is_new && original && isContactChanged(contact, original)
              );
            })
            .map(({ _fieldId, is_new, ...rest }) => rest) || [],
        remove: deletedContactIds.map((id) => ({ id })),
      };

      const submitData: VendorPayload = {
        ...data,
        vendor_address: vendorAddressPayload,
        vendor_contact: vendorContactPayload,
      };

      if (currentMode === formType.ADD) {
        createVendor(submitData, {
          onSuccess: (response: any) => {
            toastSuccess({ message: t("add_success") });
            queryClient.invalidateQueries({ queryKey: ["vendor", buCode] });
            const vendorId = response?.data?.id || response?.id;
            if (vendorId) {
              router.replace(`/vendor-management/vendor/${vendorId}`);
              setCurrentMode(formType.VIEW);
            }
          },
          onError: () => {
            toastError({ message: t("add_error") });
          },
        });
      } else if (currentMode === formType.EDIT && initData?.id) {
        submitData.id = initData.id;
        updateVendor(submitData, {
          onSuccess: () => {
            toastSuccess({ message: t("update_success") });
            queryClient.invalidateQueries({ queryKey: ["vendor", buCode, initData.id] });
            setCurrentMode(formType.VIEW);
            // Note: state reset is handled by key prop in parent (component remounts on data change)
          },
          onError: () => {
            toastError({ message: t("update_error") });
          },
        });
      }
    },
    [
      currentMode,
      initData,
      addresses,
      contacts,
      deletedAddressIds,
      deletedContactIds,
      createVendor,
      updateVendor,
      t,
      queryClient,
      buCode,
      router,
    ]
  );

  const onEdit = useCallback(() => {
    setCurrentMode(formType.EDIT);
  }, []);

  const onDeleteVendor = useCallback(() => {
    setIsDeleteVendorDialogOpen(true);
  }, []);

  const handleConfirmDeleteVendor = useCallback(() => {
    if (!initData?.id) return;

    deleteVendor(initData.id, {
      onSuccess: () => {
        toastSuccess({ message: t("delete_success") });
        queryClient.invalidateQueries({ queryKey: ["vendor", buCode] });
        router.replace("/vendor-management/vendor");
      },
      onError: () => {
        toastError({ message: t("delete_error") });
      },
    });
    setIsDeleteVendorDialogOpen(false);
  }, [initData?.id, deleteVendor, t, queryClient, buCode, router]);

  const onCancel = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentMode === formType.ADD) {
        router.back();
      } else {
        // Reset form and local state
        if (initData) {
          form.reset(toFormValues(initData));
          setAddresses(
            initData.addresses.map((addr, i) => ({ ...addr, _fieldId: `addr-${addr.id || i}` }))
          );
          setContacts(
            initData.contacts.map((c, i) => ({ ...c, _fieldId: `contact-${c.id || i}` }))
          );
        }
        setCurrentMode(formType.VIEW);
        // Clear all states
        setEditingAddresses(new Set());
        setEditingContacts(new Set());
        setDeletedAddressIds([]);
        setDeletedContactIds([]);
        setDeletingAddressIds(new Set());
        setDeletingContactIds(new Set());
        setDeleteAddressIndex(null);
        setDeleteContactIndex(null);
      }
    },
    [currentMode, form, initData, router]
  );

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
      {children}
    </FormLabel>
  );

  return (
    <div className="pb-10">
      <DeleteConfirmDialog
        open={isDeleteVendorDialogOpen}
        onOpenChange={setIsDeleteVendorDialogOpen}
        onConfirm={handleConfirmDeleteVendor}
        title={t("delete_vendor")}
        description={t("delete_vendor_description")}
      />

      <DeleteConfirmDialog
        open={deleteAddressIndex !== null}
        onOpenChange={(open) => !open && setDeleteAddressIndex(null)}
        onConfirm={handleConfirmDeleteAddress}
        title={t("delete_address_title")}
        description={t("delete_address_description")}
      />
      <DeleteConfirmDialog
        open={deleteContactIndex !== null}
        onOpenChange={(open) => !open && setDeleteContactIndex(null)}
        onConfirm={handleConfirmDeleteContact}
        title={t("delete_contact_title")}
        description={t("delete_contact_description")}
      />

      <div className="sticky top-0 z-10 bg-background">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    {currentMode === formType.ADD
                      ? t("new_vendor")
                      : initData?.name || t("vendor_details")}
                  </h1>
                  {isViewMode && <Badge variant="active">Active</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentMode === formType.ADD
                    ? "Create a new vendor profile"
                    : `Code: ${initData?.code}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isViewMode ? (
                <Button size="sm" onClick={onEdit}>
                  <Pencil className="h-4 w-4" />
                  {t("edit_vendor")}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    disabled={isSubmitting}
                  >
                    {t("cancel")}
                  </Button>
                  <Button size="sm" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                    {isSubmitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        {t("save")}
                      </>
                    )}
                  </Button>
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    disabled={isDeleting}
                    onClick={onDeleteVendor}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("delete")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <Form {...form}>
          <form className="px-6 py-3">
            {/* General Information */}
            <div className="p-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">{t("general_information")}</h3>
              </div>
            </div>
            <div className="p-3 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="code"
                required
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <SectionLabel>{t("code")}</SectionLabel>
                    <FormControl>
                      <InputValidate
                        {...field}
                        maxLength={10}
                        disabled={isViewMode}
                        className="h-8 text-sm"
                        placeholder={t("code_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                required
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
                    <SectionLabel>{t("name")}</SectionLabel>
                    <FormControl>
                      <InputValidate
                        {...field}
                        disabled={isViewMode}
                        className="h-8 text-sm"
                        maxLength={100}
                        placeholder={t("name_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_type"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-2 space-y-1">
                    <SectionLabel>{t("business_type")}</SectionLabel>
                    <FormControl>
                      <div className="h-8">
                        <MultiSelectCustom
                          options={BUSINESS_TYPE_OPTIONS}
                          onValueChange={(values: string[]) =>
                            handleBusinessTypeChange(values, field.onChange)
                          }
                          defaultValue={field.value.map((v) => v.id)}
                          placeholder="Select types"
                          variant="inverted"
                          animation={2}
                          maxCount={3}
                          disabled={isViewMode}
                          className="text-sm rounded-md"
                        >
                          <div className="border-t border-border w-full">
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full text-xs justify-start h-8 text-primary hover:text-primary/80 hover:bg-transparent px-2"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsBuTypeDialogOpen(true);
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {t("new_business_type")}
                            </Button>
                          </div>
                        </MultiSelectCustom>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-4 space-y-1">
                    <SectionLabel>{t("description")}</SectionLabel>
                    <FormControl>
                      <TextareaValidate
                        {...field}
                        value={field.value ?? ""}
                        disabled={isViewMode}
                        maxLength={256}
                        className="min-h-[80px] text-sm resize-none"
                        placeholder={t("description_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Info */}
            <div className="p-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">{t("additional_info")}</h3>
              </div>
            </div>
            <div className="p-3">
              <InfoVendor form={form} disabled={isViewMode} />
            </div>

            {/* Addresses Section */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">{t("addresses")}</h3>
                </div>
                {!isViewMode && (
                  <Button type="button" variant="outline" size="xs" onClick={handleAddAddress}>
                    <Plus className="h-3.5 w-3.5" />
                    {t("add_address")}
                  </Button>
                )}
              </div>
            </div>
            <div className="p-3 space-y-3">
              {addresses.length > 0 ? (
                addresses.map((address, index) => (
                  <AddressRow
                    key={address._fieldId}
                    fieldId={address._fieldId}
                    index={index}
                    address={address}
                    onAddressChange={(newAddress) => {
                      setAddresses((prev) =>
                        prev.map((a, i) =>
                          i === index ? { ...newAddress, _fieldId: a._fieldId } : a
                        )
                      );
                    }}
                    isEditing={editingAddresses.has(address._fieldId)}
                    isViewMode={isViewMode}
                    isDeleting={deletingAddressIds.has(address._fieldId)}
                    onToggleEdit={handleToggleEditAddress}
                    onRemove={handleRemoveAddress}
                    t={t}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-muted-foreground">
                  <MapPin className="mb-2 h-10 w-10 opacity-20" />
                  <p className="text-xs font-medium">{t("no_addresses")}</p>
                  {!isViewMode && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleAddAddress}
                      className="text-primary mt-1 h-auto p-0 font-normal text-xs"
                    >
                      {t("add_address")}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Contacts Section */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">{t("contact")}</h3>
                </div>
                {!isViewMode && (
                  <Button type="button" variant="outline" size="xs" onClick={handleAddContact}>
                    <Plus className="h-3.5 w-3.5" />
                    {t("add_contact")}
                  </Button>
                )}
              </div>
            </div>
            <div className="p-3 space-y-3">
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <ContactRow
                    key={contact._fieldId}
                    fieldId={contact._fieldId}
                    index={index}
                    contact={contact}
                    onContactChange={(newContact) => {
                      setContacts((prev) =>
                        prev.map((c, i) =>
                          i === index ? { ...newContact, _fieldId: c._fieldId } : c
                        )
                      );
                    }}
                    isEditing={editingContacts.has(contact._fieldId)}
                    isViewMode={isViewMode}
                    isDeleting={deletingContactIds.has(contact._fieldId)}
                    onToggleEdit={handleToggleEditContact}
                    onRemove={handleRemoveContact}
                    onSetPrimary={handleSetPrimary}
                    t={t}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-muted-foreground">
                  <User className="mb-2 h-10 w-10 opacity-20" />
                  <p className="text-xs font-medium">{t("no_contacts")}</p>
                  {!isViewMode && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleAddContact}
                      className="text-primary mt-1 h-auto p-0 font-normal text-xs"
                    >
                      {t("add_contact")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </form>
        </Form>

        <FormBusinessTypeDialog
          open={isBuTypeDialogOpen}
          onOpenChange={setIsBuTypeDialogOpen}
          onSubmit={handleCreateBuType}
          onCancel={() => setIsBuTypeDialogOpen(false)}
        />
      </div>
    </div>
  );
}
