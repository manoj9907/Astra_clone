import React from "react";
import Link from "next/link";
import Image from "next/image";
import logoicon from "@/assets/responsiveheader/logo-icon.svg";
import navbarDivider from "@/assets/responsiveheader/navbar_divder.svg";
import backArrow from "@/assets/responsiveheader/ion_arrow-back.svg";
import CloseButton from "../buttons/closeButtons";
import { UserAuth } from "@/app/context/AuthContext";

function Header({ isNavOpen, setIsNavOpen }) {
  const { controllNav, setControllNav } = UserAuth();

  const handleSideMenu = () => {
    const controllNavbar =
      typeof document !== "undefined"
        ? document.querySelector(".controll-nav")
        : null;
    if (controllNavbar) {
      controllNavbar.style.display = isNavOpen ? "none" : "block";
      if (!isNavOpen) setControllNav(false);
      setIsNavOpen(!isNavOpen);
    }
  };
  return (
    <div>
      <div className="hidden h-10 justify-between border-b border-gray-400/25 px-5  max-xl:flex">
        <Link href="/dashboard">
          <Image
            height={35}
            width={35}
            src={logoicon.src}
            alt="Logo"
            className="image_style mt-2"
          />
        </Link>
        <div className="flex gap-5">
          {controllNav && (
            <Image
              height={30}
              width={30}
              src={backArrow.src}
              alt="Logo"
              className="image_style mr-1"
              onClick={() => setControllNav(false)}
            />
          )}

          {isNavOpen ? (
            <CloseButton
              className="absolute right-0 top-0 m-6 text-white"
              onClick={handleSideMenu}
            />
          ) : (
            <Image
              height={25}
              width={25}
              src={navbarDivider.src}
              alt="Image"
              className="image_style"
              onClick={handleSideMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
