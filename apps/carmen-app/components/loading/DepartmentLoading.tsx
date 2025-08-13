"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DepartmentLoading() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>
            </div>

            <Separator />

            {/* Information Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div>
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-16 mb-2" />
                                <div className="flex items-center gap-2 mt-1">
                                    <Skeleton className="w-2 h-2 rounded-full" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Members Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-5 w-20 rounded-full ml-2" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {/* Table Header */}
                        <div className="grid grid-cols-2 gap-4 pb-2 border-b">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-10" />
                        </div>
                        {/* Table Rows */}
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 py-2">
                                <Skeleton className="h-5 w-32" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 rounded-md" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}