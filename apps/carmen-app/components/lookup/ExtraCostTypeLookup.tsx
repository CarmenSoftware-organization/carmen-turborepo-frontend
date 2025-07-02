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
import { ExtraCostTypeDto } from "@/dtos/extra-cost-type.dto";
import { useExtraCostTypeQuery } from "@/hooks/useExtraCostType";

export default function ExtraCostTypeLookup({
  value,
  onValueChange,
  placeholder = "Select extra cost type",
  disabled = false,
}: Readonly<PropsLookup>) {
  const { token, tenantId } = useAuth();

  const { extraCostTypes, isLoading } = useExtraCostTypeQuery(token, tenantId);
  const extraCostTypesData = extraCostTypes?.data;

  if (isLoading) {
    return (
      <div className="relative w-full">
        <Select disabled value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </Select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {extraCostTypesData && extraCostTypesData.length > 0 ? (
          extraCostTypesData?.map((item: ExtraCostTypeDto) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="empty" disabled>
            No credit terms available.
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
