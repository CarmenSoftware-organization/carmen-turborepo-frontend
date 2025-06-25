interface UnitLookupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function UnitLookup({
  value = "",
  onValueChange,
  placeholder = "Search unit...",
  className = "",
}: UnitLookupProps) {
  return (
    <div>
      <h1>Unit Lookup</h1>
    </div>
  );
}
