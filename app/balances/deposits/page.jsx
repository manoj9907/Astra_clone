"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../header";
import Deposit from "../../../assets/balance/deposits-icon.svg";
import Withdrawal from "../../../assets/balance/withdrawl-icon.svg";
import QRcode from "../../../assets/balance/QR.svg";
import Copy from "../../../assets/balance/copy.svg";
import Box from "../box";
import { Button } from "@/components/ui/button";
import { market, coins } from "../options";
import copyToClipboard from "@/utils/copyToClipboard";
import Select from "@/components/ui/select";
import ToggleGroupButton from "@/components/ui/toggle";

function Withdrawl() {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState("");
  const [showNextBox, setShowNextBox] = useState(false);
  const [hideCurrentBox, setHideCurrentBox] = useState(false);
  const [getKey] = useState(
    "cwqciugwqiugcwcbwyxwbxxbbxhbxabxabxewscxsjbchsbchsbhb",
  );
  const [getSelectedValue, setGetSelectedvalue] = useState("Deposit");

  const handleWithdrawalClick = () => {
    setShowNextBox(true);
    setHideCurrentBox(true);
  };

  const toggleBtnVal = [
    {
      name: "Deposit",
      value: "Deposit",
      icon: Deposit,
    },
    {
      name: "Withdrawal",
      value: "Withdrawal",
      icon: Withdrawal,
    },
  ];
  const handleToggle = () => {
    setGetSelectedvalue("Deposit");
  };

  return (
    <div className="h-full w-full overflow-y-auto ">
      <Header />
      <div className="mb-10 mt-custom-6 flex w-full  flex-col justify-center">
        <div className="my-5 flex justify-center gap-5">
          <Link href="/balances/withdrawal">
            <ToggleGroupButton
              onValueChange={handleToggle}
              value={getSelectedValue}
              toggleDatas={toggleBtnVal}
            />
          </Link>
        </div>
        <div className="flex w-full justify-center px-5 sm:p-0">
          <Box>
            {!showNextBox && !hideCurrentBox && (
              <div className=" mb-10 w-full">
                <p className="text-base font-bold text-gray-300">Deposit</p>
                <p className="mt-7 text-sm font-bold text-gray-400">
                  Select crypto to deposit
                </p>
                <div className="mt-2 flex flex-col">
                  <Select
                    selectLabel={coins}
                    value={selectedOption}
                    handleDropdown={(e) => setSelectedOption(e)}
                  />
                </div>
                <p
                  className="mt-7 text-sm font-bold text-gray-400"
                >
                  Select deposit network
                </p>

                <div className="mt-2 flex flex-col">
                  <Select
                    selectLabel={market}
                    value={selectedDeposit}
                    handleDropdown={(e) => setSelectedDeposit(e)}
                  />
                </div>
              </div>
            )}
            {showNextBox && hideCurrentBox && (
              <div className="mb-10 w-full">
                <p className="text-center text-2xl font-bold text-gray-300">
                  Deposit Address
                </p>
                <div className="mt-10 flex justify-center">
                  <Image
                    height={100}
                    width={110}
                    src={QRcode.src}
                    alt="Deposit"
                    className="mr-2"
                    layout="fixed"
                  />
                </div>
                <div className="mt-1 w-full text-center text-[10px] text-gray-400">
                  <span>USDT address</span>
                </div>
                <div className="mt-3 flex w-full justify-center">
                  <span className="w-56	break-words text-center text-xs text-gray-400 sm:w-4/5">
                    {getKey}
                  </span>
                  <Image
                    onClick={() => copyToClipboard(getKey)}
                    height={20}
                    width={20}
                    src={Copy.src}
                    alt="Deposit"
                    className="mr-2 cursor-pointer"
                    layout="fixed"
                  />
                </div>
                <div class="mt-8 grid w-full grid-flow-col grid-rows-4 gap-4 text-gray-400">
                  <div className="text-xs">Minimum deposit</div>
                  <div className="text-xs	">Deposit arrival</div>
                  <div className="text-xs	">Withdrawal unlock</div>
                  <div className="text-xs	">Contract information</div>
                  <div className="ml-3 text-right text-xs">
                    0.000000001 USDT
                  </div>
                  <div className="ml-3 text-right text-xs">
                    2 Confirmation(s)
                  </div>
                  <div className="ml-3 text-right text-xs">Spot wallet</div>
                  <div className="ml-3 text-right text-xs">End with chsbhb</div>
                </div>
              </div>
            )}
          </Box>
        </div>
        <div className="mb-5 flex w-full justify-center px-5 sm:p-0">
          {!showNextBox && !hideCurrentBox && (
            <Button
              className="mt-5 w-full max-w-lg"
              onClick={handleWithdrawalClick}
              disabled={!selectedOption || !selectedDeposit}
            >
              Next
            </Button>
          )}
          {showNextBox && hideCurrentBox && (
            <Link href="/balances" className="flex w-full justify-center">
              <Button className="mt-5 w-full max-w-lg">Close</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Withdrawl;
