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
import { Switch } from "@/components/ui/switch";
import {
  calculateTax,
  calculateReverseTax,
  currencies,
  ReverseTaxCalculationResult,
  TaxCalculationResult,
} from "@/utils/tax-calculations";
import { Calculator, RefreshCw, Sparkles, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import TaxResults from "./TaxResults";

type CalculationMode = "forward" | "reverse";

export default function TaxCalculator() {
  const [amount, setAmount] = useState<string>("");
  const [vatRate, setVatRate] = useState<string>("7");
  const [withholdingRate, setWithholdingRate] = useState<string>("3");
  const [currency, setCurrency] = useState<string>("THB");
  const [calculationMode, setCalculationMode] =
    useState<CalculationMode>("forward");
  const [useVat, setUseVat] = useState<boolean>(true);
  const [useWithholding, setUseWithholding] = useState<boolean>(true);
  const [results, setResults] = useState<
    TaxCalculationResult | ReverseTaxCalculationResult | null
  >(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    setIsCalculating(true);

    // Add a small delay for better UX feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    let calculatedResults: TaxCalculationResult | ReverseTaxCalculationResult;

    if (calculationMode === "forward") {
      calculatedResults = calculateTax(
        numAmount,
        parseFloat(vatRate),
        parseFloat(withholdingRate),
        currency,
        useVat,
        useWithholding
      );
    } else {
      calculatedResults = calculateReverseTax(
        numAmount,
        parseFloat(vatRate),
        parseFloat(withholdingRate),
        currency,
        useVat,
        useWithholding
      );
    }

    setResults(calculatedResults);
    setIsCalculating(false);
  };

  const resetCalculator = () => {
    setAmount("");
    setVatRate("7");
    setWithholdingRate("3");
    setCurrency("THB");
    setUseVat(true);
    setUseWithholding(true);
    setResults(null);
  };

  const isValidAmount = amount && parseFloat(amount) > 0;
  const selectedCurrency = currencies.find((c) => c.code === currency);
  const isReverseMode = calculationMode === "reverse";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-card-foreground">
              <div className="p-2 bg-primary rounded-lg">
                <Calculator className="h-6 w-6 text-primary-foreground" />
              </div>
              คำนวณภาษี
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {isReverseMode
                ? "ใส่ยอดรวม VAT เพื่อหาจำนวนเงินต้นและภาษีที่ต้องจ่าย"
                : "ใส่จำนวนเงินก่อน VAT เพื่อคำนวณภาษีและยอดโอน"}
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Calculation Mode Toggle */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-card-foreground">
                ประเภทยอดเงิน
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={!isReverseMode ? "default" : "outline"}
                  onClick={() => setCalculationMode("forward")}
                  className="w-full h-12 text-sm font-medium"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  ไม่รวม VAT
                </Button>
                <Button
                  variant={isReverseMode ? "default" : "outline"}
                  onClick={() => setCalculationMode("reverse")}
                  className="w-full h-12 text-sm font-medium"
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  รวม VAT
                </Button>
              </div>
            </div>

            {/* Currency Selection */}
            <div className="space-y-3">
              <Label
                htmlFor="currency"
                className="text-base font-semibold text-card-foreground"
              >
                สกุลเงิน
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
                {isReverseMode
                  ? `ยอดรวม VAT (${currency})`
                  : `ยอดก่อน VAT (${currency})`}
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder={isReverseMode ? "107.00" : "100.00"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-xl h-14 pl-12 pr-4 border-2 focus:border-primary transition-all duration-200"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-semibold">
                  {selectedCurrency?.symbol || "¤"}
                </div>
              </div>
              {isReverseMode ? (
                <p className="text-sm text-muted-foreground">
                  ใส่ยอดเงินที่รวม VAT แล้ว ระบบจะคำนวณหาจำนวนเงินก่อน VAT
                  และภาษีที่ต้องจ่าย
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  ใส่ยอดเงินก่อนบวก VAT ระบบจะคำนวณ VAT และยอดโอนสุดท้าย
                </p>
              )}
            </div>

            {/* Tax Configuration */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold text-card-foreground">
                  การตั้งค่าภาษี
                </Label>

                {/* VAT Toggle and Rate */}
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-muted-foreground/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor="use-vat"
                        className="text-sm font-medium text-card-foreground"
                      >
                        ใช้ VAT
                      </Label>
                    </div>
                    <Switch
                      id="use-vat"
                      checked={useVat}
                      onCheckedChange={setUseVat}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  {useVat && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="vat-rate"
                        className="text-sm text-muted-foreground"
                      >
                        อัตรา VAT (%)
                      </Label>
                      <div className="relative">
                        <Input
                          id="vat-rate"
                          type="number"
                          placeholder="7"
                          value={vatRate}
                          onChange={(e) => setVatRate(e.target.value)}
                          className="h-10 pr-8 border focus:border-primary transition-all duration-200"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                          %
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Withholding Tax Toggle and Rate */}
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-muted-foreground/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor="use-withholding"
                        className="text-sm font-medium text-card-foreground"
                      >
                        ใช้หัก ณ ที่จ่าย
                      </Label>
                    </div>
                    <Switch
                      id="use-withholding"
                      checked={useWithholding}
                      onCheckedChange={setUseWithholding}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  {useWithholding && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="withholding-rate"
                        className="text-sm text-muted-foreground"
                      >
                        อัตราหัก ณ ที่จ่าย (%)
                      </Label>
                      <div className="relative">
                        <Input
                          id="withholding-rate"
                          type="number"
                          placeholder="3"
                          value={withholdingRate}
                          onChange={(e) => setWithholdingRate(e.target.value)}
                          className="h-10 pr-8 border focus:border-primary transition-all duration-200"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                          %
                        </div>
                      </div>
                    </div>
                  )}
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
                    กำลังคำนวณ...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    {isReverseMode ? "คำนวณจากยอดรวม VAT" : "คำนวณภาษี"}
                  </>
                )}
              </Button>

              <Button
                onClick={resetCalculator}
                variant="outline"
                className="flex-1 h-14 text-lg font-semibold border-2 hover:bg-muted transition-all duration-200"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                รีเซ็ต
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-muted">
          <CardContent className="p-6">
            <h3 className="font-semibold text-card-foreground mb-3">
              {isReverseMode ? "วิธีใช้งาน: รวม VAT" : "วิธีใช้งาน: ไม่รวม VAT"}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {isReverseMode ? (
                <>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    ใส่ยอดเงินที่รวม VAT แล้ว (เช่น 107.00 บาท)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    ระบบจะแยกคำนวณหายอดก่อน VAT (เช่น 100.00 บาท)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    แสดงจำนวน VAT และหัก ณ ที่จ่ายที่คำนวณได้
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    เหมาะสำหรับการตรวจสอบใบกำกับภาษี
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    ใส่ยอดเงินก่อนบวก VAT (เช่น 100.00 บาท)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    ระบบจะคำนวณ VAT ตามอัตราที่กำหนด
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    คำนวณหัก ณ ที่จ่ายจากยอดรวม VAT
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    แสดงยอดโอนสุดท้ายที่ต้องจ่ายจริง
                  </li>
                </>
              )}
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
