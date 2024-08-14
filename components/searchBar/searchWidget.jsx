"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import search from "@/assets/search/magnifier.svg";
import DivButton from "../buttons/buttons";

function SearchWidget({ handleNavigate }) {
  const [_isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  const clickHandler = () => {
    handleNavigate();
  };
  return (
    <div className="flex h-full w-full cursor-pointer justify-end xl:pr-4">
      <nav className="flex h-full w-full flex-grow basis-16 flex-row justify-end">
        <DivButton
          className="flex h-full flex-row items-center"
          onClick={clickHandler}
        >
          <Image
            src={search}
            alt="search"
            className="pointer-events-none h-6 w-full basis-2 place-self-center object-scale-down xl:-mt-1"
          />
          {/* <p className="pl-2 pt-2 text-white">Search</p> */}
        </DivButton>
      </nav>
    </div>
  );
}

export default SearchWidget;
