"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";

interface Props {
    readonly defaultValue: string;
    readonly onSearch: (value: string) => void;
    readonly placeholder?: string;
    readonly containerClassName?: string;
    readonly buttonClassName?: string;
}
export default function SearchInput({
    defaultValue,
    onSearch,
    placeholder,
    containerClassName = 'w-full md:w-1/3',
    buttonClassName = 'absolute right-0 top-0 h-full px-3',
}: Props) {
    const [inputValue, setInputValue] = useState(defaultValue);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const formElement = e.currentTarget.closest('form');
            if (formElement) {
                formElement.requestSubmit();
            }
        }
    };

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(event.currentTarget.search.value);
    };

    const handleClear = () => {
        setInputValue('');
        onSearch('');
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <form onSubmit={handleSearch} className="flex gap-2 w-full">
            <div className={`relative ${containerClassName}`}>
                <Input
                    name="search"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className='h-8 pr-10 text-xs'
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={inputValue ? handleClear : undefined}
                    className={buttonClassName}
                    aria-label={inputValue ? 'Clear search' : 'Search'}
                >
                    {inputValue ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </form>
    )
}
