import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import type * as React from "react";
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
import { CurrencyGetDto } from "@/dtos/currency.dto";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllApiRequest } from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export default function CurrencyLookup({
  value,
  onValueChange,
  placeholder = "",
  disabled = false,
}: Readonly<PropsLookup>) {
  const { token, buCode } = useAuth();
  const t = useTranslations("Currency");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const scrollRef = useRef<React.ComponentRef<typeof CommandList>>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ["currencies", buCode, debouncedSearchTerm],
      queryFn: async ({ pageParam = 1 }) => {
        if (!token || !buCode) {
          throw new Error("Unauthorized: Missing token or buCode");
        }
        const result = await getAllApiRequest(
          `${backendApi}/api/config/${buCode}/currencies`,
          token,
          "Error fetching currency",
          {
            page: pageParam,
            perpage: 5,
            search: debouncedSearchTerm,
          }
        );
        return result;
      },
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage?.data || lastPage.data.length < 5) {
          return undefined;
        }
        return allPages.length + 1;
      },
      enabled: !!token && !!buCode,
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  const currenciesData: CurrencyGetDto[] = useMemo(() => {
    const result = data?.pages?.flatMap((page) => page?.data || []) ?? [];
    return result;
  }, [data]);

  const selectedCurrencyName = useMemo(() => {
    if (!value || !currenciesData || !Array.isArray(currenciesData)) return null;
    const found = currenciesData.find((currency) => currency.id === value);
    return found?.code ?? null;
  }, [value, currenciesData]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;

      if (scrollBottom <= 5 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage || !open) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        root: null,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, open, debouncedSearchTerm]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value && selectedCurrencyName ? selectedCurrencyName : t("select_currency")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t("search_placeholder")}
            className="w-full pr-10"
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
          <CommandList
            ref={scrollRef}
            onScroll={handleScroll}
            className="max-h-[200px] overflow-y-auto"
          >
            {(() => {
              if (error) {
                return (
                  <div className="flex items-center justify-center py-6 text-red-500">
                    <span>{t("load_error")}</span>
                  </div>
                );
              }

              if (isLoading && currenciesData.length === 0) {
                return (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                );
              }

              return (
                <>
                  <CommandEmpty>{t("notFoundCurrency")}</CommandEmpty>
                  <CommandGroup>
                    {currenciesData && currenciesData.length > 0 ? (
                      <>
                        {currenciesData.map((currency: CurrencyGetDto) => (
                          <CommandItem
                            key={currency.id}
                            value={`${currency.code}-${currency.id}`}
                            onSelect={() => {
                              if (currency.id) {
                                onValueChange(currency.id);
                              }
                              setOpen(false);
                            }}
                          >
                            {currency.code}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                value === currency.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                        {hasNextPage && (
                          <div
                            ref={loadMoreRef}
                            className="h-8 w-full flex items-center justify-center text-xs text-gray-400 border-t border-border"
                          >
                            {t("load_more_currencies")}
                          </div>
                        )}
                        {isFetchingNextPage && (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        )}
                      </>
                    ) : (
                      <CommandItem disabled>{t("notFoundCurrency")}</CommandItem>
                    )}
                  </CommandGroup>
                </>
              );
            })()}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
