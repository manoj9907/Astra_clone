/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./calander.css";
import CustomCaption from "./CustomCaption";

export default function Calendar({
  selected,
  onSelect,
  defaultMonth,
  mode,
  numberOfMonths,
  fromYear,
  toYear,
}) {
  return (
    <DayPicker
      mode={mode}
      captionLayout="dropdown-buttons"
      className="w-full p-5"
      classNames={{
        day: "date",
        today: "bg-zinc-800",
        selected: "selected-date",
      }}
      selected={selected}
      onSelect={onSelect}
      {...(defaultMonth && { defaultMonth })}
      {...(numberOfMonths && { numberOfMonths })}
      hideNavigation
      components={{
        DropdownNav: (props) => (
          <CustomCaption
            {...props}
            fromYear={fromYear || 2000}
            toYear={toYear || 2050}
          />
        ),
      }}
      initialFocus
    />
  );
}
