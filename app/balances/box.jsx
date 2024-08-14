import React from "react";

function Box({ children }) {
  return (
    <div className="flex w-full max-w-lg flex-row rounded-lg border border-white bg-transparent p-6 text-white">
      {children}
    </div>
  );
}

export default Box;
