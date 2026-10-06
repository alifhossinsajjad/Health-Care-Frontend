import React, { forwardRef, useState } from "react";
import { Label } from "../../ui/label";
import { cn } from "cn";
import { Input } from "../../ui/input";
import { Eye, EyeOff } from "lucide-react";

export interface AppFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  wrapperClassName?: string;
}

const AppField = forwardRef<HTMLInputElement, AppFieldProps>(
  (
    { label, error, append, prepend, className, wrapperClassName, type, ...props },
    ref,
  ) => {
    const hasError = !!error;
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

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
            type={inputType}
            id={props.id || props.name}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.name}-error` : undefined}
            className={cn(
              prepend && "pl-10",
              (append || isPassword) && "pr-10",
              hasError && "border-destructive focus-visible:ring-destructive/20",
              className
            )}
            {...props}
          />

          {(append || isPassword) && (
            <div
              className={cn(
                "absolute inset-y-0 right-0 flex items-center pr-3 z-10 text-muted-foreground",
                !isPassword && "pointer-events-none" 
              )}
            >
              {isPassword ? (
                <button
                  type="button"
                  tabIndex={-1}
                  className="pointer-events-auto focus:outline-none hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              ) : (
                append
              )}
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
  },
);

AppField.displayName = "AppField";

export default AppField;
