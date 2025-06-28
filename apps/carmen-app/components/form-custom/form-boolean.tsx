import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FormBooleanProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  positionLabel?: "left" | "right" | "top" | "bottom";
  type?: "switch" | "checkbox";
  disabled?: boolean;
}

export default function FormBoolean({
  value,
  onChange,
  label,
  positionLabel = "right",
  type = "switch",
  disabled = false,
}: FormBooleanProps) {
  const controlId = `form-boolean-${type}`;

  const renderControl = () =>
    type === "switch" ? (
      <Switch
        id={controlId}
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    ) : (
      <Checkbox id={controlId} checked={value} onCheckedChange={onChange} disabled={disabled} />
    );

  const renderLabel = () => (
    <Label htmlFor={controlId} className="text-sm font-medium cursor-pointer">
      {label}
    </Label>
  );

  switch (positionLabel) {
    case "top":
      return (
        <div className="flex flex-col space-y-2">
          {renderLabel()}
          <div className="flex justify-start">{renderControl()}</div>
        </div>
      );

    case "bottom":
      return (
        <div className="flex flex-col space-y-2">
          <div className="flex justify-start">{renderControl()}</div>
          {renderLabel()}
        </div>
      );

    case "right":
      return (
        <div className="flex items-center space-x-2">
          {renderControl()}
          {renderLabel()}
        </div>
      );

    case "left":
    default:
      return (
        <div className="flex items-center space-x-2">
          {renderLabel()}
          {renderControl()}
        </div>
      );
  }
}
