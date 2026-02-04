"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
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
  Trash2,
  User,
  Mail,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { VendorFormValues, VendorPayload, AddressDto, ContactDto } from "@/dtos/vendor.dto";
import { createVendorFormSchema } from "../../_schemas/vendor-form.schema";
import { useVendorMutation, useUpdateVendor } from "@/hooks/use-vendor";
import { useBuTypeQuery, useBuTypeMutation } from "@/hooks/use-bu-type";
import { BuTypeGetAllDto, BuTypeFormDto } from "@/dtos/bu-type.dto";
import { useRouter } from "@/lib/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import { cn } from "@/lib/utils";
import InfoVendor from "./InfoVendor";

// ============================================================
// Types
// ============================================================

interface VendorFormProps {
  readonly mode: formType;
  readonly initData?: VendorFormValues;
}

// ============================================================
// Default Values
// ============================================================

const defaultValues: VendorFormValues = {
  id: "",
  name: "",
  code: "",
  description: "",
  business_type: [],
  info: [],
  addresses: [],
  contacts: [],
  vendor_address: { add: [], update: [], delete: [] },
  vendor_contact: { add: [], update: [], delete: [] },
};

// ============================================================
// Address Row Component
// ============================================================

interface AddressRowProps {
  fieldId: string;
  index: number;
  form: UseFormReturn<VendorFormValues>;
  isEditing: boolean;
  isViewMode: boolean;
  isDeleting?: boolean;
  onToggleEdit: (fieldId: string, index: number) => void;
  onRemove: (fieldId: string, index: number) => void;
  t: ReturnType<typeof useTranslations<"Vendor">>;
}

