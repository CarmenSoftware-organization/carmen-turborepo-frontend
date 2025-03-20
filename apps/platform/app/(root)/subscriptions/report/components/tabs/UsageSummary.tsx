import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { mockModuleUsageData } from "@/mock-data/subscription";

export default function UsageSummary() {
    return (
        <Card className="p-4">
            <p className="text-2xl font-medium">Module Usage Summary</p>
            <p className="text-sm text-muted-foreground">Comprehensive view of module metrics</p>
            <Table className="mt-2">
                <TableHeader>
                    <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead>Business Units</TableHead>
                        <TableHead>Active Users</TableHead>
                        <TableHead>Adoption Rate</TableHead>
                        <TableHead>Growth Rate</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockModuleUsageData.map((module) => (
                        <TableRow key={module.id}>
                            <TableCell>{module.name}</TableCell>
                            <TableCell>{module.businessUnits}</TableCell>
                            <TableCell>{module.activeUsers}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={module.adoptionRate} className="w-[60%]" />
                                    <span className="text-sm">{module.adoptionRate}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-green-500">+{module.growthRate}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}
