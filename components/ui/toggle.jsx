import React from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import Image from "next/image";

function ToggleGroupButton({ value, onValueChange, toggleDatas }) {
  return (
    <div>
      <ToggleGroup.Root
        type="single"
        value={value}
        className="flex h-10 rounded-lg border border-gray-400/25 text-sm"
        onValueChange={onValueChange}
      >
        {toggleDatas?.map((toggleData) => (
          <ToggleGroup.Item
            key={toggleData.value}
            value={toggleData.value}
            className="flex-grow rounded-md px-4 data-[state=off]:bg-transparent data-[state=on]:bg-gray-300 data-[state=off]:text-gray-200 data-[state=on]:text-gray-900"
            aria-label="Center aligned"
          >
            {toggleData.icon ? (
              <div className="flex">
                <Image
                  height={20}
                  width={20}
                  src={toggleData.icon}
                  alt="Toggle Icon"
                  className="mr-2"
                />
                {toggleData.name}
              </div>
            ) : (
              <div>{toggleData.name}</div>
            )}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
export default ToggleGroupButton;
