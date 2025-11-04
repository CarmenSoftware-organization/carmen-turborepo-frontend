import { useCluster } from "@/app/hooks/useCluster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GetClusterDto } from "@/dto/cluster.dto";

interface LookupClusterProps {
  readonly value?: string;
  readonly onValueChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly placeholder?: string;
}

export default function LookupCluster({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select a cluster",
}: LookupClusterProps) {
  const { data: clusterData, isLoading } = useCluster();

  const clusters = clusterData?.data || [];

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {clusters.map((cluster: GetClusterDto) => (
          <SelectItem key={cluster.id} value={cluster.id}>
            {cluster.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
