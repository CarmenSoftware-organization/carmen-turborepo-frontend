import { useTranslations } from "next-intl";

export const useWorkflowTypeTranslation = () => {
  const t = useTranslations("Workflow");

  const workflowTypeName = (type: string): string => {
    if (type === "General") {
      return t("general");
    }
    return t("market_list");
  };

  return { workflowTypeName };
};
