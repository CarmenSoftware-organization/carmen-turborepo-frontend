import { useUserCluster } from "@/app/hooks/useUserCluster";

export default function LookupCluster() {
  const { data, isLoading, error } = useUserCluster();

  return <div>LookupCluster</div>;
}
