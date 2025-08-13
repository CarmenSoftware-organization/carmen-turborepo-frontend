import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface CalculationResultsProps {
  results: {
    originalPrice: number;
    vatAmount: number;
    withholdingAmount: number;
    finalAmount: number;
    priceBeforeVat: number;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function CalculationResults({
  results,
}: CalculationResultsProps) {
  return (
    <Card className="shadow-lg border-0 bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="fxr-c text-xl">
          <Receipt className="h-5 w-5 mr-2 text-primary" />
          Calculation Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">
              Price Before VAT
            </span>
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(results.priceBeforeVat)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
            <div className="fxr-c">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                VAT Amount
              </span>
            </div>
            <span className="text-lg font-semibold text-accent-foreground">
              {formatCurrency(results.vatAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
            <div className="fxr-c">
              <TrendingDown className="h-4 w-4 mr-2 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                Withholding Tax
              </span>
            </div>
            <span className="text-lg font-semibold text-destructive">
              {formatCurrency(results.withholdingAmount)}
            </span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="fxr-c">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                <span className="text-lg font-bold text-primary">
                  Final Amount
                </span>
              </div>
              <div className="text-right">
                <Badge
                  variant="secondary"
                  className="mb-1 bg-primary/10 text-primary"
                >
                  Total
                </Badge>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(results.finalAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {results.originalPrice > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-lg border">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              Summary
            </h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                • Original Amount: {formatCurrency(results.originalPrice)}
              </div>
              <div>• VAT Added: +{formatCurrency(results.vatAmount)}</div>
              <div>
                • Withholding Tax Deducted: -
                {formatCurrency(results.withholdingAmount)}
              </div>
              <div className="font-semibold">
                • Final Amount: {formatCurrency(results.finalAmount)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
