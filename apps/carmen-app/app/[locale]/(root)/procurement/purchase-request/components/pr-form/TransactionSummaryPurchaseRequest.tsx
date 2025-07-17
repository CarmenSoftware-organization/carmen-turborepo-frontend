import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalculatorIcon, CreditCardIcon, DollarSignIcon, PercentIcon, ShoppingCartIcon, TrendingUp } from "lucide-react";

interface TransactionCardProps {
    title: string;
    icon: React.ReactNode;
    value: string;
    color: string;
}
const TransactionCard = ({ title, icon, value, color }: TransactionCardProps) => {
    return (
        <Card className={`p-4 border-l-4 border-${color}-500 space-y-2`}>
            <div className="flex items-center justify-end gap-2">
                {icon}
                <h4 className="text-sm font-semibold">{title}</h4>
            </div>
            <p className={`text-2xl font-bold text-${color}-500 text-right`}>{value}</p>
        </Card>
    )
}

export default function TransactionSummaryPurchaseRequest() {
    return (
        <Card className="p-4 my-4 space-y-4">
            <h2 className="text-lg font-bold">Transaction Summary</h2>
            <div className="grid grid-cols-4 gap-4">
                <TransactionCard title="Subtotal" icon={<DollarSignIcon className="text-blue-500" />} value="1,400" color="blue" />
                <TransactionCard title="Discount" icon={<PercentIcon className="text-green-500" />} value="1,400" color="green" />
                <TransactionCard title="Net Amount" icon={<CreditCardIcon className="text-blue-500" />} value="1,400" color="blue" />
                <TransactionCard title="Tax" icon={<CalculatorIcon className="text-red-500" />} value="1,400" color="red" />
            </div>
            <Separator />
            <Card className="p-4 bg-blue-50 border-blue-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-700 rounded-full">
                            <TrendingUp className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold">Total Amount</h4>
                            <p className="text-sm text-muted-foreground">Final amount including all charges</p>
                        </div>

                    </div>
                    <h1 className="text-2xl font-bold text-blue-500">15,800</h1>
                </div>
            </Card>
        </Card>
    )
}