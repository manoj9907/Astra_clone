import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// https://stackoverflow.com/questions/77932960/what-needs-to-be-added-to-path-lib-utils-when-tryinng-to-use-shadcn-ui-c
// https://github.com/shadcn-ui/ui/blob/bebc2843f0e0daa4e508def74fb3ba8a08e98f6f/apps/www/lib/utils.ts#L5C1-L6C1
export default function cn(...inputs) {
  return twMerge(clsx(inputs));
}
