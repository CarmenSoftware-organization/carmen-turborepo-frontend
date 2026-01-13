"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import NumberInput from "@/components/form-custom/NumberInput";
import { ExchangeRateItem } from "@/dtos/exchange-rate.dto";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface ExcDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ExchangeRateItem;
}

export default function ExcDialog({ open, onOpenChange, initialData }: ExcDialogProps) {
  const tCommon = useTranslations("Common");
  const tCurrency = useTranslations("Currency");

  const [exchangeRate, setExchangeRate] = useState<number>(initialData?.exchange_rate ?? 0);

  useEffect(() => {
    if (initialData) {
      setExchangeRate(initialData.exchange_rate);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit:", {
      currency_id: initialData?.currency_id,
      at_date: new Date().toISOString(),
      exchange_rate: exchangeRate,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-id="exchange-rate-dialog">
        <DialogHeader>
          <DialogTitle>{tCommon("edit")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{tCurrency("currency_code")}</Label>
            <Input value={initialData?.currency_code ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>{tCurrency("currency_exchange_rate")}</Label>
            <NumberInput value={exchangeRate} onChange={setExchangeRate} min={0} step={0.0001} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit">{tCommon("save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
