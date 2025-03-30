import { VendorDto } from "@/dtos/vendor-management";
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
import { Eye, Pencil, Trash } from "lucide-react";

interface VendorListProps {
    readonly vendors: VendorDto[];
}

export default function VendorList({ vendors }: VendorListProps) {
    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Business Unit Type</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Contact Information</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendors.map((vendor, index) => (
                            <TableRow key={vendor.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell className="font-medium">{vendor.name}</TableCell>
                                <TableCell>{vendor.bu_type}</TableCell>
                                <TableCell>{vendor.address}</TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="font-medium">{vendor.contact_person.name}</p>
                                        <p className="text-sm text-muted-foreground">{vendor.contact_person.phone}</p>
                                        <p className="text-sm text-muted-foreground">{vendor.contact_person.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="grid gap-4 md:hidden">
                {vendors.map((vendor) => (
                    <Card key={vendor.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">{vendor.name}</p>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {vendor.bu_type}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                        <Pencil className="h-4 w-4" />
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
                                    <p className="text-sm text-muted-foreground">Business Unit Type</p>
                                    <p className="text-sm font-medium">{vendor.bu_type}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Address</p>
                                    <p className="text-sm font-medium">{vendor.address}</p>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <p className="text-sm text-muted-foreground">Contact Information</p>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{vendor.contact_person.name}</p>
                                        <p className="text-sm text-muted-foreground">{vendor.contact_person.phone}</p>
                                        <p className="text-sm text-muted-foreground">{vendor.contact_person.email}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 