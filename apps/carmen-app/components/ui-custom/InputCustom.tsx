"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { forwardRef, useState, useEffect, useRef, ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  id?: string;
  label: string;
  labelPlacement?: 'top' | 'left' | 'right' | 'inside';
  error?: string;
  isRequired?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  showPasswordToggle?: boolean;
}

const InputCustom = forwardRef<HTMLInputElement, InputProps>(({
  id,
  label,
  labelPlacement = 'top',
  placeholder = '',
  className = '',
  required = false,
  isRequired = false,
  error,
  disabled = false,
  startContent,
  endContent,
  minLength,
  maxLength,
  pattern,
  type = 'text',
  showPasswordToggle = true,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Handle the ref
  const handleRef = (element: HTMLInputElement) => {
    inputRef.current = element;

    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  // Check initial value immediately and when value/defaultValue changes
  useEffect(() => {
    const checkValue = () => {
      // For controlled components
      if (value !== undefined && value !== null) {
        setHasValue(String(value).length > 0);
      }
      // For uncontrolled with defaultValue
      else if (defaultValue !== undefined && defaultValue !== null) {
        setHasValue(String(defaultValue).length > 0);
      }
      // For uncontrolled with current DOM value
      else if (inputRef.current) {
        setHasValue(inputRef.current.value.trim().length > 0);
      }
    };

    // Initial check
    checkValue();

    // Setup a small delay to ensure the DOM is updated
    const timer = setTimeout(checkValue, 0);

    return () => clearTimeout(timer);
  }, [value, defaultValue]);

  // Use isRequired over required if provided
  const inputIsRequired = isRequired || required;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHasValue(newValue.trim().length > 0);

    if (onChange) {
      onChange(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);

    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);

    // Check if input is empty when blurring
    const isEmpty = e.target.value.trim().length === 0;
    setHasValue(!isEmpty);

    if (onBlur) {
      onBlur(e);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  // Generate a unique ID if not provided
  const inputId = id ?? `input-${Math.random().toString(36).substring(2, 9)}`;

  // Determine if we should show the password toggle
  const isPassword = type === 'password';
  const shouldShowPasswordToggle = isPassword && showPasswordToggle;

  // Determine actual input type
  const actualType = isPassword && showPassword ? 'text' : type;

  // Calculate if we need top padding for the input when label is inside
  const needsTopPadding = labelPlacement === 'inside' && (focused || hasValue);

  // Shrink label when focused OR has value
  const shouldShrinkLabel = focused || hasValue;

  const renderPasswordToggle = () => {
    if (!shouldShowPasswordToggle) return null;

    return (
      <button
        type="button"
        onClick={handleTogglePassword}
        className="cursor-pointer"
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleTogglePassword()}
      >
        {showPassword ?
          <EyeOff className="h-4 w-4 text-gray-500" /> :
          <Eye className="h-4 w-4 text-gray-500" />
        }
      </button>
    );
  };

  const renderInput = () => (
    <div className="relative flex items-center w-full">
      {startContent && (
        <div className="absolute left-3 flex items-center pointer-events-none">
          {startContent}
        </div>
      )}
      <Input
        id={inputId}
        ref={handleRef}
        placeholder={labelPlacement === 'inside' && label ? '' : placeholder}
        className={cn(
          labelPlacement === 'left' && 'ml-2',
          labelPlacement === 'right' && 'mr-2',
          needsTopPadding && 'pt-4',
          startContent && 'pl-10',
          (endContent || shouldShowPasswordToggle) && 'pr-10',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        disabled={disabled}
        required={inputIsRequired}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        type={actualType}
        value={value}
        defaultValue={defaultValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInputChange}
        {...props}
      />
      <div className="absolute right-3 flex items-center">
        {shouldShowPasswordToggle && renderPasswordToggle()}
        {!shouldShowPasswordToggle && endContent}
      </div>
    </div>
  );

  const renderLabel = () => {
    if (!label) return null;

    return (
      <Label
        htmlFor={inputId}
        className={cn(
          'transition-all duration-200',
          labelPlacement === 'top' && 'block mb-2',
          labelPlacement === 'left' && 'flex items-center mr-2',
          labelPlacement === 'right' && 'flex items-center ml-2',
          labelPlacement === 'inside' && 'absolute left-3 pointer-events-none',
          labelPlacement === 'inside' && shouldShrinkLabel && 'text-[10px] top-1',
          labelPlacement === 'inside' && !shouldShrinkLabel && 'top-3',
          focused && labelPlacement === 'inside' && !error,
          error && 'text-red-500'
        )}
      >
        {label}
        {inputIsRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <div className="text-red-500 text-sm mt-1">{error}</div>
    );
  };

  if (labelPlacement === 'inside') {
    return (
      <div className="relative">
        <div className="relative">
          {renderInput()}
          {renderLabel()}
        </div>
        {renderError()}
      </div>
    );
  }

  if (labelPlacement === 'left') {
    return (
      <div className="w-full">
        <div className="flex items-center">
          {renderLabel()}
          {renderInput()}
        </div>
        {renderError()}
      </div>
    );
  }

  if (labelPlacement === 'right') {
    return (
      <div className="w-full">
        <div className="flex items-center">
          {renderInput()}
          {renderLabel()}
        </div>
        {renderError()}
      </div>
    );
  }

  // Default to top
  return (
    <div className="w-full">
      {renderLabel()}
      {renderInput()}
      {renderError()}
    </div>
  );
});

InputCustom.displayName = 'InputCustom';

export default InputCustom;