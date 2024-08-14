import React from "react";
import Image from "next/image";
import logoicon from "@/assets/logpage/astra-logo-head.svg";

export default function Header({ resetForm }) {
  return (
    <>
      <div className="container-header flex items-center justify-center py-10 md:hidden">
        <Image
          src={logoicon.src}
          height={10}
          width={10}
          alt="Image"
          className="h-[31px] w-[85px]"
          onClick={resetForm}
        />
      </div>

      <div className="container-header hidden px-10 py-10 md:flex">
        <Image
          src={logoicon.src}
          height={10}
          width={10}
          alt="Image"
          className="h-[64px] w-[174px]"
          onClick={resetForm}
        />
      </div>
    </>
  );
}
