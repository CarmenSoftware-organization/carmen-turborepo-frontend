"use client";

import { useAuth } from "@/context/AuthContext";
import { useSystemUnitBuQuery } from "@/hooks/useSystemConfig";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { GetAllSystemUnitBuDto } from "@/dtos/system.dto";
import { Badge } from "@/components/ui/badge";
export default function BusinessUnitPage() {
    const { token } = useAuth();
    const { data } = useSystemUnitBuQuery(token);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Business Unit</h1>
            <Card className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>HQ</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data.map((item: GetAllSystemUnitBuDto, i: number) => (
                            <TableRow key={item.id}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{item.code}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <Badge variant={item.is_hq ? "default" : "secondary"}>
                                        {item.is_hq ? "Yes" : "No"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.is_active ? "active" : "inactive"}>
                                        {item.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
