import { useCallback, useState, useEffect } from "react";
import { useURL } from "@/hooks/useURL";
import { getWorkflowList } from "@/services/workflow";
import { useAuth } from "@/context/AuthContext";
import { toastError } from "@/components/ui-custom/Toast";
import { WorkflowData, AvailableActions } from "@/dtos/workflows.dto";

interface WorkflowListProps {
  id: string;
  name: string;
  workflow_type: string;
  data: WorkflowData;
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

  // Get the entire workflow configuration
  const getWorkflowConfig = (workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    return workflow;
  };

  // Get Stages
  const getStages = (workflowId: string) => {
    const workflow = getWorkflowConfig(workflowId);
    return workflow?.data.stages;
  };

  // Get a specific stage by name
  const getCurrentStage = (workflowId: string, stageName: string) => {
    const workflow = getWorkflowConfig(workflowId);
    const stage = workflow?.data.stages.find((s) => s.name === stageName);
    return stage;
  };

  // Check if a button is active in a specific stage
  const isButtonActive = (workflowId: string, stageName: string, buttonType: keyof AvailableActions) => {
    const stage = getCurrentStage(workflowId, stageName);

    if (!stage) {
      return false;
    }

    return stage.available_actions[buttonType].is_active;
  };

  // Enable or disable a button in a specific stage
  const setButtonActive = (
    workflowId: string,
    stageName: string,
    buttonType: keyof AvailableActions,
    isActive: boolean
  ) => {
    const stage = getCurrentStage(workflowId, stageName);
    if (!stage) {
      return false;
    }
    stage.available_actions[buttonType].is_active = isActive;
    return true;
  };

  // Get the next stage based on conditions and item value

  // ใส่ any itemValue ไว้ให้ build ผ่านก่อนนะ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNextStage = (workflowId: string, stageName: string, itemValue: any) => {
    const workflow = getWorkflowConfig(workflowId);
    const otherStage = workflow?.data.stages.find((s) => s.name !== stageName);
    const routingRules = workflow?.data.routing_rules;
    if (!routingRules) {
      // If there are no routing rules, return the other stage
      return otherStage?.name;
    }
    const matchingRule = routingRules.find((rule) => {
      if (rule.trigger_stage === stageName) {
        const condition = rule.condition;
        if (!condition) {
          // If there is no condition, return the other stage
          return otherStage?.name;
        }
        const { operator, value } = condition;
        if (operator === "eq") {
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        }
        if (operator === "gt") {
          if (Array.isArray(value)) {
            // If value is an array, compare itemValue to each element and return true if any comparison is true
            return value.some((v) => itemValue > v);
          }
        }
        if (operator === "lt") {
          if (Array.isArray(value)) {
            // If value is an array, compare itemValue to each element and return true if any comparison is true
            return value.some((v) => itemValue < v);
          }
        }
      }
      // If there is no matching rule, return the other stage
      return otherStage?.name;
    });
    if (!matchingRule) {
      return otherStage?.name;
    }
    return matchingRule.action.parameters.target_stage;
  };

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

    // Getters
    getWorkflowConfig,
    getStages,
    getCurrentStage,
    getNextStage,
    isButtonActive,
    setButtonActive,
  };
};
