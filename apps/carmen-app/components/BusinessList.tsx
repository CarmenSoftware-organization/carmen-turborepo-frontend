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
      <SelectTrigger className="w-32 xl:w-40 border border-border focus:ring-ring text-[10px] xl:text-xs h-7 xl:h-8 text-muted-foreground">
        <SelectValue placeholder={t("select_bu")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {user.data.business_unit.map((bu) => (
            <SelectItem key={bu.id} value={bu.id} className="text-[10px] xl:text-xs py-1 xl:py-1.5">
              {bu.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
