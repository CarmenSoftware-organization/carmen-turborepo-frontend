export interface PropsLookup {
  readonly value?: string;
  readonly onValueChange: (value: string) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly classNames?: string;
  readonly excludeIds?: string[];
  readonly bu_code?: string;
}