function AddressRow({
  fieldId,
  index,
  form,
  isEditing,
  isViewMode,
  isDeleting,
  onToggleEdit,
  onRemove,
  t,
}: AddressRowProps) {
  const addressType = form.watch(`addresses.${index}.address_type`);
  const addressData = form.watch(`addresses.${index}.data`);

  const getAddressTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      mailing_address: t("mailing_address"),
      billing_address: t("billing_address"),
      shipping_address: t("shipping_address"),
      contact_address: t("contact_address"),
    };
    return labels[type] || type;
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border transition-all duration-300",
        isEditing ? "border-primary/50 bg-primary/5" : "border-border",
        isDeleting && "opacity-0 scale-95 -translate-x-4"
      )}
    >
      {/* Action Buttons */}
      {!isViewMode && (
        <div className="absolute right-2 top-2 flex gap-1">
          <Button
            type="button"
            variant={isEditing ? "default" : "ghost"}
            size="xs"
            onClick={() => onToggleEdit(fieldId, index)}
          >
            {isEditing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
          </Button>
          <Button type="button" variant="ghost" size="xs" onClick={() => onRemove(fieldId, index)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {isEditing ? (
        // Edit Mode
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Address Type */}
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {t("address_type")}
            </Label>
            <Select
              value={form.watch(`addresses.${index}.address_type`)}
              onValueChange={(value) => form.setValue(`addresses.${index}.address_type`, value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder={t("select_type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mailing_address">{t("mailing_address")}</SelectItem>
                <SelectItem value="billing_address">{t("billing_address")}</SelectItem>
                <SelectItem value="shipping_address">{t("shipping_address")}</SelectItem>
                <SelectItem value="contact_address">{t("contact_address")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address Line 1 */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {t("address")} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                {...form.register(`addresses.${index}.data.address_line1`)}
                placeholder={t("address_line1")}
                className="h-8 text-xs pl-8"
              />
            </div>
            <Input
              {...form.register(`addresses.${index}.data.address_line2`)}
              placeholder={t("address_line2")}
              className="h-8 text-xs mt-1"
            />
          </div>

          {/* District */}
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {t("locality")}
            </Label>
            <Input
              {...form.register(`addresses.${index}.data.district`)}
              placeholder={t("district")}
              className="h-8 text-xs"
            />
          </div>

          {/* City */}
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {t("city")}
            </Label>
            <Input
              {...form.register(`addresses.${index}.data.city`)}
              placeholder={t("city")}
              className="h-8 text-xs"
            />
          </div>

          {/* Province */}
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {t("province")}
            </Label>
            <Input
              {...form.register(`addresses.${index}.data.province`)}
              placeholder={t("province")}
              className="h-8 text-xs"
            />
          </div>

          {/* Postal Code & Country */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {t("zip_code")}
              </Label>
              <Input
                {...form.register(`addresses.${index}.data.postal_code`)}
                placeholder={t("zip_code")}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {t("country")}
              </Label>
              <Input
                {...form.register(`addresses.${index}.data.country`)}
                placeholder={t("country")}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getAddressTypeLabel(addressType)}
            </Badge>
          </div>
          <div className="text-sm">
            <p>{addressData?.address_line1}</p>
            {addressData?.address_line2 && <p>{addressData.address_line2}</p>}
            <p>
              {[addressData?.district, addressData?.city, addressData?.province]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>{[addressData?.postal_code, addressData?.country].filter(Boolean).join(" ")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Contact Row Component
// ============================================================

interface ContactRowProps {
  fieldId: string;
  index: number;
  form: UseFormReturn<VendorFormValues>;
  isEditing: boolean;
  isViewMode: boolean;
  isDeleting?: boolean;
  onToggleEdit: (fieldId: string, index: number) => void;
  onRemove: (fieldId: string, index: number) => void;
  onSetPrimary: (index: number) => void;
  t: ReturnType<typeof useTranslations<"Vendor">>;
}

function ContactRow({
  fieldId,
  index,
  form,
  isEditing,
  isViewMode,
  isDeleting,
  onToggleEdit,
  onRemove,
  onSetPrimary,
  t,
}: ContactRowProps) {
  const isPrimary = form.watch(`contacts.${index}.is_primary`);
  const contactData = form.watch(`contacts.${index}`);

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border transition-all duration-300",
        isPrimary && "border-primary/50 bg-primary/5",
        isEditing && !isPrimary && "border-blue-500/50 bg-blue-500/5",
        isDeleting && "opacity-0 scale-95 -translate-x-4"
      )}
    >
      {/* Action Buttons */}
      {!isViewMode && (
        <div className="absolute right-2 top-2 flex gap-1">
          <Button
            type="button"
            variant={isEditing ? "default" : "ghost"}
            size="xs"
            onClick={() => onToggleEdit(fieldId, index)}
          >
            {isEditing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
          </Button>
          <Button type="button" variant="ghost" size="xs" onClick={() => onRemove(fieldId, index)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {isEditing ? (
        // Edit Mode
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Name */}
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {t("contact_name")} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                {...form.register(`contacts.${index}.name`)}
                placeholder={t("contact_name")}
                className="h-8 text-xs pl-8"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {t("email")}
            </Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                {...form.register(`contacts.${index}.email`)}
                placeholder={t("email")}
                className="h-8 text-xs pl-8"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {t("phone")}
            </Label>
            <div className="relative">
              <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                {...form.register(`contacts.${index}.phone`)}
                placeholder={t("phone")}
                className="h-8 text-xs pl-8"
              />
            </div>
          </div>

          {/* Primary Checkbox */}
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id={`primary-${fieldId}`}
              checked={isPrimary || false}
              onCheckedChange={() => onSetPrimary(index)}
            />
            <Label htmlFor={`primary-${fieldId}`} className="text-xs font-medium">
              {t("primary_contact")}
            </Label>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="flex items-center gap-4">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{contactData?.name || "-"}</span>
          {isPrimary && (
            <Badge variant="default" className="text-xs">
              Primary
            </Badge>
          )}
          {contactData?.email && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {contactData.email}
            </div>
          )}
          {contactData?.phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {contactData.phone}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Main Form Component
// ============================================================

export default function FormVendor({ mode, initData }: VendorFormProps) {
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

  // Form
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: currentMode === formType.ADD ? defaultValues : initData,
  });

  const watchForm = form.watch();

  console.log("watchForm", watchForm);

  // Field Arrays
  const {
    fields: addressFields,
    prepend: prependAddress,
    remove: removeAddress,
  } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const {
    fields: contactFields,
    prepend: prependContact,
    remove: removeContact,
  } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  // ============================================================
  // Inline Editing State (Pattern: ใช้ field.id แทน index)
  // ============================================================
  const [editingAddresses, setEditingAddresses] = useState<Set<string>>(new Set());
  const [editingContacts, setEditingContacts] = useState<Set<string>>(new Set());

  // Track adding state to auto-open edit mode
  const isAddingAddressRef = useRef(false);
  const isAddingContactRef = useRef(false);

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

  // ============================================================
  // Effects
  // ============================================================

  // Reset form when initData changes (for VIEW and EDIT modes)
  useEffect(() => {
    if (initData && currentMode !== formType.ADD) {
      form.reset(initData);
    }
  }, [form, initData, currentMode]);

  // Auto-open edit mode after adding address (prepend adds at index 0)
  useEffect(() => {
    if (isAddingAddressRef.current && addressFields.length > 0) {
      const firstField = addressFields[0];
      setEditingAddresses((prev) => new Set(prev).add(firstField.id));
      isAddingAddressRef.current = false;
    }
  }, [addressFields.length]);

  // Auto-open edit mode after adding contact (prepend adds at index 0)
  useEffect(() => {
    if (isAddingContactRef.current && contactFields.length > 0) {
      const firstField = contactFields[0];
      setEditingContacts((prev) => new Set(prev).add(firstField.id));
      isAddingContactRef.current = false;
    }
  }, [contactFields.length]);

  // ============================================================
  // Address Handlers
  // ============================================================

  const handleAddAddress = useCallback(() => {
    isAddingAddressRef.current = true;
    prependAddress({
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
    });
  }, [prependAddress]);

  const handleToggleEditAddress = useCallback(
    async (fieldId: string, index: number) => {
      // Validate before closing edit mode
      if (editingAddresses.has(fieldId)) {
        const isValid = await form.trigger(`addresses.${index}`);
        if (!isValid) return;
      }

      setEditingAddresses((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(fieldId)) {
          newSet.delete(fieldId);
        } else {
          newSet.add(fieldId);
        }
        return newSet;
      });
    },
    [editingAddresses, form]
  );

  const handleRemoveAddress = useCallback(
    (fieldId: string, index: number) => {
      const itemToDelete = form.getValues(`addresses.${index}`);

      // If it's a new item, delete directly without confirmation
      if (itemToDelete?.is_new) {
        removeAddress(index);
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
    [form, removeAddress]
  );

  const handleConfirmDeleteAddress = useCallback(() => {
    if (deleteAddressIndex) {
      const { fieldId, index } = deleteAddressIndex;
      const itemToDelete = form.getValues(`addresses.${index}`);

      // Track deleted ID for API (both state and form value)
      if (itemToDelete?.id) {
        setDeletedAddressIds((prev) => [...prev, itemToDelete.id!]);
        // Also update form value for visibility in watchForm
        const currentDeletes = form.getValues("vendor_address.delete") || [];
        form.setValue("vendor_address.delete", [...currentDeletes, { id: itemToDelete.id! }]);
      }

      // Start animation
      setDeletingAddressIds((prev) => new Set(prev).add(fieldId));
      setDeleteAddressIndex(null);

      // Delay actual removal to allow animation to complete
      setTimeout(() => {
        removeAddress(index);
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
  }, [deleteAddressIndex, form, removeAddress]);

  // ============================================================
  // Contact Handlers
  // ============================================================

  const handleAddContact = useCallback(() => {
    isAddingContactRef.current = true;
    prependContact({
      is_new: true,
      name: "",
      email: "",
      phone: "",
      is_primary: false,
    });
  }, [prependContact]);

  const handleToggleEditContact = useCallback(
    async (fieldId: string, index: number) => {
      // Validate before closing edit mode
      if (editingContacts.has(fieldId)) {
        const isValid = await form.trigger(`contacts.${index}`);
        if (!isValid) return;
      }

      setEditingContacts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(fieldId)) {
          newSet.delete(fieldId);
        } else {
          newSet.add(fieldId);
        }
        return newSet;
      });
    },
    [editingContacts, form]
  );

  const handleRemoveContact = useCallback(
    (fieldId: string, index: number) => {
      const itemToDelete = form.getValues(`contacts.${index}`);

      // If it's a new item, delete directly without confirmation
      if (itemToDelete?.is_new) {
        removeContact(index);
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
    [form, removeContact]
  );

  const handleConfirmDeleteContact = useCallback(() => {
    if (deleteContactIndex) {
      const { fieldId, index } = deleteContactIndex;
      const itemToDelete = form.getValues(`contacts.${index}`);

      // Track deleted ID for API (both state and form value)
      if (itemToDelete?.id) {
        setDeletedContactIds((prev) => [...prev, itemToDelete.id!]);
        // Also update form value for visibility in watchForm
        const currentDeletes = form.getValues("vendor_contact.delete") || [];
        form.setValue("vendor_contact.delete", [...currentDeletes, { id: itemToDelete.id! }]);
      }

      // Start animation
      setDeletingContactIds((prev) => new Set(prev).add(fieldId));
      setDeleteContactIndex(null);

      // Delay actual removal to allow animation to complete
      setTimeout(() => {
        removeContact(index);
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
  }, [deleteContactIndex, form, removeContact]);

  const handleSetPrimary = useCallback(
    (index: number) => {
      const currentContacts = form.getValues("contacts");
      currentContacts.forEach((_, i) => {
        if (i !== index) {
          form.setValue(`contacts.${i}.is_primary`, false);
        }
      });
      const currentValue = form.getValues(`contacts.${index}.is_primary`);
      form.setValue(`contacts.${index}.is_primary`, !currentValue);
    },
    [form]
  );

  // ============================================================
  // Form Handlers
  // ============================================================

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

      // Build payloads
      const vendorAddressPayload = {
        add: data.addresses.filter((addr) => addr.is_new) || [],
        update:
          data.addresses.filter((addr) => {
            const original = initData?.addresses?.find((o) => o.id === addr.id);
            return addr.id && !addr.is_new && original && isAddressChanged(addr, original);
          }) || [],
        delete: deletedAddressIds.map((id) => ({ id })),
      };

      const vendorContactPayload = {
        add: data.contacts.filter((contact) => contact.is_new) || [],
        update:
          data.contacts.filter((contact) => {
            const original = initData?.contacts?.find((o) => o.id === contact.id);
            return contact.id && !contact.is_new && original && isContactChanged(contact, original);
          }) || [],
        delete: deletedContactIds.map((id) => ({ id })),
      };

      // Destructure to remove UI-only fields from payload
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { addresses, contacts, ...restData } = data;

      const submitData: VendorPayload = {
        ...restData,
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
            // Clear editing states
            setEditingAddresses(new Set());
            setEditingContacts(new Set());
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

  const onCancel = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentMode === formType.ADD) {
        router.back();
      } else {
        form.reset(initData);
        setCurrentMode(formType.VIEW);
        setEditingAddresses(new Set());
        setEditingContacts(new Set());
      }
    },
    [currentMode, form, initData, router]
  );

  // ============================================================
  // Render
  // ============================================================

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
      {children}
    </FormLabel>
  );

  return (
    <div className="pb-10">
      {/* Delete Confirmation Dialogs */}
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

      {/* Sticky Header */}
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
                  Edit Vendor
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
              {addressFields.length > 0 ? (
                addressFields.map((field, index) => (
                  <AddressRow
                    key={field.id}
                    fieldId={field.id}
                    index={index}
                    form={form}
                    isEditing={editingAddresses.has(field.id)}
                    isViewMode={isViewMode}
                    isDeleting={deletingAddressIds.has(field.id)}
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
              {contactFields.length > 0 ? (
                contactFields.map((field, index) => (
                  <ContactRow
                    key={field.id}
                    fieldId={field.id}
                    index={index}
                    form={form}
                    isEditing={editingContacts.has(field.id)}
                    isViewMode={isViewMode}
                    isDeleting={deletingContactIds.has(field.id)}
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
