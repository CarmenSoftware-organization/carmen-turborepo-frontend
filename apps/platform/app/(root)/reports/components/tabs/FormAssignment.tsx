"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportAssignmentType } from "@/dto/report.dto";
import { mockNewAssignReports } from "@/mock-data/reports";

interface FormAssignmentProps {
    readonly onAssign: (selectedReports: ReportAssignmentType[]) => void;
}

export default function FormAssignment({ onAssign }: FormAssignmentProps) {
    const [open, setOpen] = useState(false);
    const [selectedReports, setSelectedReports] = useState<ReportAssignmentType[]>([]);

    const onSubmit = () => {
        onAssign(selectedReports);
        setSelectedReports([]);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusIcon className="w-4 h-4" />
                    Add Assignment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Assign Multiple Reports</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* left side */}
                    <div className="w-full md:w-1/2 space-y-4">
                        <h3 className="text-lg font-medium">Select Reports</h3>
                        <Input placeholder="Search" className="mb-4" />
                        <div className="space-y-2">
                            {mockNewAssignReports.map((report) => (
                                <Card key={report.id} className="p-3">
                                    <div className="flex gap-2">
                                        <Checkbox
                                            id={report.id}
                                            checked={selectedReports.some((r) => r.id === report.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedReports([...selectedReports, report]);
                                                } else {
                                                    setSelectedReports(selectedReports.filter((r) => r.id !== report.id));
                                                }
                                            }}
                                            className="mt-1"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{report.category}</h4>
                                                <Badge variant="outline">
                                                    {report.location}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground">{report.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                    {/* right side */}
                    <div className="w-full md:w-1/2 space-y-4">
                        <h3 className="text-lg font-medium">Assignment Configuration</h3>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select hotel group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Hotel 1</SelectItem>
                                <SelectItem value="2">Hotel 2</SelectItem>
                                <SelectItem value="3">Hotel 3</SelectItem>
                            </SelectContent>
                        </Select>
                        <Card className="space-y-2 p-3">
                            <p className="text-sm text-muted-foreground mb-4">
                                Selected reports: {selectedReports.length}
                            </p>
                            {selectedReports.map((report) => (
                                <div
                                    key={report.id}
                                    className="p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{report.category}</h4>
                                            <Badge variant="outline">
                                                {report.location}
                                            </Badge>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedReports(selectedReports.filter((r) => r.id !== report.id));
                                            }}
                                            className=""
                                            aria-label={`Remove ${report.category}`}
                                        >
                                            <XIcon className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </Card>
                        <Button className="w-full" onClick={onSubmit}>
                            Assign
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
}
