import React, { forwardRef } from "react";
import { Label } from "../../ui/label";
import { cn } from "cn";
import { Input } from "../../ui/input";

export interface AppFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  wrapperClassName?: string;
}

const AppField = forwardRef<HTMLInputElement, AppFieldProps>(
  (
    {
      label,
      error,
      append,
      prepend,
      className,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={cn("space-y-1.5", wrapperClassName)}>
        <Label
          htmlFor={props.id || props.name}
          className={cn(hasError && "text-destructive")}
        >
          {label}
        </Label>

        <div className="relative">
          {prepend && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10 text-muted-foreground">
              {prepend}
            </div>
          )}

          <Input
            ref={ref}
            id={props.id || props.name}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.name}-error` : undefined}
            className={cn(
              prepend && "pl-10",
              append && "pr-10",
              hasError && "border-destructive focus-visible:ring-destructive/20",
              className
            )}
            {...props}
          />

          {append && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-10 text-muted-foreground">
              {append}
            </div>
          )}
        </div>

        {hasError && (
          <p
            id={`${props.name}-error`}
            role="alert"
            className="text-sm font-medium text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AppField.displayName = "AppField";

export default AppField;
