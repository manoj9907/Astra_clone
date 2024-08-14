import React, { useState } from "react";
import Image from "next/image";
import dropdown from "../../assets/balance/dropup-arrow.svg";
import searchIcon from "../../assets/balance/search-icon.svg";
import DivButton from "@/components/buttons/buttons";

function CustomDropdown({
  options,
  onChange,
  showImage = true,
  disabled = false,
  showSearchIcon = false,
  height,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 1);
          border-radius: 1px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.3);
        }
      `}</style>
      <DivButton
        className={`cursor-pointer rounded border border-white px-4 py-2 text-white ${
          disabled ? "cursor-not-allowed opacity-50" : "bg-black"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <span className="py-2 text-xs text-gray-400">
            {selectedOption.text1}
          </span>
        ) : (
          <div className="flex items-center bg-black py-1">
            {showSearchIcon && (
              <Image
                height={10}
                width={10}
                src={searchIcon.src}
                alt="Search"
                className="mr-2 h-4 w-4"
              />
            )}
            <div className="flex w-full items-center justify-between bg-black ">
              <div className="text-xs">Select</div>
              <Image
                height={10}
                width={10}
                src={dropdown.src}
                alt="Placeholder"
                className="h-4 w-4"
              />
            </div>
          </div>
        )}
      </DivButton>
      {isOpen && !disabled && (
        <div
          className="custom-scrollbar absolute left-0 z-10 mt-2 w-full overflow-y-auto rounded bg-black shadow-lg"
          style={{ height: `${height}px` }}
        >
          {options.map((option) => (
            <DivButton
              key={option.text1}
              className="flex cursor-pointer items-center bg-black px-4 py-2 hover:bg-gray-950"
              onClick={() => handleOptionClick(option)}
            >
              {showImage && (
                <Image
                  height={10}
                  width={10}
                  src={option.image}
                  alt={option.text1}
                  className="mr-2 h-6 w-6"
                />
              )}
              <span className="text-xs">{option.text1}</span>
              <span className="ml-2 text-xs">{option.text2}</span>
            </DivButton>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
