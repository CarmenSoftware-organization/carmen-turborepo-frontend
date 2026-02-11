"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURL } from "@/hooks/useURL";
import { use, useEffect, useState } from "react";
import WorkflowList from "./WorkflowList";
import { WorkflowTemplates } from "./WorkflowTemplates";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { parseSortString } from "@/utils/table";
import { Link, useRouter } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkflow } from "@/hooks/use-workflow";
import { useAuth } from "@/context/AuthContext";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Plus } from "lucide-react";
import { FieldConfig } from "@/constants/uiConfig";
import { InternalServerError, Unauthorized, Forbidden } from "@/components/error-ui";
import { getApiErrorType } from "@/utils/error";

export default function PurchaseOrderComponent() {
  const { token, buCode } = useAuth();
  const tWf = useTranslations("Workflow");
  const tCommon = useTranslations("Common");
  const [filter, setFilter] = useURL("filter");
  const [statusOpen, setStatusOpen] = useState(false);
  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useWorkflow(token, buCode, {
    search: search || undefined,
    page: page || 1,
    filter: filter || undefined,
    sort: sort || undefined,
    perpage: perpage || 10,
  });

  const workflows = data?.data ?? [];
  const totalPages = data?.paginate?.pages ?? 1;
  const totalItems = data?.paginate?.total ?? 0;

  const refetchWorkflows = () => {
    queryClient.invalidateQueries({
      queryKey: ["workflows"],
      exact: false,
    });
  };

  interface WorkflowListProps {
    id: string;
    name: string;
    stages: number;
    workflow_type: string;
    is_active: string;
  }

  enum WorkflowField {
    name = "name",
    workflow_type = "workflow_type",
    stages = "stages",
    rules = "rules",
    isActive = "is_active",
  }

  const sortFields: FieldConfig<WorkflowListProps>[] = [
    { key: WorkflowField.name, label: tWf("name"), className: "w-40" },
    { key: WorkflowField.workflow_type, label: tWf("type"), className: "w-40" },
    {
      key: WorkflowField.isActive,
      label: tWf("status"),
      type: "badge",
      className: "w-24",
    },
    { key: WorkflowField.stages, label: tWf("stages"), className: "w-24" },
  ];

  useEffect(() => {
    if (search) {
      setPage("");
    }
  }, [search, setPage]);

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const title = tWf("title");
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "workflow";

  if (error) {
    const errorType = getApiErrorType(error);
    if (errorType === "unauthorized") return <Unauthorized />;
    if (errorType === "forbidden") return <Forbidden />;
    return <InternalServerError />;
  }

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" data-id="workflow-list-new-workflow-button">
        <Link
          href="/system-administration/workflow-management/new"
          data-id="workflow-list-new-workflow-button"
        >
          <Plus className="h-4 w-4" />
          {tWf("new_workflow")}
        </Link>
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="user-management-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="workflow-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="workflow-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="workflow-list-sort-dropdown"
        />
      </div>
    </div>
  );

  const content = (
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="workflow">{tWf("workflow")}</TabsTrigger>
        <TabsTrigger value="templates">{tWf("notification_templates")}</TabsTrigger>
      </TabsList>
      <TabsContent value="workflow">
        <WorkflowList
          isLoading={isLoading}
          workflows={workflows}
          currentPage={page ? Number(page) : 1}
          totalPages={totalPages}
          totalItems={totalItems}
          perpage={perpage ? Number(perpage) : 10}
          onPageChange={handlePageChange}
          sort={parseSortString(sort)}
          onSort={setSort}
          setPerpage={handleSetPerpage}
        />
      </TabsContent>
      <TabsContent value="templates">
        <WorkflowTemplates />
      </TabsContent>
    </Tabs>
  );

  return (
    <>
      <DataDisplayTemplate
        title={title}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />
    </>
  );
}
