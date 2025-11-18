import { useEffect, useState } from "react";
import { useWorkflowIdQuery } from "@/hooks/use-workflow";
import { WorkflowCreateModel } from "@/dtos/workflows.dto";

type UseWorkflowDetailProps = {
  token: string | null;
  buCode: string | null;
  id: string;
  authLoading: boolean;
};

type UseWorkflowDetailReturn = {
  data: WorkflowCreateModel | undefined;
  loading: boolean;
  error: Error | null;
  loginDialogOpen: boolean;
  setLoginDialogOpen: (open: boolean) => void;
  refetch: () => void;
};

export const useWorkflowDetail = ({
  token,
  buCode,
  id,
  authLoading,
}: UseWorkflowDetailProps): UseWorkflowDetailReturn => {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useWorkflowIdQuery({
    token: token || "",
    buCode: buCode || "",
    id,
    enabled: !!token && !!buCode && !authLoading,
  });

  useEffect(() => {
    if (error) {
      setLoginDialogOpen(true);
    }
  }, [error]);

  return {
    data: data as WorkflowCreateModel | undefined,
    loading: isLoading,
    error: error instanceof Error ? error : null,
    loginDialogOpen,
    setLoginDialogOpen,
    refetch: () => {
      refetch();
    },
  };
};
