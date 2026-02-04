"use client";

import { useTranslations } from "next-intl";
import { Check, Mail, Pencil, Phone, Trash2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ContactDto } from "@/dtos/vendor.dto";

export interface ContactRowProps {
  fieldId: string;
  index: number;
  contact: ContactDto;
  onContactChange: (contact: ContactDto) => void;
  isEditing: boolean;
  isViewMode: boolean;
  isDeleting?: boolean;
  onToggleEdit: (fieldId: string) => void;
  onRemove: (fieldId: string, index: number) => void;
  onSetPrimary: (index: number) => void;
  t: ReturnType<typeof useTranslations<"Vendor">>;
}

export default function ContactRow({
  fieldId,
  index,
  contact,
  onContactChange,
  isEditing,
  isViewMode,
  isDeleting,
  onToggleEdit,
  onRemove,
  onSetPrimary,
  t,
}: ContactRowProps) {
  const handleFieldChange = (field: keyof ContactDto, value: string | boolean) => {
    onContactChange({
      ...contact,
      [field]: value,
    });
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border transition-all duration-300",
        contact.is_primary && "border-primary/50 bg-primary/5",
        isEditing && !contact.is_primary && "border-blue-500/50 bg-blue-500/5",
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
          {/* Name */}
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {t("contact_name")} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={contact.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
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
                value={contact.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
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
                value={contact.phone || ""}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder={t("phone")}
                className="h-8 text-xs pl-8"
              />
            </div>
          </div>

          {/* Primary Checkbox */}
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id={`primary-${fieldId}`}
              checked={contact.is_primary || false}
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
          <span className="font-medium">{contact.name || "-"}</span>
          {contact.is_primary && (
            <Badge variant="default" className="text-xs">
              Primary
            </Badge>
          )}
          {contact.email && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {contact.email}
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {contact.phone}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
