import React from "react";
import Image from "next/image";
import {
  formatNumWithCommas,
  roundToNSignificantDigits,
  roundToNearestNthDecimal,
} from "@/utils/format";
import close from "@/assets/otcpage/close-icon.svg";
import arrow from "@/assets/otcpage/arrow-icon.svg";

const DEFAULT_QUOTE = {
  spreadCostBps: Math.random(),
  blockchainGasCostBps: Math.random(),
  fiatWireTransferCostBps: Math.random(),
  stablecoinRedemptionCostBps: Math.random(),
  slippageCostBps: Math.random(),
  hedgingCostBps: Math.random(),
  exchangeFeeBps: Math.random(),
  serviceFeeBps: Math.random(),
  totalFeeBps: Math.random(),

  spreadCost: Math.random(),
  blockchainGasCost: Math.random(),
  fiatWireTransferCost: Math.random(),
  stablecoinRedemptionCost: Math.random(),
  slippageCost: Math.random(),
  hedgingCost: Math.random(),
  exchangeFee: Math.random(),
  serviceFee: Math.random(),
  totalFee: Math.random(),

  bestExchangePrice: Math.random(),
  yourEffectivePrice: Math.random(),
  estimatedPriceOfAlternatives: Math.random(),
  yourSavingsWithAstraBps: Math.random(),
  yourSavingsWithAstra: Math.random(),

  buyCoinAmount: Math.random(),
  sellCoinAmount: Math.random(),
};

function PreviewQuoteHeader({
  handleClosePreviewQuote,
  durationToQuoteExpirySeconds,
}) {
  return (
    <>
      <div className="header_quote">
        <p className="select_header">Preview Quote</p>
        <Image
          height={10}
          width={10}
          className="close_button"
          onClick={handleClosePreviewQuote}
          src={close.src}
          alt="close"
        />
      </div>
      <div className="mb-8 text-sm text-yellow-400">
        Quote expires in: {Math.max(durationToQuoteExpirySeconds, 0).toFixed(1)}{" "}
        seconds
      </div>
    </>
  );
}

function PreviewQuoteSellInfo({ selectedSellCoin, fromAssetQuantity }) {
  return (
    <div>
      <div className="coin_price">
        <div className="coin_text">
          <Image
            className="image_coin"
            src={selectedSellCoin.image.src}
            width={30}
            height={30}
            alt="bitcoin"
          />
          <span className="image_text">{selectedSellCoin.symbol}</span>
        </div>
        <span className="image_count text-red-400">
          {formatNumWithCommas(roundToNearestNthDecimal(fromAssetQuantity, 2))}
        </span>
      </div>
    </div>
  );
}

function PreviewQuoteBuyInfo({
  selectedBuyCoin,
  flashableBgColor,
  toAssetQuantity,
}) {
  return (
    <div className="coin_price">
      <div className="coin_text">
        <Image
          className="image_coin"
          src={selectedBuyCoin.image.src}
          width={30}
          height={30}
          alt="usd"
        />
        <span className="image_text">{selectedBuyCoin.symbol}</span>
      </div>
      <span className={`image_count text-green-400 ${flashableBgColor}`}>
        {formatNumWithCommas(roundToNearestNthDecimal(toAssetQuantity, 2))}
      </span>
    </div>
  );
}

function FeeItem({
  name,
  cost,
  bps,
  competitorCost,
  competitorBps,
  flashableBgColor,
}) {
  return (
    <div className="flex min-w-[550px] flex-row gap-2">
      <div className="w-[20%] basis-24 py-2 text-left">{name}</div>
      <div className="ml-auto w-[20%] basis-24 py-2 text-right">
        <span className={flashableBgColor}>
          ({roundToNSignificantDigits(competitorBps, 2)} bps)
        </span>
      </div>
      <div className="w-[20%] basis-24 py-2 text-right">
        <span className={flashableBgColor}>
          {roundToNearestNthDecimal(competitorCost, 2)} USD
        </span>
      </div>
      <div className="w-[20%] basis-24 py-2 text-right">
        <span className={flashableBgColor}>
          ({roundToNSignificantDigits(bps, 2)} bps)
        </span>
      </div>
      <div className="w-[20%] basis-24 py-2 text-right">
        <span className={flashableBgColor}>
          {roundToNearestNthDecimal(cost, 2)} USD
        </span>
      </div>
    </div>
  );
}

