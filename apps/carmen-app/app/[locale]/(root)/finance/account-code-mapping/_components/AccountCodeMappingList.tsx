import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, SquarePen, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccountCodeMappingDto } from "@/dtos/finance.dto";

interface AccountCodeMappingListProps {
    readonly mappings: AccountCodeMappingDto[];
}

export default function AccountCodeMappingList({ mappings }: AccountCodeMappingListProps) {
    return (
        <ScrollArea className="h-[calc(100vh-230px)]">
            <div className="space-y-4">
                <div className="hidden md:block">
                    <Table className="border">
                        <TableHeader>
                            <TableRow className="bg-muted">
                                <TableHead className="w-10 text-center">#</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Sub Category</TableHead>
                                <TableHead>Item Group</TableHead>
                                <TableHead>Account Code</TableHead>
                                <TableHead>Department Count</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mappings.map((mapping, index) => (
                                <TableRow key={mapping.id}>
                                    <TableCell className="text-center w-10">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{mapping.location}</TableCell>
                                    <TableCell>{mapping.category}</TableCell>
                                    <TableCell>{mapping.sub_category}</TableCell>
                                    <TableCell>{mapping.item_group}</TableCell>
                                    <TableCell>{mapping.account_code}</TableCell>
                                    <TableCell>{mapping.department_count}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-7 w-7">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 w-7">
                                            <SquarePen className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 text-destructive hover:text-destructive/80">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="grid gap-4 md:hidden">
                    {mappings.map((mapping) => (
                        <Card key={mapping.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="fxr-c gap-2">
                                        <p className="text-sm font-medium">{mapping.location}</p>
                                        <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                            {mapping.category}
                                        </Badge>
                                    </div>
                                    <div className="fxr-c gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                            <SquarePen className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Category</p>
                                        <p className="text-sm font-medium">{mapping.category}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Sub Category</p>
                                        <p className="text-sm font-medium">{mapping.sub_category}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Item Group</p>
                                        <p className="text-sm font-medium">{mapping.item_group}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Account Code</p>
                                        <p className="text-sm font-medium">{mapping.account_code}</p>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <p className="text-sm text-muted-foreground">Department Count</p>
                                        <p className="text-sm font-medium">{mapping.department_count}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
} 