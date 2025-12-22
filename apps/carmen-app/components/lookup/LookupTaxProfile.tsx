"use client";

import { PropsLookup } from "@/dtos/lookup.dto";
import { useAuth } from "@/context/AuthContext";
import { useTaxProfileQuery } from "@/hooks/use-tax-profile";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaxProfileGetAllDto } from "@/dtos/tax-profile.dto";
import { cn } from "@/lib/utils";

interface TaxProfileLookupProps extends PropsLookup {
  readonly onSelectObject?: (obj: TaxProfileGetAllDto) => void;
}

export default function LookupTaxProfile({
  value,
  onValueChange,
  disabled = false,
  classNames,
  onSelectObject,
}: Readonly<TaxProfileLookupProps>) {
  const { token, buCode } = useAuth();
  const tTaxProfile = useTranslations("TaxProfile");
  const { taxProfiles: taxProfileData, isLoading } = useTaxProfileQuery(token, buCode, {
    perpage: -1,
  });

  const taxProfiles = useMemo(() => {
    return (taxProfileData?.data || []) as TaxProfileGetAllDto[];
  }, [taxProfileData]);

  return (
    <Select
      value={value || ""}
      onValueChange={(val) => {
        onValueChange(val);
        if (onSelectObject) {
          const selected = taxProfiles.find((t) => t.id === val);
          if (selected) {
            onSelectObject(selected);
          }
        }
      }}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className={cn("w-full", classNames)}>
        <SelectValue placeholder={tTaxProfile("select_tax_profile")} />
      </SelectTrigger>
      <SelectContent>
        {taxProfiles.map((tax) => (
          <SelectItem key={tax.id} value={tax.id} className="text-xs">
            {tax.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
