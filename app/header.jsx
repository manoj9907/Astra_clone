"use client";

import React from "react";

function Header({ text }) {
  return (
    <div className="header_name flex justify-center  border-b border-gray-400/25 text-sm font-medium text-gray-300">
      <span className=" py-2 text-center text-sm font-normal leading-loose text-gray-300">
        {text}
      </span>
    </div>
  );
}

export default Header;
