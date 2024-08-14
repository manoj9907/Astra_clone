import { cva } from "class-variance-authority";
import cn from "@/utils/shadcn";
import { AssetIcon } from "./icons";

const assetBadgeVariants = cva(
  // The border-related classes below are only triggered if the border is set using something like
  // "border" or "border-r" in the className prop when instantiated.
  "inline-flex items-center w-fit rounded-r-md border-inherit",
  {
    variants: {
      size: {
        regular: "gap-2.5 px-2.5 py-2 text-sm",
        compact: "h-7 gap-2 px-2 py-1.5 text-xs",
      },
    },
    defaultVariants: {
      size: "regular",
    },
  },
);

export default function AssetBadge({ size, symbol, className }) {
  return (
    <span className={cn(assetBadgeVariants({ size, className }))}>
      <AssetIcon size={size} symbol={symbol} />
      {symbol}
    </span>
  );
}
