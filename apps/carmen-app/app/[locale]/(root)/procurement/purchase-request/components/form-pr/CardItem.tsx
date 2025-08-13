import { Card } from "@/components/ui/card";

interface CardItemProps {
    readonly title: string;
    readonly value: string;
    readonly color: string;
}

export default function CardItem({ title, value, color }: CardItemProps) {
    return (
        <Card className={`flex items-center rounded-md justify-center h-20 bg-${color}-50 border border-${color}-200`}>
            <div className="flex flex-col items-center justify-center">
                <p className={`text-sm font-bold text-${color}-700`}>{value}</p>
                <p className={`text-xs font-medium text-${color}-600`}>{title}</p>
            </div>
        </Card>
    );
}