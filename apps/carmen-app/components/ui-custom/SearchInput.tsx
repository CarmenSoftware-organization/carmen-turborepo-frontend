"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface Props {
  readonly defaultValue: string;
  readonly onSearch: (value: string) => void;
  readonly placeholder?: string;
  readonly containerClassName?: string;
  readonly buttonClassName?: string;
  readonly inputClassName?: string;
}
export default function SearchInput({
  defaultValue,
  onSearch,
  placeholder,
  containerClassName = "w-full md:w-[405px]",
  buttonClassName = "absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent hover:text-muted-foreground/80",
  inputClassName = "",
}: Props) {
  const tCommon = useTranslations("Common");

  const [inputValue, setInputValue] = useState(defaultValue);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(e.currentTarget.value);
    }
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="flex gap-2">
      <div className={`relative ${containerClassName}`}>
        <Input
          name="search"
          placeholder={placeholder || tCommon("search")}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(inputClassName)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={inputValue ? handleClear : handleSearch}
          className={buttonClassName}
          aria-label={inputValue ? "Clear search" : "Search"}
        >
          {inputValue ? (
            <X className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
}
