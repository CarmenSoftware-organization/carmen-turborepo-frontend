import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropsLookup } from "@/dtos/lookup.dto";
import { CurrencyGetDto } from "@/dtos/currency.dto";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllApiRequest } from "@/lib/config.api";
import { backendApi } from "@/lib/backend-api";
import { useAuth } from "@/context/AuthContext";

export default function CurrencyLookup({
  value,
  onValueChange,
  placeholder = "Select currency",
  disabled = false,
}: Readonly<PropsLookup>) {
  const { token, buCode } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["currencies", buCode, searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('🌐 Fetching currencies:', { pageParam, searchTerm });
      if (!token || !buCode) {
        throw new Error("Unauthorized: Missing token or buCode");
      }
      const result = await getAllApiRequest(
        `${backendApi}/api/config/currencies`,
        token,
        buCode,
        "Error fetching currency",
        {
          page: pageParam,
          perpage: 5,
          search: searchTerm,
        }
      );
      console.log('✅ API Response:', {
        pageParam,
        dataLength: result?.data?.length || 0,
        hasData: !!result?.data
      });
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

  const currenciesData = useMemo(() => {
    const result = data?.pages?.flatMap(page => page?.data || []) ?? [];
    console.log('📊 Currencies data:', {
      totalPages: data?.pages?.length || 0,
      totalItems: result.length,
      hasNextPage,
      isFetchingNextPage
    });
    return result;
  }, [data, hasNextPage, isFetchingNextPage]);

  const selectedCurrencyName = useMemo(() => {
    if (!value || !currenciesData || !Array.isArray(currenciesData)) return null;
    const found = currenciesData.find((currency) => currency.id === value);
    return found?.code ?? null;
  }, [value, currenciesData]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;

    if (scrollBottom <= 5 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearchChange = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

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
        rootMargin: '50px',
        root: null,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, open, searchTerm]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value && selectedCurrencyName ? selectedCurrencyName : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search currency..."
            className="w-full pr-10"
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
          <CommandList
            ref={scrollRef}
            onScroll={handleScroll}
            className="max-h-[200px] overflow-y-auto"
          >
            {isLoading && currenciesData.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <CommandEmpty>No currencies found.</CommandEmpty>
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
                          className="h-8 w-full flex items-center justify-center text-xs text-gray-400 border-t border-gray-200"
                        >
                          📄 Load more currencies...
                        </div>
                      )}
                      {isFetchingNextPage && (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          <span className="ml-2 text-sm text-gray-500">Loading more...</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <CommandItem disabled>No currencies available.</CommandItem>
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
