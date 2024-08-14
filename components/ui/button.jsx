import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import cn from "@/utils/shadcn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-gray-930 font-mono rounded-sm shadow",
  {
    variants: {
      variant: {
        primary:
          "bg-gray-100 text-gray-950 hover:bg-gray-300 active:bg-gray-400",
        green:
          "bg-green-600 text-gray-970 hover:bg-green-700 active:bg-green-800 disabled:bg-green-900",
        red: "bg-red-600 text-gray-970 hover:bg-red-700 active:bg-red-800 disabled:bg-red-900",
        outline: "bg-zinc-800",
        ghost:
          "hover:bg-zinc-800 disabled:bg-transparent disabled:text-gray-950",
      },
      size: {
        regular: "h-10 min-w-28 px-4 text-sm",
        compact: "h-7 min-w-28 px-4 text-xs",
        icon: "h-7 w-7",
        default: "h-7 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "regular",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
