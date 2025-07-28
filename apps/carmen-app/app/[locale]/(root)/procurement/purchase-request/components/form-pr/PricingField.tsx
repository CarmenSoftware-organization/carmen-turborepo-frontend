import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PricingProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

export default function PricingField({ label, value, onChange, placeholder }: PricingProps) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <Input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="text-sm h-8 border-blue-300 focus:border-blue-500"
            />
        </div>
    )
}