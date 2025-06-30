import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/tax-calculations";
import { Receipt, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface TaxResultsProps {
  results: {
    originalAmount: number;
    vatAmount: number;
    withholdingAmount: number;
    netTransferAmount: number;
    vatRate: number;
    withholdingRate: number;
    currency: string;
  };
}
export default function TaxResults({ results }: TaxResultsProps) {
  const formatAmount = (amount: number) => {
    return formatCurrency(amount, results.currency);
  };

  const ResultCard = ({
    title,
    amount,
    rate,
    icon: Icon,
    color = "primary",
    isMain = false,
  }: {
    title: string;
    amount: number;
    rate?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    color?: string;
    isMain?: boolean;
  }) => {
    const colorClasses = {
      primary: "bg-primary/10 border-primary/20 text-primary",
      success: "bg-green-50 border-green-200 text-green-700",
      destructive: "bg-destructive/10 border-destructive/20 text-destructive",
      accent: "bg-accent border-accent-foreground/20 text-accent-foreground",
    };

    return (
      <div
        className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
          isMain
            ? "bg-green-50 border-green-200 shadow-lg"
            : colorClasses[color as keyof typeof colorClasses]
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${isMain ? "text-green-600" : ""}`} />
            <span
              className={`text-sm font-medium ${isMain ? "text-green-900" : "text-muted-foreground"}`}
            >
              {title} {rate && `(${rate}%)`}
            </span>
          </div>
        </div>
        <div
          className={`${isMain ? "text-3xl" : "text-2xl"} font-bold ${isMain ? "text-green-700" : ""}`}
        >
          {amount < 0 ? "-" : ""}
          {formatAmount(Math.abs(amount))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm animate-in slide-in-from-right duration-500">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-card-foreground">
            <div className="p-2 bg-green-600 rounded-lg">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            Calculation Results
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Detailed breakdown of your tax calculations in {results.currency}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Amount */}
          <ResultCard
            title="Original Amount"
            amount={results.originalAmount}
            icon={Receipt}
            color="primary"
          />

          <Separator className="my-6" />

          {/* Tax Breakdown */}
          <div className="grid grid-cols-1 gap-4">
            <ResultCard
              title="VAT Amount"
              amount={results.vatAmount}
              rate={results.vatRate}
              icon={TrendingUp}
              color="primary"
            />

            <ResultCard
              title="Withholding Tax"
              amount={-results.withholdingAmount}
              rate={results.withholdingRate}
              icon={TrendingDown}
              color="destructive"
            />
          </div>

          <Separator className="my-6" />

          {/* Final Amount */}
          <ResultCard
            title="Net Transfer Amount"
            amount={results.netTransferAmount}
            icon={ArrowRight}
            color="success"
            isMain={true}
          />

          {/* Calculation Flow */}
          <div className="bg-muted p-6 rounded-xl space-y-4">
            <h4 className="font-semibold text-card-foreground mb-4">
              Calculation Breakdown
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Base Amount:</span>
                <span className="font-semibold">
                  {formatAmount(results.originalAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center text-primary">
                <span>+ VAT ({results.vatRate}%):</span>
                <span className="font-semibold">
                  +{formatAmount(results.vatAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center text-destructive">
                <span>- Withholding Tax ({results.withholdingRate}%):</span>
                <span className="font-semibold">
                  -{formatAmount(results.withholdingAmount)}
                </span>
              </div>

              <Separator className="my-3" />

              <div className="flex justify-between items-center text-lg font-bold text-green-600 pt-2">
                <span>Final Transfer Amount:</span>
                <span>{formatAmount(results.netTransferAmount)}</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <p className="text-sm text-primary">
              <strong>Note:</strong> This calculation includes VAT added to the
              base amount, with withholding tax deducted from the total (base +
              VAT). All amounts are displayed in {results.currency}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
