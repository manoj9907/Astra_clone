import React from "react";

function CommonInputField({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-[100%] max-w-lg cursor-pointer rounded border border-gray-400/25 bg-black px-4 py-2 text-xs text-gray-300 focus:outline-none"
    />
  );
}

export default CommonInputField;
