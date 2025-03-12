"use client";

import React from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { ChevronDown } from 'lucide-react';
import * as m from '@/paraglide/messages';

interface Option {
	value: string;
	label: string;
}

interface SearchableDropdownProps {
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	// noResultsText: string;
	buttonClassName?: string;
	popoverClassName?: string;
}

const StatusSearchDropdown: React.FC<SearchableDropdownProps> = ({
	options,
	value,
	onChange,
	open,
	onOpenChange,
	buttonClassName = "btn-combobox",
	popoverClassName = "pop-content"
}) => {
	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={buttonClassName}
					size="sm"
				>
					{value
						? options.find((option) => option.value === value)?.label
						: `${m.select_status()}`}
					<ChevronDown className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={popoverClassName}>
				<Command>
					<CommandInput
						placeholder={`${m.Search()} ${m.status_text()}`}
						className="h-9 text-xs"
					/>
					<CommandList>
						<CommandEmpty>No result found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={() => {
										onChange(option.value);
										onOpenChange(false);
									}}
									className="text-xs cursor-pointer"
								>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default StatusSearchDropdown;