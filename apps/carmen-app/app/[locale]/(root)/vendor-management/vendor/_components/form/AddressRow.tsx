"use client";

import { useTranslations } from "next-intl";
import { Check, MapPin, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AddressDto } from "@/dtos/vendor.dto";

export interface AddressRowProps {
  fieldId: string;
  index: number;
  address: AddressDto;
  onAddressChange: (address: AddressDto) => void;
  isEditing: boolean;
  isViewMode: boolean;
  isDeleting?: boolean;
  onToggleEdit: (fieldId: string) => void;
  onRemove: (fieldId: string, index: number) => void;
  t: ReturnType<typeof useTranslations<"Vendor">>;
}

export default function AddressRow({
  fieldId,
  index,
  address,
  onAddressChange,
  isEditing,
  isViewMode,
  isDeleting,
  onToggleEdit,
  onRemove,
  t,
}: AddressRowProps) {
  const getAddressTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      mailing_address: t("mailing_address"),
      billing_address: t("billing_address"),
      shipping_address: t("shipping_address"),
      contact_address: t("contact_address"),
    };
    return labels[type] || type;
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field.startsWith("data.")) {
      const dataField = field.replace("data.", "");
      onAddressChange({
        ...address,
        data: {
          ...address.data,
          [dataField]: value,
        },
      });
    } else {
      onAddressChange({
        ...address,
        [field]: value,
      });
    }
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
            onClick={() => onToggleEdit(fieldId)}
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
              value={address.address_type}
              onValueChange={(value) => handleFieldChange("address_type", value)}
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
                value={address.data?.address_line1 || ""}
                onChange={(e) => handleFieldChange("data.address_line1", e.target.value)}
                placeholder={t("address_line1")}
                className="h-8 text-xs pl-8"
              />
            </div>
            <Input
              value={address.data?.address_line2 || ""}
              onChange={(e) => handleFieldChange("data.address_line2", e.target.value)}
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
              value={address.data?.district || ""}
              onChange={(e) => handleFieldChange("data.district", e.target.value)}
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
              value={address.data?.city || ""}
              onChange={(e) => handleFieldChange("data.city", e.target.value)}
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
              value={address.data?.province || ""}
              onChange={(e) => handleFieldChange("data.province", e.target.value)}
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
                value={address.data?.postal_code || ""}
                onChange={(e) => handleFieldChange("data.postal_code", e.target.value)}
                placeholder={t("zip_code")}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {t("country")}
              </Label>
              <Input
                value={address.data?.country || ""}
                onChange={(e) => handleFieldChange("data.country", e.target.value)}
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
              {getAddressTypeLabel(address.address_type)}
            </Badge>
          </div>
          <div className="text-sm">
            <p>{address.data?.address_line1}</p>
            {address.data?.address_line2 && <p>{address.data.address_line2}</p>}
            <p>
              {[address.data?.district, address.data?.city, address.data?.province]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>{[address.data?.postal_code, address.data?.country].filter(Boolean).join(" ")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
