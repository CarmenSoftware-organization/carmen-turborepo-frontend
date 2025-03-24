type RenderFunction<T> = (value: T[keyof T], item?: T) => React.ReactNode;
export interface FieldConfig<T> {
	key: keyof T;
	label: string;
	type?: 'text' | 'date' | 'amount' | 'badge' | 'custom' | 'decimal';
	render?: RenderFunction<T>;
	width?: string;
	align?: 'left' | 'center' | 'right';
	className?: string;
}

export type SortDirection = 'asc' | 'desc';

export type SortQuery = `${string}:${SortDirection}` | '';


