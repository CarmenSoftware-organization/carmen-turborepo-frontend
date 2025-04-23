import { useCallback, useState, useEffect } from "react";
import { useURL } from "@/hooks/useURL";
import { getWorkflowList } from "@/services/workflow";
import { useAuth } from "@/context/AuthContext";
import { toastError } from "@/components/ui-custom/Toast";

interface WorkflowListProps {
  id: string;
  name: string;
  workflow_type: string;
  is_active: string;
}

export const useWorkflow = () => {
  const { token, tenantId } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowListProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [statusOpen, setStatusOpen] = useState(false);
  const [page, setPage] = useURL("page");
  const [sort, setSort] = useURL("sort");
  const [totalPages, setTotalPages] = useState(1);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    if (search) {
      setPage("");
      setSort("");
    }
  }, [search, setPage, setSort]);

  const fetchData = useCallback(async () => {
    if (!tenantId) return;
    try {
      setIsLoading(true);
      const data = await getWorkflowList(token, tenantId, {
        search,
        page,
        sort,
        filter,
      });
      if (data.statusCode === 401) {
        setLoginDialogOpen(true);
        return;
      }
      setWorkflows(data.data);
      setTotalPages(data.paginate.pages);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      toastError({ message: "Error fetching workflows" });
    } finally {
      setIsLoading(false);
    }
  }, [token, tenantId, search, page, sort, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage.toString());
    },
    [setPage]
  );

  const handleSetSort = useCallback(
    (sortValue: string) => {
      setSort(sortValue);
    },
    [setSort]
  );

  const handleSetFilter = useCallback(
    (filterValue: string) => {
      setFilter(filterValue);
      setPage("");
    },
    [setFilter, setPage]
  );

  return {
    workflows,
    isLoading,
    statusOpen,
    setStatusOpen,
    search,
    setSearch,
    filter,
    setFilter,
    page,
    sort,
    setSort,
    totalPages,
    loginDialogOpen,
    setLoginDialogOpen,

    // Status helper
    handleSetFilter,

    // Sort helper
    handleSetSort,

    // Functions
    handlePageChange,
  };
};
