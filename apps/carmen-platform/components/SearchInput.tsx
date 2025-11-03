"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
  readonly defaultValue: string;
  readonly onSearch: (value: string) => void;
  readonly placeholder?: string;
  readonly buttonClassName?: string;
}
export default function SearchInput({
  defaultValue,
  onSearch,
  placeholder,
  buttonClassName = "absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent hover:text-muted-foreground/80",
}: Props) {
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
    <div className="relative w-full md:w-[405px]">
      <Input
        name="search"
        placeholder={placeholder || "Search..."}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="h-8 pr-10 w-full border border-border"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={inputValue ? handleClear : handleSearch}
        className={buttonClassName}
        aria-label={inputValue ? "Clear search" : "Search"}
      >
        {inputValue ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
      </Button>
    </div>
  );
}
