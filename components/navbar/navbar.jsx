import React, { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { UserAuth } from "../../app/context/AuthContext";
import logo from "@/assets/navbar/Dashboard.svg";
import dashboard from "@/assets/navbar/Dashboard-green.svg";
import Assets from "@/assets/navbar/Wallet.svg";
import assetHover from "@/assets/navbar/Wallet-green.svg";
import settings from "@/assets/navbar/Settings.svg";
import settingHover from "@/assets/navbar/Settings-green.svg";
import logoutIcon from "@/assets/navbar/Exit.svg";
import logoutIconHover from "@/assets/navbar/Exit-green.svg";
import buySellIcon from "@/assets/navbar/OTC.svg";
import buysellhover from "@/assets/navbar/OTC-green.svg";
import historyIconHover from "@/assets/navbar/Order-history-green.svg";
import historyIcon from "@/assets/navbar/Order-history.svg";
import mdHistory from "@/assets/navbar/md-history.svg";
import { getDataFromDatabase } from "@/services/authservice/credientalmanagement";
import "./nav.css";
import useWidth from "@/components/customHooks/useWidth";

function Navbar({ setIsNavOpen }) {
  const [token, setToken] = useState(null);
  const { logOut } = UserAuth();
  const pathname = usePathname();
  const width = useWidth();

  const handleSignOut = async () => {
    logOut();
  };

  useEffect(() => {
    (async () => {
      await getDataFromDatabase()
        .then((data) => {
          setToken(data);
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);

  const controllNav =
    typeof document !== "undefined"
      ? document.querySelector(".controll-nav")
      : null;

  const hanleSidemenu = () => {
    if (width <= 1280) {
      if (controllNav) {
        setIsNavOpen(false);
        if (controllNav.style.display === "block") {
          controllNav.style.display = "none";
        } else {
          controllNav.style.display = "block";
        }
      }
    }
  };
  if (width === 0) return <div />;

  return (
    token && (
      <div
        className={
          width <= 1280
            ? "controll-nav absolutely h-full w-12 flex-none flex-col bg-black max-xl:w-full"
            : "showNav w-12 flex-none flex-col border-r border-gray-400/25 bg-black max-xl:w-full"
        }
      >
        <div className="h-100 ml-2 mt-3 flex basis-full flex-col gap-5 xl:ml-0">
          <div className="group relative m-1 flex-auto grow basis-8 cursor-pointer">
            <Link
              href="/dashboard"
              onClick={() => {
                hanleSidemenu();
              }}
            >
              <Tippy
                content={
                  <span className="font-mono font-semibold">Dashboard</span>
                }
              >
                <div className="max-xl:hidden">
                  <Image
                    onClick={() => {
                      hanleSidemenu();
                    }}
                    src={pathname === "/dashboard" ? dashboard : logo}
                    alt="logo"
                    className="h-11 w-11 object-scale-down group-hover:hidden max-xl:hidden"
                  />
                  <Image
                    src={dashboard}
                    alt="logo"
                    className="hidden h-11 w-11 object-scale-down group-hover:flex max-xl:hidden"
                  />
                </div>
              </Tippy>
              <div className="flex gap-4 max-xl:ml-1">
                <Image
                  src={pathname === "/dashboard" ? dashboard : logo}
                  alt="dashboard"
                  className="hidden h-9 w-9 group-hover:hidden max-xl:block"
                />
                <span className="mt-2 hidden text-gray-400 max-xl:flex">
                  Dashboard
                </span>
              </div>
            </Link>
          </div>

          <div className="group relative m-1 flex-auto grow basis-8 cursor-pointer">
            <Link
              href="/otc"
              onClick={() => {
                hanleSidemenu();
              }}
            >
              <Tippy
                content={<span className="font-mono font-semibold">OTC</span>}
              >
                <div className="max-xl:hidden">
                  <Image
                    src={pathname === "/otc" ? buysellhover : buySellIcon}
                    alt="otc"
                    className="h-10 w-10 object-scale-down group-hover:hidden max-xl:hidden"
                  />
                  <Image
                    onClick={() => {
                      hanleSidemenu();
                    }}
                    src={buysellhover}
                    alt="otc"
                    className="hidden h-10 w-10 object-scale-down group-hover:flex max-xl:hidden"
                  />
                </div>
              </Tippy>
              <div className="flex gap-4 max-xl:ml-1">
                <Image
                  src={pathname === "/otc" ? buysellhover : buySellIcon}
                  alt="otc"
                  className="hidden h-9 w-9 group-hover:hidden max-xl:block"
                />
                <span className="mt-2 hidden text-gray-400 max-xl:flex">
                  OTC
                </span>
              </div>
            </Link>
          </div>

          <div className="group relative m-1 flex-auto grow basis-8 cursor-pointer">
            <Link
              href="/balances"
              onClick={() => {
                hanleSidemenu();
              }}
            >
              <Tippy
                content={
                  <span className="font-mono font-semibold">Assets</span>
                }
              >
                <div className="max-xl:hidden">
                  <Image
                    src={pathname === "/balances" ? assetHover : Assets}
                    alt="balances"
                    className="h-10 w-10 object-scale-down group-hover:hidden max-xl:hidden"
                  />
                  <Image
                    onClick={() => {
                      hanleSidemenu();
                    }}
                    src={assetHover}
                    alt="balances"
                    className="hidden h-10 w-10 object-scale-down group-hover:flex max-xl:hidden"
                  />
                </div>
              </Tippy>
              <div className="ml-1 flex gap-4 max-xl:w-full">
                <Image
                  src={pathname === "/balances" ? assetHover : Assets}
                  alt="balances"
                  className="hidden h-9 w-9 group-hover:hidden max-xl:block"
                />
                <span className="mt-2 hidden text-gray-400 max-xl:flex">
                  Assets
                </span>
              </div>
            </Link>
          </div>

          <div className="group relative m-1 flex-auto grow basis-8 cursor-pointer">
            <Link
              href="/history"
              onClick={() => {
                hanleSidemenu();
              }}
            >
              <Tippy
                content={
                  <span className="font-mono font-semibold">History</span>
                }
              >
                <div className="max-xl:hidden">
                  <Image
                    src={
                      pathname === "/history" ? historyIconHover : historyIcon
                    }
                    alt="History"
                    className="h-10 w-10 object-scale-down group-hover:hidden max-xl:hidden"
                  />
                  <Image
                    onClick={() => {
                      hanleSidemenu();
                    }}
                    src={historyIconHover}
                    alt="History"
                    className="hidden h-10 w-10 object-scale-down group-hover:flex max-xl:hidden"
                  />
                </div>
              </Tippy>
              <div className="ml-1 flex gap-4 max-xl:w-full">
                <Image
                  src={pathname === "/history" ? historyIconHover : historyIcon}
                  alt="History"
                  className="hidden h-9 w-9 group-hover:hidden max-xl:block"
                />
                <Image
                  src={mdHistory}
                  alt="History"
                  className="hidden h-9 w-9 max-xl:group-hover:flex"
                />
                <span className="mt-2 hidden text-gray-400 max-xl:flex">
                  History
                </span>
              </div>
            </Link>
          </div>

          <div className="group relative flex-auto grow basis-8 cursor-pointer xl:order-last xl:m-1">
            <Link
              href="/settings"
              onClick={() => {
                hanleSidemenu();
              }}
            >
              <Tippy
                content={
                  <span className="font-mono font-semibold">Settings</span>
                }
              >
                <div className="max-xl:hidden">
                  <Image
                    src={pathname === "/settings" ? settingHover : settings}
                    alt="setting"
                    className="h-10 w-10 object-scale-down group-hover:hidden max-xl:hidden"
                  />
                  <Image
                    src={settingHover}
                    alt="setting"
                    onClick={() => {
                      hanleSidemenu();
                    }}
                    className="hidden h-10 w-10 object-scale-down group-hover:flex max-xl:hidden"
                  />
                </div>
              </Tippy>
              <div className="ml-2 flex gap-4 max-xl:w-full">
                <Image
                  src={pathname === "/settings" ? settingHover : settings}
                  alt="setting"
                  className="hidden h-9 w-9 group-hover:hidden max-xl:block"
                />
                <span className="mt-2 hidden text-gray-400 max-xl:flex">
                  Settings
                </span>
              </div>
            </Link>
          </div>

          <div className="group relative m-1 mb-4 flex-auto grow basis-8 cursor-pointer xl:order-last">
            <Link href="/" onClick={handleSignOut}>
              <Tippy
                content={
                  <span className="font-mono font-semibold">Log out</span>
                }
              >
                <div className="max-xl:hidden">
                  <Image
                    src={logoutIcon}
                    alt="vault"
                    className="h-10 w-10 object-scale-down group-hover:hidden max-xl:hidden"
                  />
                  <Image
                    src={logoutIconHover}
                    alt="vault"
                    className="hidden h-10 w-10 object-scale-down group-hover:flex max-xl:hidden"
                  />
                </div>
              </Tippy>
              <div className="ml-1 flex gap-4 max-xl:w-full">
                <Image
                  src={logoutIcon}
                  alt="History"
                  className="hidden h-9 w-9 group-hover:hidden max-xl:block"
                />
                <Image
                  src={logoutIcon}
                  alt="vault"
                  className="hidden h-9 w-9 max-xl:group-hover:flex"
                />
                <span className="mt-2 hidden text-gray-400 max-xl:flex">
                  Log out
                </span>
              </div>
            </Link>
          </div>
          <div className="h-100 flex basis-full flex-col">
            {/* filler between the sideBar elements */}
          </div>
        </div>
      </div>
    )
  );
}

export default Navbar;
