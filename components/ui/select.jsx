import React, { useState } from "react";
import Image from "next/image";
import * as Dropdown from "@radix-ui/react-select";
// import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import cn from "@/utils/shadcn";
import downArrow from "@/assets/down-arrow.svg";
import upArrow from "@/assets/up-arrow.svg";

const variants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring  border border-gray-400/25 bg-transparent font-mono text-xs leading-none text-gray-300 shadow-[0_2px_10px] shadow-black/10 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black font-ibm-plex-mono cursor-pointer text-gray-400 disabled:cursor-not-allowed  h-9 px-4",
);
function Select({ selectLabel, value, handleDropdown, disabled, className }) {
  const [controllArrow, setControllArrow] = useState(false);
  return (
    <Dropdown.Root
      value={value}
      onValueChange={handleDropdown}
      disabled={disabled}
      onOpenChange={() => setControllArrow(!controllArrow)}
      className={cn(variants(), className)}
    >
      <Dropdown.Trigger className={cn(variants(), className)}>
        <div className="flex w-full items-center	justify-between text-start">
          <div className="flex flex-col">
            <Dropdown.Value placeholder="Select" className="text-gray-300" />
            {/* {addStaticval && (
              <span className="text-xs text-gray-400">{addStaticval}</span>
            )} */}
          </div>
          <Dropdown.Icon className="font-mono">
            <Image
              src={controllArrow ? upArrow : downArrow}
              height={10}
              width={10}
              alt="down-arrow"
              //  className="mt-0.5"
            />
          </Dropdown.Icon>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content
          position="popper"
          sideOffset={5}
          className="SelectContent max-h-36 overflow-y-auto rounded-md border border-gray-400/25 bg-black p-2"
        >
          {/* <Dropdown.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-white font-mono">
            <ChevronUpIcon />
          </Dropdown.ScrollUpButton> */}
          <Dropdown.Viewport className="font-mono text-sm font-normal">
            <Dropdown.Group>
              {selectLabel?.map((x) => (
                <SelectItem
                  value={x.value || x}
                  key={x.value || x}
                  imgage={x.image}
                  className="cursor-pointer"
                >
                  {x?.label || x?.text1 || x}
                </SelectItem>
              ))}
            </Dropdown.Group>
          </Dropdown.Viewport>
          {/* <Dropdown.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-white font-mono">
            <ChevronDownIcon />
          </Dropdown.ScrollDownButton> */}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

const SelectItem = React.forwardRef(
  ({ children, className, imgage, ...props }, forwardedRef) => (
    <Dropdown.Item
      className={cn(
        "relative flex h-2 w-full select-none items-center rounded px-1.5 py-4 font-mono text-xs leading-none text-gray-300  data-[highlighted]:bg-zinc-800 data-[highlighted]:outline-none",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Dropdown.ItemText className="text-start">
        <div>
          {imgage ? (
            <div className="flex items-center gap-3">
              <Image height={15} width={20} src={imgage} alt={children} />
              {children}
            </div>
          ) : (
            <> {children}</>
          )}
        </div>
      </Dropdown.ItemText>
      {/* <Dropdown.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
        <CheckIcon />
      </Dropdown.ItemIndicator> */}
    </Dropdown.Item>
  ),
);

SelectItem.displayName = "SelectItem";

export default Select;
