"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { BusinessUnit, NumberFormat } from "@/types/auth.types";

interface BuConfigContextType {
  dateFormat: string;
  dateTimeFormat: string;
  longTimeFormat: string;
  shortTimeFormat: string;
  timezone: string | null;
  perpage: number | null;
  amount: NumberFormat | null;
  quantity: NumberFormat | null;
  recipe: NumberFormat | null;
  defaultCurrencyId: string | null;
  currencyBase: string;
}

const BuConfigContext = createContext<BuConfigContextType>({
  dateFormat: "yyyy-MM-dd",
  dateTimeFormat: "yyyy-MM-dd HH:mm",
  longTimeFormat: "HH:mm:ss",
  shortTimeFormat: "HH:mm",
  timezone: null,
  perpage: null,
  amount: null,
  quantity: null,
  recipe: null,
  defaultCurrencyId: null,
  currencyBase: "THB",
});

export function BuConfigProvider({ children }: { readonly children: ReactNode }) {
  const { user } = useAuth();

  const value = useMemo(() => {
    const defaultBu = user?.data.business_unit?.find(
      (bu: BusinessUnit) => bu.is_default === true
    );
    const firstBu = user?.data.business_unit?.[0];
    const selectedBu = defaultBu || firstBu;
    const config = selectedBu?.config;

    return {
      dateFormat: config?.date_format || "yyyy-MM-dd",
      dateTimeFormat: config?.date_time_format || "yyyy-MM-dd HH:mm",
      longTimeFormat: config?.long_time_format || "HH:mm:ss",
      shortTimeFormat: config?.short_time_format || "HH:mm",
      perpage: config?.perpage_format?.default ?? null,
      timezone: config?.timezone || null,
      amount: config?.amount_format || null,
      quantity: config?.quantity_format || null,
      recipe: config?.recipe_format || null,
      defaultCurrencyId: config?.default_currency_id || null,
      currencyBase: config?.default_currency?.code || "THB",
    };
  }, [user]);

  return <BuConfigContext.Provider value={value}>{children}</BuConfigContext.Provider>;
}

export function useBuConfig() {
  return useContext(BuConfigContext);
}
