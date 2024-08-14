import * as React from "react";
import Image from "next/image";

import { TOKEN_ICONS } from "@/utils/misc";

import dropdownIcon from "@/assets/history/dropdown.svg";
import switchIcon from "@/assets/otcpage/switch-div.svg";
import DivButton from "@/components/buttons/buttons";
import "./input.css";

export function InputSm() {
  return (
    <div className="flex h-9 w-full rounded-md border border-gray-400/50 text-xs">
      <input
        type="number"
        className="shadcn-number-input order-first h-9 grow border-inherit bg-inherit pl-2 placeholder:text-gray-400/50 focus:outline-none"
        placeholder="0"
      />
    </div>
  );
}

export function InputWithUnitsSm({ className, symbol }) {
  return (
    <div className={`${className} flex h-9 w-full text-xs`}>
      <input
        type="number"
        className="shadcn-number-input order-first h-9 w-1/2 rounded-l-md border border-gray-400/50  bg-inherit pl-2 placeholder:text-gray-400/50 focus:outline-none"
        placeholder="0"
      />
      <AssetBadgeSm
        className="rounded-r-md border-y border-r border-gray-400/50 px-2"
        symbol={symbol}
      />
    </div>
  );
}

export function InputWithUnitsLg({
  className,
  symbol,
  placeholder,
  value,
  onChange,
  onDropdownClick,
}) {
  return (
    <div
      className={`${className} flex h-20 w-full rounded-md border border-gray-400/50 text-2xl `}
    >
      <input
        type="number"
        className="order-first w-[70%] grow border-r border-inherit bg-inherit pl-4 placeholder:text-gray-400/50 focus:outline-none sm:w-auto"
        placeholder={placeholder ?? "0"}
        value={value ?? ""}
        onChange={onChange}
      />
      <DivButton
        className="flex w-[30%]  flex-nowrap items-center justify-center gap-2 hover:bg-gray-400/10 sm:w-auto sm:flex-nowrap sm:px-3"
        onClick={onDropdownClick}
      >
        <AssetBadgeLg className="place-self-center" symbol={symbol} />
        <DropdownIconLg />
      </DivButton>
    </div>
  );
}

export function AssetIconSm({ className, symbol }) {
  return (
    <Image
      height={10}
      width={10}
      className={`${className} inline h-4 w-4`}
      src={TOKEN_ICONS[symbol]}
      alt={symbol}
    />
  );
}

export function AssetIconLg({ className, symbol }) {
  return (
    <Image
      height={10}
      width={10}
      className={`${className} inline h-6 w-6`}
      src={TOKEN_ICONS[symbol]}
      alt={symbol}
    />
  );
}

export function AssetBadgeSm({ className, symbol }) {
  return (
    <div
      className={`${className} flex h-full flex-nowrap items-center ${className === ("justify-start" || "justify-center") ? className : "justify-end"} `}
    >
      <AssetIconSm className="mr-1 sm:mr-2" symbol={symbol} />
      <span className="text-xs">{symbol}</span>
    </div>
  );
}

export function AssetBadgeLg({ className, symbol }) {
  return (
    <div className={`${className} flex flex-nowrap items-center`}>
      <AssetIconLg className="mr-1 sm:mr-2" symbol={symbol} />
      <span className="text-xs">{symbol}</span>
    </div>
  );
}

export function DropdownIconLg({ className }) {
  return (
    <Image
      height={10}
      width={10}
      className={`${className} h-3 w-3`}
      src={dropdownIcon.src}
      alt="down-arrow"
    />
  );
}

export function VerticalSwitchIconLg({ className, rotation, onClick }) {
  return (
    <Image
      height={10}
      width={10}
      className={`${className} h-6 w-6`}
      src={switchIcon.src}
      alt="Switch"
      onClick={onClick}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.5s ease",
      }}
    />
  );
}
