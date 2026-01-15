"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import NumberInput from "@/components/form-custom/NumberInput";
import { ExchangeRateItem } from "@/dtos/exchange-rate.dto";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useExchangeRateUpdate } from "@/hooks/use-exchange-rate";
import { useAuth } from "@/context/AuthContext";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ExchangeRateItem;
}

export default function ExchangeRateDialog({ open, onOpenChange, initialData }: Props) {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tCurrency = useTranslations("Currency");
  const tExchangeRate = useTranslations("ExchangeRate");

  const [exchangeRate, setExchangeRate] = useState<number>(initialData?.exchange_rate ?? 0);

  const { mutate: updateExchangeRate, isPending } = useExchangeRateUpdate(
    token,
    buCode,
    initialData?.id ?? ""
  );

  useEffect(() => {
    if (initialData) {
      setExchangeRate(initialData.exchange_rate);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateExchangeRate(
      { exchange_rate: exchangeRate },
      {
        onSuccess: () => {
          toastSuccess({ message: tExchangeRate("update_success") });
          onOpenChange(false);
        },
        onError: () => {
          toastError({ message: tExchangeRate("update_error") });
        },
      }
    );
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {tCommon("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
