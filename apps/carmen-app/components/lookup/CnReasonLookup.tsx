import { PropsLookup } from "@/dtos/lookup.dto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCnReasonQuery } from "@/hooks/useCnReason";

export default function CnReasonLookup({
  value,
  onValueChange,
  placeholder = "Select cn reason",
  disabled = false,
}: Readonly<PropsLookup>) {
  const { token, tenantId } = useAuth();

  const { cnReasons, isLoading } = useCnReasonQuery({
    token,
    tenantId,
  });

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </SelectItem>
        ) : cnReasons.length === 0 ? (
          <SelectItem value="empty" disabled>
            ไม่มีข้อมูล
          </SelectItem>
        ) : (
          cnReasons.map((cnReason: any) => (
            <SelectItem key={cnReason.id} value={cnReason.id}>
              {cnReason.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
