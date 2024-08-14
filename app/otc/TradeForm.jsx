"use client";

import React from "react";
import DivButton from "@/components/buttons/buttons";
import { InputWithUnitsLg, VerticalSwitchIconLg } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { InputWithUnitsLg, VerticalSwitchIconLg } from "../components/ui/input";

function TradeForm({
  setSelectedDropdown,
  selectedBuyCoin,
  handleInputChangeBuy,
  handleCurrencySelectRequest,
  inputValueBuy,
  selectedSellCoin,
  inputValueSell,
  handleInputChangeSell,
  handleRequestForQuote,
  rotation,
  swapBuyAndSellCoins, // function that is used in main otc
}) {
  const isInputFilledBuy = inputValueBuy !== null;
  const isInputFilledSell = inputValueSell !== null;
  // const orderTypeSelector = () => (
  //   <div className="flex gap-2">
  //     <button
  //       className="h-12 w-28 rounded bg-gray-960 text-base text-black"
  //       type="button"
  //     >
  //       Market
  //     </button>
  //     <button
  //       className="h-12 w-28 rounded border bg-black text-base text-white"
  //       type="button"
  //     >
  //       Limit
  //     </button>
  //   </div>
  // );

  const buyInput = () => (
    <DivButton
      className="buy_class_head w-full"
      onClick={() => setSelectedDropdown("buy_class_head")}
    >
      <div className="buy_class">
        <p className="buy_tag text-gray-300">Buy</p>
      </div>

      <InputWithUnitsLg
        className="hover:border-green-500"
        symbol={selectedBuyCoin.symbol}
        placeholder={isInputFilledSell ? "?" : "0.00"}
        value={inputValueBuy ?? ""}
        onChange={(e) => handleInputChangeBuy(e)}
        onDropdownClick={handleCurrencySelectRequest}
      />
    </DivButton>
  );

  const sellInput = () => (
    <DivButton
      className="sell_class_head"
      onClick={() => setSelectedDropdown("sell_class_head")}
    >
      <div className="buy_class">
        <p className="buy_tag text-gray-300">Sell</p>
      </div>
      <InputWithUnitsLg
        className="hover:border-red-500"
        symbol={selectedSellCoin.symbol}
        placeholder={isInputFilledBuy ? "?" : "0.00"}
        value={inputValueSell ?? ""}
        onChange={(e) => handleInputChangeSell(e)}
        onDropdownClick={handleCurrencySelectRequest}
      />
    </DivButton>
  );

  const requestQuoteButton = () => (
    <Button
      className="mt-3 w-full"
      disabled={!isInputFilledBuy && !isInputFilledSell}
      onClick={handleRequestForQuote}
    >
      Request Quote
    </Button>
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12">
      {/* {orderTypeSelector()} */}
      <div className="flex w-4/5 flex-col items-center justify-center gap-2 sm:w-[423px]">
        <div className="mb-6 w-full">{sellInput()}</div>
        <VerticalSwitchIconLg
          rotation={rotation}
          onClick={() => swapBuyAndSellCoins()}
        />
        {buyInput()}
        {requestQuoteButton()}
      </div>
    </div>
  );
}

export default TradeForm;
