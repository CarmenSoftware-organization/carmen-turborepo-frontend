import { MultiSelect } from "@/components/ui/multi-select";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface Props {
  status: string; // comma-separated string from URL params
  setStatus: (status: string) => void;
}

export default function SelectPrStatus({ status, setStatus }: Props) {
  const tDataControls = useTranslations("DataControls");
  const tStatus = useTranslations("Status");

  // แปลง string เป็น array (split by comma)
  const statusArray = useMemo(() => {
    if (!status) return [];
    return status.split(",").filter(Boolean);
  }, [status]);

  // แปลง array กลับเป็น string (join by comma)
  const handleChange = (values: string[]) => {
    setStatus(values.join(","));
  };

  const statusOptions = useMemo(
    () => [
      { label: tStatus("draft"), value: "draft" },
      { label: tStatus("pending"), value: "pending" },
      { label: tStatus("approved"), value: "approved" },
      { label: tStatus("rejected"), value: "rejected" },
      { label: tStatus("completed"), value: "completed" },
    ],
    [tStatus]
  );

  return (
    <MultiSelect
      options={statusOptions}
      defaultValue={statusArray}
      onValueChange={handleChange}
      placeholder={tDataControls("allStatus")}
      className="h-8 text-xs min-w-[150px] w-fit"
      maxCount={2}
    />
  );
}
