"use client";

import { useAuth } from "@/context/AuthContext";
import { useCurrencyQuery } from "@/hooks/currency";
import CurrenciesList from "./components/CurrencieList";
import { CurrencyDto } from "@/dtos/config.dto";
import ExchangeRate from "./components/ExchangeRate";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CurrenciesPage() {
  const { token, tenantId } = useAuth();
  const [isExchangeRateOpen, setIsExchangeRateOpen] = useState(false);

  const { currencies } = useCurrencyQuery(token, tenantId);
  const currenciesData = currencies?.data ?? [];

  const usedCurrencies = currenciesData.map(
    (currency: CurrencyDto) => currency.code
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">สกุลเงิน</h2>
        <Button variant="outline" onClick={() => setIsExchangeRateOpen(true)}>
          ดูอัตราแลกเปลี่ยน
        </Button>
      </div>

      <CurrenciesList currencies={currenciesData} />

      <ExchangeRate
        usedCurrencies={usedCurrencies}
        open={isExchangeRateOpen}
        onOpenChange={setIsExchangeRateOpen}
      />
    </div>
  );
}
