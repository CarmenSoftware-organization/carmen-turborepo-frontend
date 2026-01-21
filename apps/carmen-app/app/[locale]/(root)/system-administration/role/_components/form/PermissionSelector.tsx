"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Key, Search, ShieldOff, CheckSquare, Square } from "lucide-react";
import { PermissionDto } from "@/dtos/permission.dto";
import { RolePermissionDto } from "@/dtos/role.dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PermissionSelectorProps {
  allPermissions: PermissionDto[];
  initialPermissions: RolePermissionDto[];
  onChange: (payload: { add: string[]; remove: string[] }, totalSelected: number) => void;
  disabled?: boolean;
}

const ACTION_COLUMNS = [
  { key: "view", label: "View", description: "View own records" },
  { key: "view_department", label: "View Dept", description: "View department records" },
  { key: "view_all", label: "View All", description: "View all records" },
  { key: "create", label: "Create", description: "Create new records" },
  { key: "update", label: "Update", description: "Update existing records" },
  { key: "delete", label: "Delete", description: "Delete records" },
  { key: "execute", label: "Execute", description: "Execute actions" },
];

export default function PermissionSelector({
  allPermissions,
  initialPermissions,
  onChange,
  disabled = false,
}: PermissionSelectorProps) {
  const tRole = useTranslations("Role");
  const tCommon = useTranslations("Common");

  const [searchQuery, setSearchQuery] = useState("");

  const initialIdsRef = useRef<Set<string>>(
    new Set(initialPermissions.map((p) => p.permission_id))
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(initialIdsRef.current));

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Calculate changes and call onChange via useEffect
  useEffect(() => {
    const add: string[] = [];
    const remove: string[] = [];

    selectedIds.forEach((id) => {
      if (!initialIdsRef.current.has(id)) {
        add.push(id);
      }
    });

    initialIdsRef.current.forEach((id) => {
      if (!selectedIds.has(id)) {
        remove.push(id);
      }
    });

    onChangeRef.current({ add, remove }, selectedIds.size);
  }, [selectedIds]);

  // Group permissions by resource
  const resourceMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, PermissionDto | null>> = {};

    allPermissions.forEach((permission) => {
      const resource = permission.resource;
      const action = permission.action;

      if (!matrix[resource]) {
        matrix[resource] = {};
      }
      matrix[resource][action] = permission;
    });

    return matrix;
  }, [allPermissions]);

  // Get sorted and filtered resources
  const filteredResources = useMemo(() => {
    const resources = Object.keys(resourceMatrix).sort();
    if (!searchQuery.trim()) return resources;

    const query = searchQuery.toLowerCase();
    return resources.filter((resource) => {
      const formattedName = formatResourceName(resource).toLowerCase();
      return formattedName.includes(query) || resource.toLowerCase().includes(query);
    });
  }, [resourceMatrix, searchQuery]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(allPermissions.map((p) => p.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleSelectFiltered = () => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      filteredResources.forEach((resource) => {
        Object.values(resourceMatrix[resource] || {}).forEach((permission) => {
          if (permission) newSet.add(permission.id);
        });
      });
      return newSet;
    });
  };

  const handleDeselectFiltered = () => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      filteredResources.forEach((resource) => {
        Object.values(resourceMatrix[resource] || {}).forEach((permission) => {
          if (permission) newSet.delete(permission.id);
        });
      });
      return newSet;
    });
  };

  const handleToggleRow = (resource: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      const rowPermissions = Object.values(resourceMatrix[resource] || {}).filter(
        (p): p is PermissionDto => p !== null
      );
      const allSelected = rowPermissions.every((p) => prev.has(p.id));

      if (allSelected) {
        rowPermissions.forEach((p) => newSet.delete(p.id));
      } else {
        rowPermissions.forEach((p) => newSet.add(p.id));
      }
      return newSet;
    });
  };

  const handleToggleColumn = (actionKey: string) => {
    const columnPermissions = filteredResources
      .map((resource) => resourceMatrix[resource]?.[actionKey])
      .filter((p): p is PermissionDto => p != null);

    const allSelected = columnPermissions.every((p) => selectedIds.has(p.id));

    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        columnPermissions.forEach((p) => newSet.delete(p.id));
      } else {
        columnPermissions.forEach((p) => newSet.add(p.id));
      }
      return newSet;
    });
  };

  const isColumnFullySelected = (actionKey: string) => {
    const columnPermissions = filteredResources
      .map((resource) => resourceMatrix[resource]?.[actionKey])
      .filter((p): p is PermissionDto => p != null);
    return columnPermissions.length > 0 && columnPermissions.every((p) => selectedIds.has(p.id));
  };

  const isColumnPartiallySelected = (actionKey: string) => {
    const columnPermissions = filteredResources
      .map((resource) => resourceMatrix[resource]?.[actionKey])
      .filter((p): p is PermissionDto => p != null);
    const selectedCount = columnPermissions.filter((p) => selectedIds.has(p.id)).length;
    return selectedCount > 0 && selectedCount < columnPermissions.length;
  };

  const isRowFullySelected = (resource: string) => {
    const rowPermissions = Object.values(resourceMatrix[resource] || {}).filter(
      (p): p is PermissionDto => p !== null
    );
    return rowPermissions.length > 0 && rowPermissions.every((p) => selectedIds.has(p.id));
  };

  const isRowPartiallySelected = (resource: string) => {
    const rowPermissions = Object.values(resourceMatrix[resource] || {}).filter(
      (p): p is PermissionDto => p !== null
    );
    const selectedCount = rowPermissions.filter((p) => selectedIds.has(p.id)).length;
    return selectedCount > 0 && selectedCount < rowPermissions.length;
  };

  const totalResources = Object.keys(resourceMatrix).length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  {tRole("permissions")}
                </h2>
                <Badge variant="secondary" className="font-mono">
                  {selectedIds.size}/{allPermissions.length}
                </Badge>
              </div>
              <CardDescription className="mt-1">{tRole("permissions_description")}</CardDescription>
            </div>
          </div>
          {!disabled && (
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={searchQuery ? handleSelectFiltered : handleSelectAll}
                      className="gap-1.5"
                    >
                      <CheckSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">{tCommon("select_all")}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {searchQuery ? tCommon("select_filtered") : tCommon("select_all")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={searchQuery ? handleDeselectFiltered : handleDeselectAll}
                      className="gap-1.5"
                    >
                      <Square className="h-4 w-4" />
                      <span className="hidden sm:inline">{tCommon("un_select_all")}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {searchQuery ? tCommon("deselect_filtered") : tCommon("un_select_all")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={tRole("search_permissions")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Badge variant="outline" className="text-xs">
                {filteredResources.length}/{totalResources}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[200px] sm:min-w-[250px]">
                  {tRole("resource")}
                </TableHead>
                {ACTION_COLUMNS.map((action) => (
                  <TableHead key={action.key} className="text-center w-20 sm:w-24">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => !disabled && handleToggleColumn(action.key)}
                            disabled={disabled}
                            className={cn(
                              "text-xs font-medium transition-colors p-1 rounded",
                              disabled
                                ? "cursor-default text-muted-foreground"
                                : "cursor-pointer hover:text-primary",
                              !disabled && isColumnFullySelected(action.key) && "text-primary"
                            )}
                          >
                            {action.label}
                            {!disabled && isColumnPartiallySelected(action.key) && (
                              <span className="ml-0.5 text-primary">•</span>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{action.description}</p>
                          {!disabled && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {tCommon("click_to_toggle")}
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow
                  key={resource}
                  className={cn(
                    "transition-colors",
                    isRowFullySelected(resource) && "bg-primary/5"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`row-${resource}`}
                        checked={
                          isRowFullySelected(resource)
                            ? true
                            : isRowPartiallySelected(resource)
                              ? "indeterminate"
                              : false
                        }
                        onCheckedChange={() => handleToggleRow(resource)}
                        aria-label={`Select all permissions for ${formatResourceName(resource)}`}
                        disabled={disabled}
                      />
                      <label
                        htmlFor={`row-${resource}`}
                        className={cn(
                          "text-xs sm:text-sm select-none",
                          disabled ? "cursor-default text-muted-foreground" : "cursor-pointer"
                        )}
                      >
                        {formatResourceName(resource)}
                      </label>
                    </div>
                  </TableCell>
                  {ACTION_COLUMNS.map((action) => {
                    const permission = resourceMatrix[resource]?.[action.key];
                    const checkboxId = permission ? `perm-${permission.id}` : undefined;
                    return (
                      <TableCell key={action.key} className="text-center">
                        {permission ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="inline-flex">
                                  <Checkbox
                                    id={checkboxId}
                                    checked={selectedIds.has(permission.id)}
                                    onCheckedChange={() => handleTogglePermission(permission.id)}
                                    aria-label={`${action.label} permission for ${formatResourceName(resource)}`}
                                    disabled={disabled}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">{formatResourceName(resource)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {action.description}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-muted-foreground/50" aria-hidden="true">
                            —
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}

              {filteredResources.length === 0 && (
                <TableRow>
                  <TableCell colSpan={ACTION_COLUMNS.length + 1} className="h-32">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                        <ShieldOff className="h-6 w-6 text-muted-foreground" />
                      </div>
                      {searchQuery ? (
                        <>
                          <p className="font-medium text-foreground">
                            {tRole("no_permissions_found")}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tRole("try_different_search")}
                          </p>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={() => setSearchQuery("")}
                            className="mt-2"
                          >
                            {tCommon("clear_search")}
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-foreground">{tRole("no_permissions")}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tRole("no_permissions_available")}
                          </p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function formatResourceName(resource: string) {
  const parts = resource.split(".");
  const lastPart = parts[parts.length - 1];
  return lastPart
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
