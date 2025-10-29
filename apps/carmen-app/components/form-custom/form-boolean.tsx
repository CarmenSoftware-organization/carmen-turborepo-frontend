import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FormBooleanProps {
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
  readonly label: string;
  readonly positionLabel?: "left" | "right" | "top" | "bottom";
  readonly type?: "switch" | "checkbox";
  readonly disabled?: boolean;
  readonly classNames?: string;
  readonly required?: boolean;
}

export default function FormBoolean({
  value,
  onChange,
  label,
  positionLabel = "right",
  type = "switch",
  disabled = false,
  classNames,
  required = false,
}: FormBooleanProps) {
  const controlId = `form-boolean-${type}`;

  const renderControl = () =>
    type === "switch" ? (
      <Switch
        id={controlId}
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
        className={classNames}
      />
    ) : (
      <Checkbox
        id={controlId}
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
        className={classNames}
      />
    );

  const renderLabel = () => (
    <Label htmlFor={controlId} className="cursor-pointer">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </Label>
  );

  switch (positionLabel) {
    case "top":
      return (
        <div className="flex flex-col gap-2">
          {renderLabel()}
          <div className="flex justify-start">{renderControl()}</div>
        </div>
      );

    case "bottom":
      return (
        <div className="flex flex-col gap-2">
          <div className="flex justify-start">{renderControl()}</div>
          {renderLabel()}
        </div>
      );

    case "right":
      return (
        <div className="flex items-center gap-2">
          {renderControl()}
          {renderLabel()}
        </div>
      );

    case "left":
    default:
      return (
        <div className="flex items-center gap-2">
          {renderLabel()}
          {renderControl()}
        </div>
      );
  }
}
