"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Key } from "lucide-react";
import { PermissionDto } from "@/dtos/permission.dto";
import { RolePermissionDto } from "@/dtos/role.dto";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PermissionSelectorProps {
  allPermissions: PermissionDto[];
  initialPermissions: RolePermissionDto[];
  onChange: (payload: { add: string[]; remove: string[] }) => void;
}

const ACTION_COLUMNS = [
  "view",
  "view_department",
  "view_all",
  "create",
  "update",
  "delete",
  "execute",
];

export default function PermissionSelector({
  allPermissions,
  initialPermissions,
  onChange,
}: PermissionSelectorProps) {
  const tRole = useTranslations("Role");
  const tCommon = useTranslations("Common");

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

    onChangeRef.current({ add, remove });
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

  // Get sorted resources
  const sortedResources = useMemo(() => {
    return Object.keys(resourceMatrix).sort();
  }, [resourceMatrix]);

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

  const formatResourceName = (resource: string) => {
    const parts = resource.split(".");
    const lastPart = parts[parts.length - 1];
    return lastPart
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isRowFullySelected = (resource: string) => {
    const rowPermissions = Object.values(resourceMatrix[resource] || {}).filter(
      (p): p is PermissionDto => p !== null
    );
    return rowPermissions.length > 0 && rowPermissions.every((p) => selectedIds.has(p.id));
  };

  const formatActionName = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Key className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              {tRole("permissions")}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="link" size="sm" onClick={handleSelectAll}>
              {tCommon("select_all")}
            </Button>
            <Button type="button" variant="link" size="sm" onClick={handleDeselectAll}>
              {tCommon("un_select_all")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="min-w-[250px]">Resource</TableHead>
              {ACTION_COLUMNS.map((action) => (
                <TableHead key={action} className="text-center w-24">
                  <span className="text-xs">{formatActionName(action)}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResources.map((resource) => (
              <TableRow key={resource}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isRowFullySelected(resource)}
                      onCheckedChange={() => handleToggleRow(resource)}
                    />
                    <span className="text-xs">{formatResourceName(resource)}</span>
                  </div>
                </TableCell>
                {ACTION_COLUMNS.map((action) => {
                  const permission = resourceMatrix[resource]?.[action];
                  return (
                    <TableCell key={action} className="text-center">
                      {permission ? (
                        <Checkbox
                          checked={selectedIds.has(permission.id)}
                          onCheckedChange={() => handleTogglePermission(permission.id)}
                        />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}

            {sortedResources.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={ACTION_COLUMNS.length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  {tRole("no_permissions")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
