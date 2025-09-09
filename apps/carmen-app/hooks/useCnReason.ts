import { useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { getAllApiRequest } from "@/lib/config.api";

const API_URL = `${backendApi}/api/credit-note-reason`;

export const useCnReasonQuery = ({
  token,
  buCode,
  params,
}: {
  token: string;
  buCode: string;
  params?: ParamsGetDto;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cn-reason", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return await getAllApiRequest(
        API_URL,
        token,
        buCode,
        "Error fetching cn reason",
        params
      );
    },
    enabled: !!token && !!buCode,
  });

  const cnReasons = data?.data ?? [];

  const getCnReasonName = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const found = cnReasons?.find((cnReason: any) => cnReason.id === id);
    return found?.name ?? null;
  };

  return { cnReasons, getCnReasonName, isLoading, error };
};
