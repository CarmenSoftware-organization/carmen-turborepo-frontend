'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { mockRolePermissions, Role, RolePermissions } from './mock-config';

export default function PermissionConfigPlayground() {
    const [selectedRole, setSelectedRole] = useState<Role>('admin');
    const [editablePermissions, setEditablePermissions] = useState<RolePermissions>(mockRolePermissions[selectedRole]);

    // All possible actions
    const allActions = ['view_all', 'view_dp', 'view', 'create', 'update', 'delete', 'submit', 'approve', 'reject', 'send_back'];

    // Update permissions when role changes
    const handleRoleChange = (role: Role) => {
        setSelectedRole(role);
        setEditablePermissions(mockRolePermissions[role]);
    };

    // Toggle permission action
    const togglePermission = (module: keyof RolePermissions, resource: string, action: string) => {
        setEditablePermissions(prev => {
            const modulePerms = { ...prev[module] } as Record<string, string[]>;
            const resourcePerms = (modulePerms[resource] || []) as string[];

            const hasPermission = resourcePerms.includes(action);
            const updatedPerms = hasPermission
                ? resourcePerms.filter((a: string) => a !== action)
                : [...resourcePerms, action];

            return {
                ...prev,
                [module]: {
                    ...modulePerms,
                    [resource]: updatedPerms
                }
            };
        });
    };

    // Helper function to check if action exists
    const hasAction = (actions: string[], action: string) => actions.includes(action);

    // Get all resources from all modules
    const getAllResources = () => {
        const resources: { module: keyof RolePermissions; moduleName: string; resource: string; actions: string[] }[] = [];

        Object.entries(editablePermissions.configuration).forEach(([resource, actions]) => {
            resources.push({ module: 'configuration', moduleName: '⚙️ Configuration', resource, actions });
        });
        Object.entries(editablePermissions.product_management).forEach(([resource, actions]) => {
            resources.push({ module: 'product_management', moduleName: '📦 Product Management', resource, actions });
        });
        Object.entries(editablePermissions.vendor_management).forEach(([resource, actions]) => {
            resources.push({ module: 'vendor_management', moduleName: '🏢 Vendor Management', resource, actions });
        });
        Object.entries(editablePermissions.procurement).forEach(([resource, actions]) => {
            resources.push({ module: 'procurement', moduleName: '🛒 Procurement', resource, actions });
        });
        Object.entries(editablePermissions.inventory_management).forEach(([resource, actions]) => {
            resources.push({ module: 'inventory_management', moduleName: '📊 Inventory Management', resource, actions });
        });
        Object.entries(editablePermissions.finance).forEach(([resource, actions]) => {
            resources.push({ module: 'finance', moduleName: '💰 Finance', resource, actions });
        });

        return resources;
    };

    const resources = getAllResources();

    return (
        <div className="container">
            <Card>
                <CardContent>
                    <div className="flex gap-4 items-end mt-2 mb-4">
                        <div className="space-y-2 flex-1">
                            <Select value={selectedRole} onValueChange={(value) => handleRoleChange(value as Role)}>
                                <SelectTrigger id="role" className="w-64">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">👑 Admin (Full Access)</SelectItem>
                                    <SelectItem value="leader">👔 Leader (Department Manager)</SelectItem>
                                    <SelectItem value="requestor">👤 Requestor (Basic User)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Module</TableHead>
                                    <TableHead className="w-[200px]">Resource</TableHead>
                                    {allActions.map((action) => (
                                        <TableHead key={action} className="text-center text-xs">
                                            {action.replace(/_/g, ' ')}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resources.map(({ module, moduleName, resource, actions }) => (
                                    <TableRow key={`${module}-${resource}`}>
                                        <TableCell className="font-medium text-sm">{moduleName}</TableCell>
                                        <TableCell className="text-sm capitalize">
                                            {resource.replace(/_/g, ' ')}
                                        </TableCell>
                                        {allActions.map((action) => (
                                            <TableCell key={action} className="text-center">
                                                <Checkbox
                                                    checked={hasAction(actions, action)}
                                                    onCheckedChange={() => togglePermission(module, resource, action)}
                                                    className="mx-auto"
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* JSON Preview */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">📋 JSON Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="p-4 bg-muted/50 rounded-lg overflow-auto text-xs">
                                {JSON.stringify(editablePermissions, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                </CardContent>

            </Card>
        </div>
    );
}
