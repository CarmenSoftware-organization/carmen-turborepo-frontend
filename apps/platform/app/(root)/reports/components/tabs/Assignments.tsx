import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ReportAssignmentType } from "@/dto/report.dto";
import { mockReportAssignment } from "@/mock-data/reports";
import { FileText, MoreHorizontal, Plus } from "lucide-react";

export default function Assignments() {
    const assignments = mockReportAssignment;
    return (
        <div className="space-y-4">
            <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold tracking-tight'>Assignments Reports</h2>
                <div className='flex items-center gap-2'>
                    <Input placeholder='Search' className='h-8 w-64' />
                    <Button size={'sm'}>
                        <Plus className='h-4 w-4' />
                        Add Assignment
                    </Button>
                </div>
            </div>
            {assignments.map((assignment: ReportAssignmentType) => (
                <Card key={assignment.id} className='p-2 mt-2 flex items-center justify-between'>
                    <div className="space-y-1">
                        <div className="flex items-center gap-4 p-1">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{assignment.location}</span>
                            <div className='flex items-center gap-2'>
                                <Badge variant={assignment.status === 'active' ? 'default' : 'destructive'}>{assignment.status}</Badge>
                                <Badge variant='secondary'>{assignment.category}</Badge>
                                <Badge variant='outline'>{assignment.frequency.type}</Badge>
                            </div>
                        </div>
                        <p className='text-sm text-muted-foreground'>{assignment.description}</p>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm text-muted-foreground'>{assignment.frequency.type} • Next: {assignment.frequency.nextReport}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </Card>
            ))}
        </div>
    )
}