function AcceptQuoteButton({ onAcceptQuote }) {
  return (
    <div className="flex w-full justify-center">
      <button
        type="button"
        className="shadow-sharp mt-6 h-12 w-[80%] bg-white font-semibold text-black hover:bg-gray-200 active:shadow-none xl:w-[36rem]"
        onClick={onAcceptQuote}
      >
        Accept Quote
      </button>
      {/* <button
        className="shadow-sharp-lg-purple mt-6 h-12 w-[36rem] bg-white font-semibold text-black hover:bg-gray-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
        type="button"
      >
        Accept Quote
      </button> */}
    </div>
  );
}
export default function PreviewQuoteStep({
  flashUpdatedElements,
  durationToQuoteExpiryMillis,
  latestQuoteNew,
  handleClosePreviewQuote,
  selectedSellCoin,
  selectedBuyCoin,
  onAcceptQuote,
}) {
  const flashableBgColor = `${flashUpdatedElements ? "bg-yellow-400/25" : "bg-inherit transition-colors ease-out duration-1000"}`;

  const durationToQuoteExpirySeconds = durationToQuoteExpiryMillis / 1000;

  const {
    spreadCostBps,
    blockchainGasCostBps,
    fiatWireTransferCostBps,
    stablecoinRedemptionCostBps,
    slippageCostBps,
    hedgingCostBps,
    exchangeFeeBps,
    serviceFeeBps,
    totalFeeBps,

    spreadCostUsd,
    blockchainGasCostUsd,
    fiatWireTransferCostUsd,
    stablecoinRedemptionCostUsd,
    slippageCostUsd,
    hedgingCostUsd,
    exchangeFeeUsd,
    serviceFeeUsd,
    totalFeeUsd,

    competitorStablecoinRedemptionCostBps,
    competitorSlippageCostBps,
    competitorHedgingCostBps,
    competitorExchangeFeeBps,
    competitorServiceFeeBps,

    competitorStablecoinRedemptionCostUsd,
    competitorSlippageCostUsd,
    competitorHedgingCostUsd,
    competitorExchangeFeeUsd,
    competitorServiceFeeUsd,

    competitorTotalFeeBps,
    competitorTotalFeeUsd,

    bestExchangePrice,
    yourEffectivePrice,
    estimatedPriceOfAlternatives,
    yourSavingsWithAstraBps,
    yourSavingsWithAstra,

    toAssetQuantity,
    fromAssetQuantity,
  } = latestQuoteNew ?? DEFAULT_QUOTE;

  const feeItems = [
    {
      name: "Blockchain txn gas cost",
      cost: blockchainGasCostUsd,
      bps: blockchainGasCostBps,
      competitorCost: blockchainGasCostUsd,
      competitorBps: blockchainGasCostBps,
    },
    {
      name: "Fiat wire transfer fee",
      cost: fiatWireTransferCostUsd,
      bps: fiatWireTransferCostBps,
      competitorCost: fiatWireTransferCostUsd,
      competitorBps: fiatWireTransferCostBps,
    },
    {
      name: "Spread",
      cost: spreadCostUsd,
      bps: spreadCostBps,
      competitorCost: spreadCostUsd,
      competitorBps: spreadCostBps,
    },
    {
      name: "Slippage",
      cost: slippageCostUsd,
      bps: slippageCostBps,
      competitorCost: competitorSlippageCostUsd,
      competitorBps: competitorSlippageCostBps,
    },
    {
      name: "Stablecoin redemption",
      cost: stablecoinRedemptionCostUsd,
      bps: stablecoinRedemptionCostBps,
      competitorCost: competitorStablecoinRedemptionCostUsd,
      competitorBps: competitorStablecoinRedemptionCostBps,
    },
    {
      name: "Hedging cost",
      cost: hedgingCostUsd,
      bps: hedgingCostBps,
      competitorCost: competitorHedgingCostUsd,
      competitorBps: competitorHedgingCostBps,
    },
    {
      name: "Exchange fee",
      cost: exchangeFeeUsd,
      bps: exchangeFeeBps,
      competitorCost: competitorExchangeFeeUsd,
      competitorBps: competitorExchangeFeeBps,
    },
    {
      name: "Service fee",
      cost: serviceFeeUsd,
      bps: serviceFeeBps,
      competitorCost: competitorServiceFeeUsd,
      competitorBps: competitorServiceFeeBps,
    },
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-scroll">
      <div className="shadow-sharp-lg-gray mr-1 h-3/4 w-[80%] overflow-y-auto border border-gray-800 p-6 xl:w-auto">
        <PreviewQuoteHeader
          handleClosePreviewQuote={handleClosePreviewQuote}
          durationToQuoteExpirySeconds={durationToQuoteExpirySeconds}
        />
        <PreviewQuoteSellInfo
          selectedSellCoin={selectedSellCoin}
          fromAssetQuantity={fromAssetQuantity}
        />
        <Image
          height={10}
          width={10}
          className="arrow_image"
          src={arrow.src}
          alt="arrow"
        />
        <PreviewQuoteBuyInfo
          selectedBuyCoin={selectedBuyCoin}
          flashableBgColor={flashableBgColor}
          toAssetQuantity={toAssetQuantity}
        />
        <div className="mt-8 flex flex-col text-xs text-white">
          <div className="flex flex-row justify-between">
            <div>
              Best exchange price
              <br />
              <span className="text-gray-400">
                (via Astra <span className="font-bold">Smart Routing</span>)
              </span>
            </div>
            <div className={flashableBgColor}>
              {formatNumWithCommas(
                roundToNearestNthDecimal(bestExchangePrice, 2),
              )}{" "}
              USD
            </div>
          </div>

          <div className="text-right text-2xl">-</div>

          <div className="flex w-full flex-col overflow-y-auto">
            <div className="flex min-w-[550px] flex-row  gap-1">
              <div>Estimated transaction costs</div>
              <div className="ml-auto flex basis-48 items-center justify-center bg-red-400/25">
                Competitors
              </div>
              <div className="flex basis-48 items-center justify-center bg-green-400/25 text-center">
                Astra
              </div>
            </div>
            {/* {FeeItem(
              "Total",
              totalFeeUsd,
              totalFeeBps,
              competitorTotalFeeUsd,
              competitorTotalFeeBps,
            )} */}
            <div className="mt-2">
              <FeeItem
                name="Total"
                cost={totalFeeUsd}
                bps={totalFeeBps}
                competitorCost={competitorTotalFeeUsd}
                competitorBps={competitorTotalFeeBps}
                flashableBgColor={flashableBgColor}
              />
            </div>

            <div className=" text-gray-400">
              {feeItems
                .sort((a, b) => b.cost - a.cost)
                .map(({ name, cost, bps, competitorCost, competitorBps }) => (
                  <FeeItem
                    name={name}
                    cost={cost}
                    bps={bps}
                    competitorCost={competitorCost}
                    competitorBps={competitorBps}
                    flashableBgColor={flashableBgColor}
                    key={name}
                  />
                ))}
            </div>
          </div>

          <div className="text-right text-2xl">=</div>

          <div className="grid grid-cols-2 gap-2">
            <div>Your effective price</div>
            <div className={`${flashableBgColor} text-right`}>
              {formatNumWithCommas(
                roundToNearestNthDecimal(yourEffectivePrice, 2),
              )}{" "}
              USD
            </div>
          </div>

          <div className="my-4 grid grid-cols-2 gap-2">
            <div>Estimated price of alternatives</div>
            <div className={`${flashableBgColor} text-right`}>
              {formatNumWithCommas(
                roundToNearestNthDecimal(estimatedPriceOfAlternatives, 2),
              )}{" "}
              USD
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>Your savings with Astra</div>
            {/* <div className="basis-20 text-right ml-auto text-green-400">({roundToNSignificantDigits(5, 2)} bps)</div>
              <div className="basis-36 text-right text-green-400">{roundToNearestNthDecimal(buyCoinAmount * 0.0005, 2)} USD</div> */}
            <div className="mt-4 grid grid-cols-2 gap-1">
              <div
                className={`basis-24 text-right text-green-400 ${flashableBgColor} ml-auto`}
              >
                ({roundToNSignificantDigits(yourSavingsWithAstraBps, 2)} bps)
              </div>
              <div
                className={`basis-28 text-right text-green-400 ${flashableBgColor}`}
              >
                {formatNumWithCommas(
                  roundToNearestNthDecimal(yourSavingsWithAstra, 2),
                )}{" "}
                USD
              </div>
            </div>
          </div>
        </div>
      </div>
      <AcceptQuoteButton onAcceptQuote={onAcceptQuote} />
    </div>
  );
}
