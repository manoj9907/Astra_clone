"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../header";
import Deposit from "../../../assets/balance/deposit-button.svg";
import Withdrawal from "../../../assets/balance/withdraw-button.svg";
import Submit from "../../../assets/balance/submit.svg";
import Box from "../box";
import CommonInputField from "../inputfield";
import { options, market, methods } from "../options";
import { Button } from "@/components/ui/button";
import Select from "@/components/ui/select";
import ToggleGroupButton from "@/components/ui/toggle";

function Withdrawl() {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState("");
  const [selectedWithdraw, setSelectedWithdraw] = useState("");
  const [showNextBox, setShowNextBox] = useState(false);
  const [hideCurrentBox, setHideCurrentBox] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [xrpAddress, setXrpAddress] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [networkFee, setNetworkFee] = useState("");
  const [showError, setShowError] = useState(false);
  const [getMaxamtError, setGetMaxamtError] = useState(false);
  const [getNwtfeeError, setGetNwtfeeError] = useState(false);
  const [getXRPError, setGetXRPError] = useState(false);
  const [getSelectedValue, setGetSelectedvalue] = useState("Withdrawal");
  const router = useRouter();

  const handleWithdrawalClick = () => {
    setShowNextBox(true); // Show the next box
    setHideCurrentBox(true); // Hide the current box
  };

  const handleCompleteClick = () => {
    if (
      !networkFee ||
      !maxAmount ||
      !xrpAddress ||
      getMaxamtError ||
      getNwtfeeError ||
      getXRPError
    ) {
      setShowError(true);
    } else setShowSubmit(true);
    if (showSubmit) router.push("/balances", { scroll: false });
  };

  const handleXrpAddressChange = (event) => {
    setXrpAddress(event.target.value); // Update the XRP address state variable
    const getXRP = event.target.value;
    const getResults = !/^[a-zA-Z0-9]+$/.test(getXRP);
    setGetXRPError(getResults);
  };

  const handleMaxAmount = (event) => {
    setMaxAmount(event.target.value); // Update the XRP address state variable
    const getAmount = event.target.value;
    const getResults = /^\d+(?:\.\d+)?$/.test(getAmount);
    setGetMaxamtError(!getResults);
  };

  const handleNetworkFee = (event) => {
    setNetworkFee(event.target.value); // Update the XRP address state variable
    const getNetworkFee = event.target.value;
    const getResults = /^\d+(?:\.\d+)?$/.test(getNetworkFee);
    setGetNwtfeeError(!getResults);
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
    <div className="h-full w-full justify-center overflow-y-auto">
      <Header />
      <div className="mb-10 mt-custom-6 flex w-full  flex-col justify-center">
        <div className="my-5 flex justify-center gap-5">
          <Link href="/balances/deposits">
            <ToggleGroupButton
              onValueChange={handleToggle}
              value={getSelectedValue}
              toggleDatas={toggleBtnVal}
            />
          </Link>
        </div>
        <div className="flex w-full justify-center px-5 sm:p-0">
          <Box>
            {!showNextBox && !hideCurrentBox && !showSubmit && (
              <div className="mb-10 w-full">
                <p className="text-base font-bold text-gray-300">Withdrawal</p>
                <p className="mt-7 text-sm font-bold text-gray-400">
                  Select crypto to withdraw
                </p>
                <div className="mt-2 flex flex-col">
                  <Select
                    selectLabel={options}
                    value={selectedOption}
                    handleDropdown={(e) => setSelectedOption(e)}
                  />
                </div>
                <p className="mt-7 text-sm font-bold text-gray-400">
                  Select deposit network
                </p>
                <div className="mt-2 flex flex-col">
                  <Select
                    selectLabel={market}
                    value={selectedDeposit}
                    handleDropdown={(e) => setSelectedDeposit(e)}
                  />
                </div>
                <p className="mt-7 text-sm font-bold text-gray-400">
                  Select withdraw method
                </p>
                <div className="mt-2 flex flex-col">
                  <Select
                    selectLabel={methods}
                    value={selectedWithdraw}
                    handleDropdown={(e) => setSelectedWithdraw(e)}
                  />
                </div>
              </div>
            )}
            {showNextBox && hideCurrentBox && !showSubmit && (
              <div className="w-full">
                <p className="text-base font-bold">Complete Withdrawal</p>
                <p className="XRP address mt-6 text-sm font-bold text-gray-400">
                  XRP address
                </p>
                <div className="mt-2">
                  <CommonInputField
                    value={xrpAddress} // Provide value and onChange props as needed
                    onChange={handleXrpAddressChange}
                    placeholder="Enter XRP address"
                  />
                  {showError && !xrpAddress && (
                    <span className="text-xs text-[Gold]">Enter The Link </span>
                  )}
                  {xrpAddress && getXRPError && (
                    <span className="text-xs text-[Gold]">
                      Enter The Valid Link
                    </span>
                  )}
                </div>
                <p className="mt-5 text-sm font-bold text-gray-400">Amount</p>
                <div className="mt-2">
                  <CommonInputField
                    value={maxAmount} // Provide value and onChange props as needed
                    onChange={handleMaxAmount}
                    placeholder="Max Amount"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Available: 24.943 XRP
                  </p>
                  {showError && !maxAmount && (
                    <span className="text-xs text-[Gold]">Enter Amount</span>
                  )}
                  {maxAmount && getMaxamtError && (
                    <span className="text-xs text-[Gold]">
                      Enter valid Amount
                    </span>
                  )}
                </div>
                <p className="mt-4  text-sm font-bold text-gray-400">
                  Network fee
                </p>
                <div className="mt-2">
                  <CommonInputField
                    value={networkFee} // Provide value and onChange props as needed
                    onChange={handleNetworkFee}
                    placeholder="2.0 "
                  />
                  {showError && !networkFee && (
                    <span className="text-xs text-[Gold]">
                      Enter Network fee
                    </span>
                  )}
                  {networkFee && getNwtfeeError && (
                    <span className="text-xs text-[Gold]">
                      Enter valid Network fee
                    </span>
                  )}
                </div>
                <div className="mt-5 flex justify-between text-base font-bold text-gray-400 ">
                  <p className=" font-bold">Total</p>
                  <p>24.742 XRP</p>
                </div>
              </div>
            )}
            {showSubmit && (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <Image
                  height={40}
                  width={40}
                  src={Submit.src}
                  alt="Deposit"
                  className="mr-2"
                />
                <p className="mt-5 font-bold text-gray-400">
                  Withdrawal request submitted
                </p>
              </div>
            )}
          </Box>
        </div>
        <div className="mb-5 flex w-full justify-center px-5 sm:p-0">
          {!showNextBox && !hideCurrentBox && (
            <Button
              onClick={handleWithdrawalClick}
              className="mt-5 w-full max-w-lg"
              disabled={
                !selectedOption || !selectedDeposit || !selectedWithdraw
              }
            >
              Next
            </Button>
          )}
          {showNextBox && hideCurrentBox && (
            <Button
              onClick={handleCompleteClick}
              className="mt-5 w-full max-w-lg"
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Withdrawl;
