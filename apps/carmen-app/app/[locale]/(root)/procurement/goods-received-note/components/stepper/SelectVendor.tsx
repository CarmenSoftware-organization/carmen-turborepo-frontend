import { NewVendorDto } from "../../type.dto";
import { useCallback, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SearchInput from "@/components/ui-custom/SearchInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelectVendorProps {
    readonly vendors: NewVendorDto[];
    readonly selectedVendor?: NewVendorDto;
    readonly onVendorSelect: (vendor: NewVendorDto) => void;
    readonly onNext?: () => void;
}

export default function SelectVendor({ vendors, selectedVendor, onVendorSelect, onNext }: SelectVendorProps) {
    const [search, setSearch] = useState('');

    const handleVendorSelect = useCallback((vendor: NewVendorDto) => {
        onVendorSelect(vendor);
        // Automatically proceed to next step
        if (onNext) {
            onNext();
        }
    }, [onVendorSelect, onNext]);

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(search.toLowerCase()) ||
        vendor.no.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Select Vendor</CardTitle>
                <CardDescription>Choose the vendor for this Goods Receive Note.</CardDescription>
                <SearchInput
                    defaultValue={search}
                    onSearch={setSearch}
                    placeholder="Search vendor..."
                    data-id="grn-list-search-input"
                />
            </CardHeader>
            <CardContent>
                <Table className="border">
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Business Reg. No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="w-[100px] text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredVendors.map((vendor) => {
                            const isSelected = selectedVendor?.id === vendor.id;
                            return (
                                <TableRow
                                    key={vendor.id}
                                    className={cn(
                                        "hover:bg-muted/50",
                                        isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
                                    )}
                                >
                                    <TableCell>{vendor.no}</TableCell>
                                    <TableCell>{vendor.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant={isSelected ? "secondary" : "default"}
                                            size="sm"
                                            onClick={() => handleVendorSelect(vendor)}
                                            aria-label={`Select ${vendor.name}`}
                                        >
                                            {isSelected ? "Selected" : "Select"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
