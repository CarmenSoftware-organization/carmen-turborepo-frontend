"use client";

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
import { Switch } from "@/components/ui/switch";
import { Calculator, Percent, DollarSign } from "lucide-react";
import CalculationResults from "./CalculationResults";
import { calculateTaxes } from "@/utils/tax-calculations";
import { useEffect, useState } from "react";

export default function TaxCalculattion() {
  const [amount, setAmount] = useState<string>("");
  const [vatRate, setVatRate] = useState<string>("7");
  const [withholdingRate, setWithholdingRate] = useState<string>("3");
  const [isVatInclusive, setIsVatInclusive] = useState<boolean>(false);
  const [results, setResults] = useState({
    originalPrice: 0,
    vatAmount: 0,
    withholdingAmount: 0,
    finalAmount: 0,
    priceBeforeVat: 0,
  });

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      const calculatedResults = calculateTaxes(
        parseFloat(amount),
        parseFloat(vatRate),
        parseFloat(withholdingRate),
        isVatInclusive
      );
      setResults(calculatedResults);
    } else {
      setResults({
        originalPrice: 0,
        vatAmount: 0,
        withholdingAmount: 0,
        finalAmount: 0,
        priceBeforeVat: 0,
      });
    }
  }, [amount, vatRate, withholdingRate, isVatInclusive]);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-foreground">
              Tax Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Calculate VAT and Withholding Tax instantly
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Tax Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount (THB)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg font-semibold"
                />
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Switch
                  checked={isVatInclusive}
                  onCheckedChange={setIsVatInclusive}
                  id="vat-inclusive"
                />
                <Label htmlFor="vat-inclusive" className="text-sm font-medium">
                  Amount includes VAT
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center">
                    <Percent className="h-4 w-4 mr-1" />
                    VAT Rate
                  </Label>
                  <Select value={vatRate} onValueChange={setVatRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="7">7%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center">
                    <Percent className="h-4 w-4 mr-1" />
                    Withholding Tax
                  </Label>
                  <Select
                    value={withholdingRate}
                    onValueChange={setWithholdingRate}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="1">1%</SelectItem>
                      <SelectItem value="3">3%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <CalculationResults results={results} />
        </div>
      </div>
    </div>
  );
}
