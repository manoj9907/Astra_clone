"use client";

import "./sidebar.css";
import React, { useState } from "react";
import Image from "next/image";
import { abiKey, apikeyhover } from "../assets/settings/index";

function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="h-screen w-40 border-r border-gray-400/25">
      <div
        className="w-39 flex h-14 cursor-pointer items-center justify-center bg-gray-950"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={isHovered ? apikeyhover.src : abiKey.src}
          height={10}
          width={10}
          alt="apikey"
          className="mr-4 h-6 w-6"
        />
        <span
          className={`text-sm font-normal ${isHovered ? "hovered" : "default"}`}
        >
          API KEYS
        </span>
      </div>
    </div>
  );
}

export default Sidebar;
