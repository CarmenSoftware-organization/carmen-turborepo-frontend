"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, SquarePen, CrownIcon, Building2, CheckCircle, FileText, } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface ViewDetailProps {
    readonly data: {
        name: string;
        description: string;
        is_active: boolean;
        users: Array<{ key: string; title: string; isHod: boolean }>;
    };
    readonly onEdit: () => void;
    readonly onBack: () => void;
};


export default function ViewDetail({ data, onEdit, onBack }: ViewDetailProps) {

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button onClick={onBack} size="sm" variant="ghost">
                        <ChevronLeft />
                    </Button>
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <h1 className="text-2xl font-bold">{data.name}</h1>
                    <Badge variant={data.is_active ? "active" : "inactive"} className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {data.is_active ? "Active" : "Inactive"}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={onEdit} size={'sm'}>
                        <SquarePen />
                        Edit
                    </Button>
                </div>
            </div>
            <Separator />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div>
                                <Label className="text-sm font-medium">Department</Label>
                                <p className="text-base font-medium">{data.name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${data.is_active ? "bg-green-500" : "bg-gray-400"}`} />
                                    <span className="text-sm">{data.is_active ? "Active" : "Inactive"}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Description</Label>
                            <p className="text-base mt-1">{data.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Members
                        <Badge variant="outline" className="ml-2">
                            {data.users.length} {data.users.length === 1 ? "Member" : "Members"}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.users.map((user) => (
                                <TableRow key={user.key}>
                                    <TableCell className="font-medium">{user.title}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {user.isHod && (
                                                <CrownIcon />
                                            )}
                                            {user.isHod ? "Hod" : "Member"}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Total Members</p>
                                <p className="text-2xl font-bold">{data.users.length}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">data Heads</p>
                                <p className="text-2xl font-bold">
                                    {data.users.filter((user) => user.isHod).length}
                                </p>
                            </div>
                            <Building2 className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Status</p>
                                <p className="text-2xl font-bold text-green-600">{data.is_active ? "Active" : "Inactive"}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}