import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttachmentPrDto } from "@/dtos/procurement.dto";
import { mockAttachments } from "@/mock-data/procurement";
import { Eye, FileDown } from "lucide-react";


export default function AttachmentPr() {

    const handleView = (attachment: AttachmentPrDto) => {
        console.log("Viewing attachment:", attachment);
    };

    const handleDownload = (attachment: AttachmentPrDto) => {
        console.log("Downloading attachment:", attachment);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Attachments</h3>
                <Button size="sm">
                    Upload File
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Uploaded At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockAttachments.map((attachment) => (
                        <TableRow key={attachment.id}>
                            <TableCell className="font-medium">{attachment.name}</TableCell>
                            <TableCell>{attachment.type}</TableCell>
                            <TableCell>{attachment.size}</TableCell>
                            <TableCell>{attachment.uploadedBy}</TableCell>
                            <TableCell>{attachment.uploadedAt}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-accent"
                                        onClick={() => handleView(attachment)}
                                        aria-label="View file"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-accent"
                                        onClick={() => handleDownload(attachment)}
                                        aria-label="Download file"
                                    >
                                        <FileDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

