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
      {
        label: tStatus("draft"),
        value: "draft",
        badgeClassName: "bg-gray-100 hover:bg-gray-100/80 text-gray-800 border-none font-bold",
      },
      {
        label: tStatus("in_progress"),
        value: "in_progress",
        badgeClassName:
          "bg-yellow-100 hover:bg-yellow-100/80 text-yellow-800 border-none font-bold",
      },
      {
        label: tStatus("approved"),
        value: "approved",
        badgeClassName: "bg-green-100 hover:bg-green-100/80 text-green-800 border-none font-bold",
      },
      {
        label: tStatus("voided"),
        value: "voided",
        badgeClassName: "bg-red-100 hover:bg-red-100/80 text-red-800 border-none font-bold",
      },
      {
        label: tStatus("completed"),
        value: "completed",
        badgeClassName: "bg-blue-100 hover:bg-blue-100/80 text-blue-800 border-none font-bold",
      },
    ],
    [tStatus]
  );

  return (
    <MultiSelect
      options={statusOptions}
      defaultValue={statusArray}
      onValueChange={handleChange}
      placeholder={tDataControls("allStatus")}
      className="w-fit h-8"
      maxCount={2}
    />
  );
}
