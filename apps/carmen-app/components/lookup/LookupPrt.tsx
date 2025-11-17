"use client";

import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropsLookup } from "@/dtos/lookup.dto";
import { useAuth } from "@/context/AuthContext";
import { PriceListTemplateListDto } from "@/dtos/price-list-template.dto";
import { useTranslations } from "next-intl";
import { usePriceListTemplates } from "@/hooks/use-price-list-template";

interface PriceListTemplateLookupProps extends Omit<PropsLookup, "onValueChange"> {
  onValueChange: (value: string, selectedTemplate?: PriceListTemplateListDto) => void;
}

export default function LookupPrt({
  value,
  onValueChange,
  disabled = false,
  classNames = "",
}: Readonly<PriceListTemplateLookupProps>) {
  const [open, setOpen] = useState(false);
  const { token, buCode } = useAuth();
  const t = useTranslations("Modules.PriceListTemplate");
  const { data, isLoading } = usePriceListTemplates(token, buCode);

  const selectPrt = useMemo(() => {
    if (!value || !data || !Array.isArray(data)) return null;
    const found = data.find((prt) => prt.id === value);
    return found?.name ?? null;
  }, [value, data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={classNames}>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          title={value && selectPrt ? selectPrt : t("select_template")}
        >
          <span className="truncate text-muted-foreground/90">
            {selectPrt ?? t("select_template")}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command
          filter={(value, search) => {
            if (!search) return 1;
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder={t("search_template")} className="w-full pr-10" />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <CommandEmpty>{t("template_not_found")}</CommandEmpty>
                <CommandGroup>
                  {data && data.length > 0 ? (
                    data.map((template: PriceListTemplateListDto) => (
                      <CommandItem
                        key={template.id}
                        value={template.name}
                        onSelect={() => {
                          if (template.id) {
                            onValueChange(template.id, template);
                          }
                          setOpen(false);
                        }}
                      >
                        {template.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === template.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>{t("no_templates_available")}</CommandItem>
                  )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
