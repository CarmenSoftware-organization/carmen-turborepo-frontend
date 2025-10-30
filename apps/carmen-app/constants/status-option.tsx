import { useTranslations } from "next-intl";

export const useBoolFilterOptions = () => {
  const tCommon = useTranslations("Common");
  return [
    { label: tCommon("all"), value: "" },
    { label: tCommon("active"), value: "is_active|bool:true" },
    { label: tCommon("inactive"), value: "is_active|bool:false" },
  ];
};
