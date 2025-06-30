"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateTax, currencies } from "@/utils/tax-calculations";
import { Calculator, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import TaxResults from "./TaxResults";

export default function TaxCalculator() {
  const [amount, setAmount] = useState<string>("");
  const [vatRate, setVatRate] = useState<string>("7");
  const [withholdingRate, setWithholdingRate] = useState<string>("3");
  const [currency, setCurrency] = useState<string>("THB");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    setIsCalculating(true);

    // Add a small delay for better UX feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    const calculatedResults = calculateTax(
      numAmount,
      parseFloat(vatRate),
      parseFloat(withholdingRate),
      currency
    );

    setResults(calculatedResults);
    setIsCalculating(false);
  };

  const resetCalculator = () => {
    setAmount("");
    setVatRate("7");
    setWithholdingRate("3");
    setCurrency("THB");
    setResults(null);
  };

  const isValidAmount = amount && parseFloat(amount) > 0;
  const selectedCurrency = currencies.find((c) => c.code === currency);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-card-foreground">
              <div className="p-2 bg-primary rounded-lg">
                <Calculator className="h-6 w-6 text-primary-foreground" />
              </div>
              Calculate Tax
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Enter your amount and tax rates
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Currency Selection */}
            <div className="space-y-3">
              <Label
                htmlFor="currency"
                className="text-base font-semibold text-card-foreground"
              >
                Currency
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger
                  id="currency"
                  className="h-12 border-2 focus:border-primary transition-all duration-200"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-2 shadow-lg">
                  {currencies.map((curr) => (
                    <SelectItem
                      key={curr.code}
                      value={curr.code}
                      className="hover:bg-muted cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{curr.symbol}</span>
                        <span>
                          {curr.name} ({curr.code})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <Label
                htmlFor="amount"
                className="text-base font-semibold text-card-foreground"
              >
                Amount ({currency})
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-xl h-14 pl-12 pr-4 border-2 focus:border-primary transition-all duration-200"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-semibold">
                  {selectedCurrency?.symbol || "¤"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* VAT Rate */}
              <div className="space-y-3">
                <Label
                  htmlFor="vat-rate"
                  className="text-base font-semibold text-card-foreground"
                >
                  VAT Rate (%)
                </Label>
                <div className="relative">
                  <Input
                    id="vat-rate"
                    type="number"
                    placeholder="7"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    className="h-12 pr-10 border-2 focus:border-primary transition-all duration-200"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-semibold">
                    %
                  </div>
                </div>
              </div>

              {/* Withholding Tax Rate */}
              <div className="space-y-3">
                <Label
                  htmlFor="withholding-rate"
                  className="text-base font-semibold text-card-foreground"
                >
                  Withholding Tax (%)
                </Label>
                <div className="relative">
                  <Input
                    id="withholding-rate"
                    type="number"
                    placeholder="3"
                    value={withholdingRate}
                    onChange={(e) => setWithholdingRate(e.target.value)}
                    className="h-12 pr-10 border-2 focus:border-primary transition-all duration-200"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-semibold">
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handleCalculate}
                className="flex-1 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={!isValidAmount || isCalculating}
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Calculate Tax
                  </>
                )}
              </Button>

              <Button
                onClick={resetCalculator}
                variant="outline"
                className="flex-1 h-14 text-lg font-semibold border-2 hover:bg-muted transition-all duration-200"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted">
          <CardContent className="p-6">
            <h3 className="font-semibold text-card-foreground mb-3">
              Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                Select your preferred currency from the dropdown
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                Enter any custom VAT rate (e.g., 7%, 10%, 0%)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                Enter any custom withholding tax rate (e.g., 1%, 3%, 5%)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                Net transfer is the final amount to be transferred
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      {results && (
        <div className="xl:sticky xl:top-8 xl:self-start">
          <TaxResults results={results} />
        </div>
      )}
    </div>
  );
}
