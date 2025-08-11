import { useTranslations } from "next-intl";
import {
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Hash, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface DocsProps {
    readonly docs: any[];
}

export default function Docs({ docs }: DocsProps) {
    const tPurchaseOrder = useTranslations("PurchaseOrder");
    const tTableHeader = useTranslations("TableHeader");
    return (
        <div className="space-y-4">
            <p className="font-medium">{tPurchaseOrder("related_docs")}</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center w-10">
                            <Checkbox />
                        </TableHead>
                        <TableHead className="text-center w-10">
                            <Hash className="h-3 w-3" />
                        </TableHead>
                        <TableHead className="text-left">{tTableHeader("no")}</TableHead>
                        <TableHead className="text-left">{tTableHeader("doc_type")}</TableHead>
                        <TableHead className="text-center">{tTableHeader("date")}</TableHead>
                        <TableHead className="text-right">{tTableHeader("amount")}</TableHead>
                        <TableHead className="text-center">{tTableHeader("status")}</TableHead>
                        <TableHead className="text-right">{tTableHeader("action")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {docs.map((doc, index) => (
                        <TableRow key={index}>
                            <TableCell className="text-center w-10">
                                <Checkbox />
                            </TableCell>
                            <TableCell className="text-center w-10">{index + 1}</TableCell>
                            <TableCell className="text-left">{doc.no}</TableCell>
                            <TableCell className="text-left">{doc.type}</TableCell>
                            <TableCell className="text-center">{doc.date}</TableCell>
                            <TableCell className="text-right">{doc.amount}</TableCell>
                            <TableCell className="text-center">{doc.status}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size={'sm'}>
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size={'sm'}>
                                        <Trash2 className="h-3 w-3" />
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