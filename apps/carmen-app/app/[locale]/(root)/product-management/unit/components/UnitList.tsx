"use client";

import { UnitDto } from "@/dtos/unit.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Pencil, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
interface UnitListProps {
    readonly units: UnitDto[];
}
export default function UnitList({ units }: UnitListProps) {
    const t = useTranslations('TableHeader');
    return (
        <div className="space-y-4">
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 hidden md:table-cell">#</TableHead>
                            <TableHead className="w-10 md:w-24">{t('name')}</TableHead>
                            <TableHead className="w-10 md:w-24">{t('code')}</TableHead>
                            <TableHead className="w-10 md:w-24">{t('status')}</TableHead>
                            <TableHead className="flex justify-end items-center">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <ScrollArea className="h-[600px]">
                    <Table>
                        <TableBody>
                            {units.map((unit, index) => (
                                <TableRow key={unit.id}>
                                    <TableCell className="w-10 hidden md:table-cell">{index + 1}</TableCell>
                                    <TableCell className="w-10 md:w-24">{unit.name}</TableCell>
                                    <TableCell className="w-10 md:w-24">{unit.code}</TableCell>
                                    <TableCell className="w-10 md:w-24">
                                        <Badge variant={unit.status ? "default" : "destructive"}>
                                            {unit.status ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="flex justify-end">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="hover:text-destructive">
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
}
