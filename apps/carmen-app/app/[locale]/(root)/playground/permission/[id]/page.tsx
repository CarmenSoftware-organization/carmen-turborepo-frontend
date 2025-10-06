"use client";

import { useParams, useRouter } from "next/navigation";
import { usersPermissionTest, DocData, DocumentDto } from "../permissionData";
import { getUserPermissions, canPerformAction } from "../permissionUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Eye,
    Edit,
    Trash2,
    Plus,
    FileText,
    Shield,
    Crown,
    User as UserIcon,
    AlertCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

export default function UserPermissionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const user = usersPermissionTest.find(u => u.id === userId);
    const [documents, setDocuments] = useState(DocData);

    if (!user) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>User not found</AlertDescription>
                </Alert>
            </div>
        );
    }

    // Permission checks using reusable functions
    const permissions = getUserPermissions(user.id);
    const canView = permissions?.canView || false;
    const canViewAll = permissions?.canViewAll || false;
    const canCreate = permissions?.canCreate || false;


    // Document access checks using reusable functions
    const canViewDocument = (doc: DocumentDto) => {
        return canPerformAction(user, 'view', doc.ownerId);
    };

    const canEditDocument = (doc: DocumentDto) => {
        return canPerformAction(user, 'edit', doc.ownerId);
    };

    const canDeleteDocument = (doc: DocumentDto) => {
        return canPerformAction(user, 'delete', doc.ownerId);
    };

    // Actions
    const handleView = (doc: DocumentDto) => {
        if (canViewDocument(doc)) {
            toast.success(`Viewed: ${doc.title}`);
        } else {
            toast.error(`ไม่มีสิทธิ์เข้าถึง: ไม่สามารถดู ${doc.title} ได้`);
        }
    };

    const handleCreate = () => {
        if (canCreate) {
            const newDoc = {
                id: `doc${documents.length + 1}`,
                title: `New Document ${documents.length + 1}`,
                ownerId: user.id
            };
            setDocuments([...documents, newDoc]);
            toast.success(`Created: ${newDoc.title}`);
        } else {
            toast.error("ไม่มีสิทธิ์เข้าถึง: ไม่สามารถสร้างเอกสารได้");
        }
    };

    const handleEdit = (doc: DocumentDto) => {
        if (canEditDocument(doc)) {
            toast.success(`Edited: ${doc.title}`);
        } else {
            toast.error(`ไม่มีสิทธิ์เข้าถึง: ไม่สามารถแก้ไข ${doc.title} ได้`);
        }
    };

    const handleDelete = (doc: DocumentDto) => {
        if (canDeleteDocument(doc)) {
            setDocuments(documents.filter(d => d.id !== doc.id));
            toast.success(`Deleted: ${doc.title}`);
        } else {
            toast.error(`ไม่มีสิทธิ์เข้าถึง: ไม่สามารถลบ ${doc.title} ได้`);
        }
    };

    const getOwnerName = (ownerId: string) => {
        return usersPermissionTest.find(u => u.id === ownerId)?.name || "Unknown";
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <div className="flex items-start justify-between">
                    <p className="text-muted-foreground capitalize">
                        Role: {user.role}
                    </p>
                    <Button
                        onClick={handleCreate}
                        disabled={!canCreate}
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Document
                    </Button>
                </div>
            </div>

            {/* Permissions Card */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        User Permissions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {user.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {user.permissions.map(permission => (
                                <Badge key={permission} variant="secondary" className="text-sm">
                                    {permission}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <Badge variant="destructive">No Permissions</Badge>
                    )}
                </CardContent>
            </Card>

            <Separator className="my-6" />

            {/* Documents List */}
            <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    {canViewAll ? `เอกสารทั้งหมด (${documents.filter(doc => canViewDocument(doc)).length})` : `เอกสารของฉัน (${documents.filter(doc => canViewDocument(doc)).length})`}
                </h2>

                {!canView ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No View Permission</AlertTitle>
                        <AlertDescription>
                            User {user.name} does not have permission to view any documents.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="grid gap-4">
                        {documents.filter(doc => canViewDocument(doc)).map(doc => {
                            const isOwner = doc.ownerId === user.id;
                            const canSeeThisDoc = canViewDocument(doc);
                            const canEditThisDoc = canEditDocument(doc);
                            const canDeleteThisDoc = canDeleteDocument(doc);

                            return (
                                <Card
                                    key={doc.id}
                                    className={`${!canSeeThisDoc ? 'opacity-50 border-destructive' : ''}`}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    {doc.title}
                                                    {isOwner && (
                                                        <Badge variant="outline">Your Document</Badge>
                                                    )}
                                                </CardTitle>
                                                <CardDescription>
                                                    Owner: {getOwnerName(doc.ownerId)}
                                                </CardDescription>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleView(doc)}
                                                    disabled={!canSeeThisDoc}
                                                    className="gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(doc)}
                                                    disabled={!canEditThisDoc}
                                                    className="gap-1"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(doc)}
                                                    disabled={!canDeleteThisDoc}
                                                    className="gap-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    {!canSeeThisDoc && (
                                        <CardContent>
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    ไม่มีสิทธิ์เข้าถึง: ไม่สามารถดูเอกสารนี้ได้
                                                </AlertDescription>
                                            </Alert>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}