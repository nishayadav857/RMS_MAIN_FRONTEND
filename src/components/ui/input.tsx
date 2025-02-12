import * as React from "react";
import { cn } from "../../lib/utils"; // Adjusted import path


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn("border rounded-md p-2", className)} // Add your desired styles
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
