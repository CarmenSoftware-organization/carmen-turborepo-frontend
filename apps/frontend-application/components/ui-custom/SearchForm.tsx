import React, { KeyboardEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchFormProps {
	defaultValue: string;
	onSearch: (value: string) => void;
	placeholder?: string;
	containerClassName?: string;
	buttonClassName?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({
	defaultValue = '',
	placeholder = '',
	containerClassName = 'w-full md:w-1/3',
	buttonClassName = 'absolute right-0 top-0 h-full px-3',
	onSearch,
}) => {
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
	);
};

export default SearchForm;
