"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export default function BusinessList() {
  const t = useTranslations("HomePage");
  const { user, buId, handleChangeBu, isLoading } = useAuth();

  if (isLoading || !user?.data.business_unit?.length) {
    return null;
  }

  return (
    <Select value={buId || undefined} onValueChange={handleChangeBu}>
      <SelectTrigger className="w-40 border border-border focus:ring-ring text-xs h-8 text-muted-foreground">
        <SelectValue placeholder={t("select_bu")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {user.data.business_unit.map((bu) => (
            <SelectItem key={bu.id} value={bu.id}>
              {bu.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
