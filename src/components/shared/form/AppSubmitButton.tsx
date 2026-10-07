import React from "react";
import { Button } from "@/src/components/ui/button";
import { cn } from "cn";
import { Loader2 } from "lucide-react";

export interface AppSubmitButtonProps extends React.ComponentProps<typeof Button> {
  isPending: boolean;
  pendingLabel?: React.ReactNode;
}

const AppSubmitButton = React.forwardRef<
  HTMLButtonElement,
  AppSubmitButtonProps
>(
  (
    {
      isPending,
      children,
      pendingLabel = "Submitting...",
      className,
      disabled,
      type = "submit",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isPending;

    return (
      <Button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn("w-full", className)}
        {...props}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            {pendingLabel ? pendingLabel : children}
          </>
        ) : (
          children
        )}
      </Button>
    );
  },
);

AppSubmitButton.displayName = "AppSubmitButton";

export default AppSubmitButton;
