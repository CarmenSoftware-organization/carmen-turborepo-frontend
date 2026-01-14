import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface Props {
  status: string;
  setStatus: (status: string) => void;
}

export default function SelectPrStatus({ status, setStatus }: Props) {
  const tDataControls = useTranslations("DataControls");
  const tStatus = useTranslations("Status");
  return (
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger className="h-8 text-xs w-[150px]">
        <SelectValue placeholder={tDataControls("allStatus")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{tDataControls("allStatus")}</SelectItem>
        <SelectItem value="draft">{tStatus("draft")}</SelectItem>
        <SelectItem value="pending">{tStatus("pending")}</SelectItem>
        <SelectItem value="approved">{tStatus("approved")}</SelectItem>
        <SelectItem value="rejected">{tStatus("rejected")}</SelectItem>
        <SelectItem value="completed">{tStatus("completed")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
