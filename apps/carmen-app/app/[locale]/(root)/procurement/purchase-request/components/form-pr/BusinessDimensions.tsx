import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";

export default function BusinessDimensions() {
    return (
        <Card className="p-4 space-y-2">
            <div className="flex items-center gap-2">
                <Building className="text-purple-500 w-4 h-4" />
                <p className="text-sm font-semibold">Business Dimensions</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <BusinessDimensionItem label="Job number" value="FB-2024-INTL-001" />
                <BusinessDimensionItem label="Event" value="WORLD-FOOD-FESTIVAL" />
                <BusinessDimensionItem label="Project" value="PROJ007" />
                <BusinessDimensionItem label="Market Segment" value="HOSPITALITY" />
            </div>
        </Card>
    );
}

const BusinessDimensionItem = ({ label, value }: { label: string, value: string }) => {
    return (
        <div className="space-y-1">
            <Label className="text-xs font-semibold">{label}</Label>
            <p className="text-xs">{value}</p>
        </div>
    );
}