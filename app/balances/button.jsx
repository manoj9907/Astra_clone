import React from "react";

function Button({ onClick, text, disabled = false }) {
  return (
    <button
      className={`mt-5 flex h-10 w-4/5 items-center justify-center rounded-md bg-gray-960 text-lg font-semibold text-black ${disabled ? " bg-gray-980" : "cursor-pointer bg-gray-960 hover:bg-gray-990"} sm:h-14 sm:w-custom-450`}
      type="button"
      onClick={disabled ? null : onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
