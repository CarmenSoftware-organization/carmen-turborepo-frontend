import { useQuery } from "@tanstack/react-query";
import { backendApi } from "@/lib/backend-api";
import { ParamsGetDto } from "@/dtos/param.dto";
import { getAllApiRequest } from "@/lib/config.api";

const cnReasonApiUrl = (buCode: string, id?: string) => {
  const baseUrl = `${backendApi}/api/config/${buCode}/credit-note-reason`;
  return id ? `${baseUrl}/${id}` : `${baseUrl}/`;
};

export const useCnReasonQuery = ({
  token,
  buCode,
  params,
}: {
  token: string;
  buCode: string;
  params?: ParamsGetDto;
}) => {

  const API_URL = cnReasonApiUrl(buCode);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cn-reason", buCode, params],
    queryFn: async () => {
      if (!token || !buCode) throw new Error("Unauthorized");
      return await getAllApiRequest(
        API_URL,
        token,
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
