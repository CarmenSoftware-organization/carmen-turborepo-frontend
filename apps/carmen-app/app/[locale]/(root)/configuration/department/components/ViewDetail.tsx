"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft, SquarePen, CrownIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ViewDetailProps {
    readonly data: {
        name: string;
        description: string;
        is_active: boolean;
        users: Array<{ key: string; title: string; isHod: boolean }>;
    };
    readonly onEdit: () => void;
    readonly onBack: () => void;
}

export default function ViewDetail({ data, onEdit, onBack }: ViewDetailProps) {
    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button onClick={onBack} size="sm" variant="ghost">
                                <ArrowLeft />
                            </Button>
                            <p className="text-xl font-semibold">{data.name || "-"}</p>
                            <Badge variant={data.is_active ? "active" : "inactive"}>
                                {data.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={onEdit}>
                                <SquarePen className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium text-gray-500">
                            Description
                        </Label>
                        <p className="text-gray-700">{data.description || "-"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Department Members ({data.users.length} people)
                    </div>
                    {data.users.length > 0 ? (
                        <div className="space-y-3">
                            {data.users.map((user) => (
                                <div
                                    key={user.key}
                                    className="flex items-center gap-3"
                                >
                                    <Avatar>
                                        <AvatarFallback className="text-xs">
                                            {user.title
                                                ?.split(" ")[0]
                                                ?.charAt(0)
                                                ?.toUpperCase() || ""}
                                            {user.title
                                                ?.split(" ")[1]
                                                ?.charAt(0)
                                                ?.toUpperCase() || ""}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{user.title}</p>
                                        {user.isHod && (
                                            <Badge variant="outline" className="text-xs">
                                                <CrownIcon className="text-ember-500" /> Head of Department
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>No members in this department</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}