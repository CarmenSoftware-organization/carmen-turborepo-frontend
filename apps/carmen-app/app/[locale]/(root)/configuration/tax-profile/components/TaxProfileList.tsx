import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { TaxProfileGetAllDto } from "@/dtos/tax-profile.dto";
import { SquarePen, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface TaxProfileListProps {
    readonly taxProfiles: TaxProfileGetAllDto[];
    readonly isLoading: boolean;
    readonly onEdit: (id: string) => void;
    readonly onDelete: (id: string) => void;
}

export default function TaxProfileList({
    taxProfiles,
    isLoading,
    onEdit,
    onDelete
}: TaxProfileListProps) {
    const tHeader = useTranslations("TableHeader");
    const tTaxProfile = useTranslations("TaxProfile");

    return (
        <Table className="border">
            <TableHeader className="bg-muted">
                <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead className="w-40">{tHeader("name")}</TableHead>
                    <TableHead className="w-40">{tHeader("rate")} %</TableHead>
                    <TableHead className="w-40">{tHeader("status")}</TableHead>
                    <TableHead className="text-right">{tHeader("action")}</TableHead>
                </TableRow>
            </TableHeader>
            {isLoading ? (
                <TableBodySkeleton rows={5} />
            ) : (
                <TableBody>
                    {taxProfiles?.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center text-muted-foreground py-8"
                            >
                                {tTaxProfile("no_tax_profile")}
                            </TableCell>
                        </TableRow>
                    ) : (
                        taxProfiles?.map(
                            (profile: TaxProfileGetAllDto, index: number) => (
                                <TableRow key={profile.id} className="hover:bg-muted/50">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">
                                        {profile.name}
                                    </TableCell>
                                    <TableCell>{profile.tax_rate}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={profile.is_active ? "active" : "inactive"}
                                        >
                                            {profile.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(profile.id)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <SquarePen className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(profile.id)}
                                                className="h-8 w-8 p-0 hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        )
                    )}
                </TableBody>
            )}
        </Table>
    )
}