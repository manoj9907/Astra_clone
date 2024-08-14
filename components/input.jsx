// Adapted from: https://ui.shadcn.com/docs/components/input

import * as React from "react";

import { cva } from "class-variance-authority";
import cn from "@/utils/shadcn";
import AssetBadge from "./badges";

const inputVariants = cva(
  "flex w-full border-gray-400/50 bg-black px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-100",
  {
    variants: {
      size: {
        regular: "h-10 text-sm",
        // We have to add bottom padding because otherwise, the text inside the input does not
        // appear vertically centered, and there doesn't appear to be a way to change this using
        // standard layout techniques.
        compact: "h-7 text-xs pb-2.5",
      },
    },
    defaultVariants: {
      size: "regular",
    },
  },
);

// Basically the Input component but without the border-related styling. This is used to build
// other input-related components, it is usually not used directly in UI code. You should use
// Input/InputWithUnits/etc instead.
const InputCore = React.forwardRef(
  ({ className, type, size, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
InputCore.displayName = "InputCore";

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <InputCore
    className={cn("rounded-md border", className)}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

function InputWithUnits({ className, size, symbol, inputWidth }) {
  return (
    <div
      className={cn(
        "gap-0.25 flex flex-row items-center border-gray-400/50",
        className,
      )}
    >
      <InputCore
        size={size}
        className={cn(
          "rounded-l-md border-y border-l border-r border-inherit",
          inputWidth,
        )}
        type="number"
        placeholder="0"
      />
      <AssetBadge className="border-y border-r" size={size} symbol={symbol} />
    </div>
  );
}

export { Input, InputWithUnits };
