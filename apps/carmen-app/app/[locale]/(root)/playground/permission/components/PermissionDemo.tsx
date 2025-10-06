"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { hasPermission, filterDocumentsByPermission, getModulePermissions } from "../utils/permission-checker";
import { usersPermissionTest } from "../permission-module";
import type { BaseDocument, PermissionAction } from "../types/permission.types";

interface ActionButton {
    label: string;
    permission: PermissionAction;
    variant?: "default" | "outline" | "destructive";
    onClick: (doc: BaseDocument) => void;
}

interface PermissionDemoProps<T extends BaseDocument> {
    title: string;
    createButtonLabel: string;
    module: string;
    submodule: string;
    documents: T[];
    actionButtons: ActionButton[];
    renderDocumentDetails?: (doc: T) => React.ReactNode;
    getStatusVariant?: (status: string) => "default" | "success" | "destructive" | "warning";
}

export function PermissionDemo<T extends BaseDocument>({
    title,
    createButtonLabel,
    module,
    submodule,
    documents,
    actionButtons,
    renderDocumentDetails,
    getStatusVariant,
}: PermissionDemoProps<T>) {
    const [selectedUserId, setSelectedUserId] = useState<string>("1");
    const [selectedDoc, setSelectedDoc] = useState<T | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const selectedUser = usersPermissionTest.find((u) => u.id === selectedUserId);

    const handleCardClick = (doc: T) => {
        setSelectedDoc(doc);
        setIsDialogOpen(true);
    };

    // ใช้ pure functions แทน hook
    const visibleDocs = filterDocumentsByPermission(
        documents,
        selectedUser,
        module,
        submodule,
        selectedUserId
    );

    const canCreate = hasPermission(selectedUser, module, submodule, "create");

    const getPermissionsList = () => {
        const permissions = getModulePermissions(selectedUser, module, submodule);
        return permissions.join(", ");
    };

    const defaultStatusVariant = (status: string) => {
        if (status === "approved" || status === "active") return "success";
        if (status === "rejected" || status === "inactive") return "destructive";
        return "warning";
    };

    const statusVariant = getStatusVariant || defaultStatusVariant;

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">{title}</h1>

            <div className="space-y-2">
                <Label htmlFor="user-select">Select User</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger id="user-select" className="w-[300px]">
                        <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                        {usersPermissionTest.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.role})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedUser && (
                <Card>
                    <CardHeader>
                        <CardTitle>Current User: {selectedUser.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>Role: {selectedUser.role}</p>
                        <p>Permissions: {getPermissionsList()}</p>
                        <p>Can see: {visibleDocs.length} of {documents.length} documents</p>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                <Button disabled={!canCreate}>
                    {createButtonLabel}
                </Button>

                {visibleDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {visibleDocs.map((doc) => (
                            <Card
                                key={doc.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleCardClick(doc)}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                                        <Badge variant={statusVariant(doc.status)}>
                                            {doc.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No documents visible with current permissions.</p>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedDoc?.title}</DialogTitle>
                    </DialogHeader>
                    {selectedDoc && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-semibold">ID</p>
                                    <p className="text-sm">{selectedDoc.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Status</p>
                                    <Badge variant={statusVariant(selectedDoc.status)}>
                                        {selectedDoc.status.toUpperCase()}
                                    </Badge>
                                </div>
                                {selectedDoc.ownerId && (
                                    <div>
                                        <p className="text-sm font-semibold">Owner</p>
                                        <p className="text-sm">{selectedDoc.ownerId}</p>
                                    </div>
                                )}
                                {renderDocumentDetails && renderDocumentDetails(selectedDoc)}
                            </div>

                            <div className="flex flex-wrap gap-2 justify-end">
                                {actionButtons.map((button) => {
                                    const hasActionPermission = hasPermission(
                                        selectedUser,
                                        module,
                                        submodule,
                                        button.permission
                                    );
                                    if (!hasActionPermission) return null;

                                    return (
                                        <Button
                                            key={button.label}
                                            variant={button.variant || "outline"}
                                            onClick={() => button.onClick(selectedDoc)}
                                        >
                                            {button.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
