import React from "react";
import Image from "next/image";
import { formatNumWithCommas, roundToNearestNthDecimal } from "@/utils/format";
import close from "@/assets/otcpage/close-icon.svg";
import sucess from "@/assets/otcpage/sucess-icon.svg";

export default function TradeConfirmationStep({
  confirmedTrade,
  handleCloseTradeConfirmation,
  selectedSellCoin,
  selectedBuyCoin,
}) {
  const { sellCoinAmount, buyCoinAmount } = confirmedTrade;
  return (
    <div className="center">
      <div className="sucess_container">
        <Image
          height={10}
          width={10}
          className="close_button_sucess"
          onClick={handleCloseTradeConfirmation}
          src={close.src}
          alt="close"
        />
        <div className="sucess_img">
          <Image height={10} width={10} src={sucess.src} alt="sucess" />
          <p className="sucess_price">
            {sellCoinAmount} {selectedSellCoin.symbol} →{" "}
            {formatNumWithCommas(roundToNearestNthDecimal(buyCoinAmount, 2))}{" "}
            {selectedBuyCoin.symbol}
          </p>
          <p className="trade_status">Trade Confirmed</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          window.location.href = "/history";
        }}
        className="button_group"
      >
        Trade History
      </button>
    </div>
  );
}
