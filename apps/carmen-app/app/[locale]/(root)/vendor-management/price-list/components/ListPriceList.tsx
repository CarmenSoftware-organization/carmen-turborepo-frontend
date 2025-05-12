import { PriceListDto } from "@/dtos/vendor-management";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ListPriceListProps {
    readonly priceLists: PriceListDto[];
}

export default function ListPriceList({ priceLists }: ListPriceListProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === priceLists.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = priceLists.map(pl => pl.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = priceLists.length > 0 && selectedItems.length === priceLists.length;


    return (
        <div className="space-y-4">
            <Table className="border">
                <TableHeader>
                    <TableRow className="bg-muted">
                        <TableHead className="w-10 text-center">
                            <Checkbox
                                id="select-all"
                                checked={isAllSelected}
                                onCheckedChange={handleSelectAll}
                                aria-label="Select all price lists"
                            />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px] text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {priceLists.map((pl) => (
                        <TableRow key={pl.id}>
                            <TableCell className="text-center w-10">
                                <Checkbox
                                    id={`checkbox-${pl.id}`}
                                    checked={selectedItems.includes(pl.id ?? '')}
                                    onCheckedChange={() => handleSelectItem(pl.id ?? '')}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{pl.name}</p>
                                        <Badge>{pl.code}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{pl.description}</p>
                                </div>
                            </TableCell>
                            <TableCell>{pl.start_date}</TableCell>
                            <TableCell>{pl.end_date}</TableCell>
                            <TableCell>
                                <Badge variant={pl.is_active ? 'active' : 'inactive'}>
                                    {pl.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell className="w-[100px] text-right">
                                <div className="flex items-center justify-end">
                                    <Button variant="ghost" size={'sm'} className="h-7 w-7">
                                        <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size={'sm'} className="h-7 w-7">
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size={'sm'} className="h-7 w-7">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </div>
    )
}
