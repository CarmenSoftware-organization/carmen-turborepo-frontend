"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Eye, PlusCircle } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import { FieldConfig } from "@/constants/uiConfig";
import { Badge } from "@/components/ui/badge";
import { useWorkflow } from "@/hooks/use-workflow";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import PaginationComponent from "@/components/PaginationComponent";
import { useTranslations } from "next-intl";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { useAuth } from "@/context/AuthContext";
import { useURL } from "@/hooks/useURL";

interface WorkflowListProps {
  id: string;
  name: string;
  stages: number;
  rules: number;
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
  { key: WorkflowField.name, label: `Name`, className: "w-40" },
  { key: WorkflowField.workflow_type, label: `Type`, className: "w-40" },
  {
    key: WorkflowField.isActive,
    label: `Status`,
    type: "badge",
    className: "w-24",
  },
  { key: WorkflowField.stages, label: `Stages`, className: "w-24" },
  { key: WorkflowField.rules, label: `Rules`, className: "w-24" },
  // {
  // 	key: WorkflowField.lastModified,
  // 	label: `Last Modified`,
  // 	className: "w-40",
  // },
];

const fields: FieldConfig<WorkflowListProps>[] = [...sortFields];

const renderFieldValue = (field: FieldConfig<WorkflowListProps>, wf: WorkflowListProps) => {
  if (field.render) {
    return field.render(wf[field.key], wf);
  }

  const value = wf[field.key];
  switch (field.type) {
    case "badge":
      if (typeof value === "boolean") {
        return (
          <Badge variant={value ? "default" : "destructive"}>{value ? `Active` : `Inactive`}</Badge>
        );
      }
      return <Badge>{String(value)}</Badge>;
    default:
      return <span className={`text-xs ${field.className || ""}`}>{String(value)}</span>;
  }
};

const WorkflowList = () => {
  const { token, buCode, permissions } = useAuth();
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");
  const [statusOpen, setStatusOpen] = useState(false);
  const tCommon = useTranslations("Common");
  const { data, isLoading } = useWorkflow(token, buCode, {
    search,
    filter,
    sort,
    page: page ? Number(page) : 1,
    perpage: perpage ? Number(perpage) : 10,
  });

  const workflows = Array.isArray(data) ? data : data?.data || [];
  const totalPages = data?.paginate?.pages ?? 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handlePerpageChange = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" data-id="workflow-list-new-workflow-button">
        <Link
          href="/system-administration/workflow-management/new"
          data-id="workflow-list-new-workflow-button"
        >
          <PlusCircle className="h-4 w-4" />
          New Workflow
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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            {fields.map((field) => (
              <TableHead
                key={field.key as string}
                className={`text-xs ${field.className || ""}`}
                style={{ width: field.width }}
                align={field.align}
              >
                {field.label}
              </TableHead>
            ))}
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableBodySkeleton rows={fields.length} />
        ) : (
          <TableBody>
            {data &&
              workflows.map((w: WorkflowListProps, index: number) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium text-xs">{index + 1}</TableCell>
                  {fields.map((field) => (
                    <TableCell
                      key={field.key as string}
                      className={`text-xs ${field.className || ""}`}
                      align={field.align}
                    >
                      {renderFieldValue(field, w)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      aria-label={`View workflow ${w.id} details`}
                    >
                      <Link href={`/system-administration/workflow-management/${w.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        )}
      </Table>
      <PaginationComponent
        currentPage={+page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        perpage={10}
      />
    </>
  );

  return (
    <>
      <DataDisplayTemplate
        title="Workflow"
        actionButtons={actionButtons}
        filters={filters}
        content={content}
        data-id="workflow-list-data-display-template"
      />
    </>
  );
};

export default WorkflowList;
