import { Input } from "@/components/ui/input";

interface InputNumberProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  showContent?: boolean;
  permission?: "view" | "edit" | "view-edit";
  viewStage?: "enable" | "disable" | "hidden";
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
      className="text-right"
      onFocus={e => e.target.select()}
    />
  );
}
