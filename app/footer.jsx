"use client";

import React from "react";
// import Image from "next/image";
// import { linked, mail, twitter } from "../assets/settings/index";

function Footer() {
  return (
    <footer className="z-1 sticky bottom-0 mt-auto border-t border-gray-400/25 bg-black">
      <div className="mx-auto mt-4 w-full">
        <div className="flex pb-3">
          {/* <Image
            height={10}
            width={10}
            className="h-5 w-8 pl-3"
            src={linked.src}
            alt="link"
          />
          <Image
            height={10}
            width={10}
            className="h-5 w-8 pl-3"
            src={twitter.src}
            alt="link"
          />
          <Image
            height={10}
            width={10}
            className="h-5 w-8 pl-3"
            src={mail.src}
            alt="link"
          /> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
