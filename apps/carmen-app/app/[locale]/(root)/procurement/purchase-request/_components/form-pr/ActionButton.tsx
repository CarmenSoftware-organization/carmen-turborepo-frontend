import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { memo } from "react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Reusable action button component with consistent styling
 * Memoized to prevent unnecessary re-renders
 */
const ActionButton = memo(function ActionButton({
  icon: Icon,
  label,
  onClick,
  className = "",
  disabled = false,
  size = "sm",
}: ActionButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <Button
      size={size}
      type="button"
      className={`h-7 ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  );
});

export default ActionButton;
