import React from "react";
import Image from "next/image";
import { cva } from "class-variance-authority";
import cn from "@/utils/shadcn";
import calendarIcon from "@/assets/history/filter-date.svg";
import dropdownIcon from "@/assets/history/dropdown.svg";
import googleIcon from "../assets/login/google-icon.svg";
import leftArrowIcon from "@/assets/history/left-arrow.svg";
import rightArrowIcon from "@/assets/history/right-arrow.svg";
import hidePasswordIcon from "@/assets/login/eye-icon-close.svg";
import showPasswordIcon from "@/assets/login/eye-icon-open.svg";
import search from "@/assets/otcpage/search-icon.svg";
import { TOKEN_ICONS } from "@/utils/misc";

function IconOld({ src, alt }) {
  return (
    <Image
      width={12}
      height={12}
      className="absolute right-4 top-6 font-mono text-xs font-medium text-gray-400"
      src={src}
      alt={alt}
    />
  );
}

export function DropdownIcon() {
  return <IconOld src={dropdownIcon.src} alt="dropdown" />;
}

const iconVariants = cva("relative", {
  variants: {
    size: {
      regular: "h-5 w-5",
      compact: "h-4 w-4",
    },
  },
  defaultVariants: {
    size: "regular",
  },
});

export function Icon({ src, alt, size, className, ...props }) {
  return (
    <div className={cn(iconVariants({ size, className }))}>
      <Image src={src} alt={alt} fill {...props} />
    </div>
  );
}

export function CalendarIcon({ ...props }) {
  return <Icon src={calendarIcon.src} alt="calendar" {...props} />;
}

export function GoogleIcon() {
  return <Icon src={googleIcon.src} alt="Google icon" />;
}

export function ShowHideIcon({ ...props }) {
  return (
    <Icon
      src={props.controllIcon ? showPasswordIcon.src : hidePasswordIcon.src}
      alt="Show password"
      {...props}
    />
  );
}

export function HidePasswordIcon({ ...props }) {
  return <Icon src={hidePasswordIcon.src} alt="Hide password" {...props} />;
}

export function AssetIcon({ size, symbol, className }) {
  return (
    <Icon
      className={className}
      size={size}
      src={TOKEN_ICONS[symbol]}
      alt={symbol}
    />
  );
}

export function LeftArrowIcon({ size, className }) {
  return (
    <Icon
      src={leftArrowIcon.src}
      size={size}
      alt="arrow Icon"
      className={className}
    />
  );
}

export function RightArrowIcon({ size, className }) {
  return (
    <Icon
      src={rightArrowIcon.src}
      size={size}
      alt="arrow Icon"
      className={className}
    />
  );
}

export function InputSearch({ size, className }) {
  return (
    <Icon
      src={search.src}
      size={size}
      alt="search Icon"
      className={className}
    />
  );
}
