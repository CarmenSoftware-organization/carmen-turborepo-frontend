import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    Icon?: React.ComponentType<{ className?: string }>;
    variant?: "prefix" | "suffix";
    className?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(({
    placeholder,
    value,
    onChange,
    onKeyDown,
    Icon,
    variant = "prefix",
    className,
}, ref) => {
    return (
        <div className="relative flex items-center w-full lg:w-2/4">
            {variant === "prefix" && Icon && (
                <div className="absolute left-3 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
            <Input
                ref={ref}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className={cn(
                    variant === "prefix" && "pl-10",
                    variant === "suffix" && "pr-10",
                    className
                )}
            />
            {variant === "suffix" && Icon && (
                <div className="absolute right-3 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
        </div>
    );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;