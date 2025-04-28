"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { forwardRef, useState, ChangeEvent, InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  id?: string;
  label: string;
  labelPlacement?: 'top' | 'left' | 'right' | 'inside';
  error?: string;
}

const InputCustom = forwardRef<HTMLInputElement, InputProps>(({
  id,
  label,
  labelPlacement = 'top',
  placeholder = '',
  className = '',
  required = false,
  error,
  disabled = false,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Generate a unique ID if not provided
  const inputId = id ?? `input-${Math.random().toString(36).substring(2, 9)}`;

  const renderInput = () => (
    <Input
      id={inputId}
      ref={ref}
      placeholder={labelPlacement === 'inside' && label ? '' : placeholder}
      className={cn(
        labelPlacement === 'left' && 'ml-2',
        labelPlacement === 'right' && 'mr-2',
        labelPlacement === 'inside' && 'pt-4',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      disabled={disabled}
      required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChange={handleInputChange}
      {...props}
    />
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
          labelPlacement === 'inside' && (focused || hasValue) ? 'text-[10px] top-1' : 'top-3',
          error && 'text-red-500'
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
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