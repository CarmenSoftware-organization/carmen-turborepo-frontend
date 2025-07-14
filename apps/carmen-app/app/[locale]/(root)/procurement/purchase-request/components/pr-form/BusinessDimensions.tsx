import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";

export default function BusinessDimensions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="text-purple-500" />
                    Business Dimensions
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Job number</Label>
                    <p>FB-2024-INTL-001</p>
                </div>
                <div>
                    <Label>Event</Label>
                    <p>WORLD-FOOD-FESTIVAL</p>
                </div>
                <div>
                    <Label>Project</Label>
                    <p>PROJ007</p>
                </div>
                <div>
                    <Label>Market Segment</Label>
                    <p>HOSPITALITY</p>
                </div>
            </CardContent>
        </Card>
    );
}