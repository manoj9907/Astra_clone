import * as React from "react";
import { format } from "date-fns";
import * as Popover from "@radix-ui/react-popover";
import cn from "@/utils/shadcn";
import Calendar from "./calendar";
import { CalendarIcon } from "../icons";

export function DatePicker({ selected, onSelect, placeholderText, className }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div
          className={cn(
            `flex h-9 cursor-pointer items-center justify-between rounded-md border border-gray-400/25 px-4 ${className}`,
          )}
        >
          {selected ? (
            <span className=" text-xs text-gray-400">
              {format(selected, "PPP")}
            </span>
          ) : (
            <span className=" text-xs text-gray-400">
              {placeholderText || "Select a date"}
            </span>
          )}

          <CalendarIcon className="h-3.5 w-3.5" />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-auto rounded border border-gray-400/25 bg-black p-2 text-gray-300"
          sideOffset={10}
          align="start"
        >
          <Calendar mode="single" selected={selected} onSelect={onSelect} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function RangePicker({ className, date, setDate }) {
  const renderDate = () => {
    if (!date?.from) {
      return <span>Pick a date</span>;
    }
    if (date.to) {
      return (
        <div className="mt-2 text-sm">
          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
        </div>
      );
    }
    return format(date.from, "LLL dd, y");
  };
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <div
            id="date"
            className={cn(
              "flex w-80 cursor-pointer gap-2 rounded-md border border-gray-400/25 p-2 pl-4 text-gray-200",
            )}
          >
            <CalendarIcon className="mt-2.5 h-4 w-4" />
            {renderDate()}
          </div>
        </Popover.Trigger>
        <Popover.Content className="z-50 rounded bg-white p-2" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
