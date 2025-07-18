import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputNumberProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly showContent?: boolean;
  readonly permission?: "view" | "edit" | "view-edit";
  readonly viewStage?: "enable" | "disable" | "hidden";
  readonly classNames?: string;
}

export default function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  placeholder,
  showContent = true,
  permission = "view-edit",
  viewStage = "enable",
  classNames,
}: InputNumberProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;

    if (inputValue === "" || inputValue === "-") {
      onChange(0);
      return;
    }

    const numericValue = parseFloat(inputValue);

    if (!isNaN(numericValue) && isFinite(numericValue)) {
      onChange(numericValue);
    }
  };

  const isHide = showContent || viewStage === "hidden";

  return (
    <Input
      type="number"
      value={showContent ? value.toString() : ""}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      disabled={
        disabled ||
        permission === "view" ||
        viewStage === "disable" ||
        showContent === false
      }
      placeholder={isHide ? placeholder : "••••••••"}
      readOnly={!showContent}
      className={cn("text-right", classNames)}
    />
  );
}
