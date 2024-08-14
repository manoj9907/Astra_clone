"use client";

import React, { useRef, useState, useEffect } from "react";
import { ASTRA_BASE_WS_URL } from "@/constants";
import "./otc.css";
import bitcoin from "@/assets/otcpage/bitcoin.png";
import usdIcon from "@/assets/otcpage/usd-icon.svg";
import TradeForm from "./TradeForm";
import CurrencySelector from "./CurrencySelector";
import PreviewQuoteStep from "./PreviewQuoteStep";
import TradeConfirmationStep from "./TradeConfirmationStep";
import { getAccessToken } from "@/app/util";
import { apiPost } from "@/services/requests";

const PRICE_SAMPLING_PERIOD_MS = 5000;

function Otc() {
  const usd = {
    name: "US Dollar",
    symbol: "USD",
    image: usdIcon,
  };

  const btc = {
    name: "Bitcoin",
    symbol: "BTC",
    image: bitcoin,
  };

  // const coins = [
  //   { name: "Bitcoin", symbol: "BTC", image: bitcoin },
  //   { name: "Ethereum", symbol: "ETH", image: etherum },
  //   { name: "Fantom", symbol: "FTM", image: fantom },
  //   { name: "Tether", symbol: "USDT", image: tetherIcon },
  //   { name: "US Dollar", symbol: "USD", image: usdIcon },
  // ];

  // commented due to linting fails
  // const wizardSteps = [
  //   "requestQuote",
  //   "transitionToPreviewQuote",
  //   "previewQuote",
  //   "tradeConfirmation",
  // ];

  const [wizardStep, setWizardStep] = useState("requestQuote");
  // const [wizardStep, setWizardStep] = useState("previewQuote");
  const [showLoader, setShowLoader] = useState(false);
  const [isSelectingCurrency, setIsSelectingCurrency] = useState(false);

  const [selectedBuyCoin, setSelectedBuyCoin] = useState(usd);
  const [selectedSellCoin, setSelectedSellCoin] = useState(btc);
  // Only one (or zero) of these can be set to a non-null value at a time
  const [inputValueBuy, setInputValueBuy] = useState(null);
  // const [inputValueBuy, setInputValueBuy] = useState(60_000);
  const [inputValueSell, setInputValueSell] = useState(null);

  const wsRef = useRef(null);
  const [latestQuoteNew, setLatestQuoteNew] = useState(null);
  const quoteTickIntervalRef = useRef(null);
  const [durationToQuoteExpiryMillis, setDurationToQuoteExpiryMillis] =
    useState(null);

  const [latestQuote] = useState(null);
  const [lastQuoteSampleTimeMs, setLastQuoteSampleTimeMs] = useState(0);
  const [setLatestSampledQuote] = useState(null);

  const [confirmedTrade, setConfirmedTrade] = useState(null);

  const [flashUpdatedElements, setFlashUpdatedElements] = useState(false);

  const [rotation, setRotation] = useState(0);
  const [selectedDropdown, setSelectedDropdown] = useState(null);

  const inRequestQuoteStep = wizardStep === "requestQuote";
  const inTransitionToPreviewQuoteStep =
    wizardStep === "transitionToPreviewQuote";
  const inPreviewQuoteStep = wizardStep === "previewQuote";
  const inTradeConfirmationStep = wizardStep === "tradeConfirmation";

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDurationToQuoteExpiryMillis((durationMillis) => {
        if (durationMillis === null) return null;
        return durationMillis - 100;
      });
    }, 100);
    quoteTickIntervalRef.current = intervalId;
    return () => clearInterval(quoteTickIntervalRef.current);
  }, []);

  useEffect(() => {
    const enteringTransitionToPreviewQuote =
      wizardStep === "transitionToPreviewQuote";
    if (enteringTransitionToPreviewQuote) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [wizardStep]);

  useEffect(() => {
    if (wizardStep === "transitionToPreviewQuote") {
      setWizardStep("previewQuote");
    }
  }, [latestQuoteNew]);

  useEffect(() => {
    setFlashUpdatedElements(true);
  }, [latestQuoteNew]);

  useEffect(() => {
    if (latestQuoteNew !== null)
      setDurationToQuoteExpiryMillis(
        latestQuoteNew.quote.expiryTime / 1000 - Date.now(),
      );
  }, [latestQuoteNew]);

  useEffect(() => {
    if (flashUpdatedElements)
      setTimeout(() => setFlashUpdatedElements(false), 10);
  }, [flashUpdatedElements]);

  // Periodically take latestTrade and push it to the state variables which are used for rendering
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastPriceUpdateMs = now - lastQuoteSampleTimeMs;
    if (timeSinceLastPriceUpdateMs > PRICE_SAMPLING_PERIOD_MS) {
      if (latestQuote) {
        setLatestSampledQuote(latestQuote);
        setLastQuoteSampleTimeMs(now);
      }
    }
  }, [latestQuote, lastQuoteSampleTimeMs]);

  const handleCurrencySelectRequest = () => {
    setIsSelectingCurrency((x) => !x);
  };

  const swapBuyAndSellCoins = () => {
    setRotation(rotation + 180);

    const inputValueBuyTemp = structuredClone(inputValueBuy);
    setInputValueBuy(inputValueSell);
    setInputValueSell(inputValueBuyTemp);

    const selectedBuyCoinTemp = structuredClone(selectedBuyCoin);
    setSelectedBuyCoin(selectedSellCoin);
    setSelectedSellCoin(selectedBuyCoinTemp);
  };

  // const isInputFilledBuy = inputValueBuy !== null;
  // const isInputFilledSell = inputValueSell !== null;

  const handleInputChangeBuy = (e) => {
    let newAmount = e.target.value;
    if (!newAmount) {
      setInputValueBuy(null);
      setInputValueSell(null);
      return;
    }
    newAmount = parseFloat(newAmount);
    setInputValueBuy(newAmount);
    setInputValueSell(null);
  };

  const handleInputChangeSell = (e) => {
    let newAmount = e.target.value;
    if (!newAmount) {
      setInputValueBuy(null);
      setInputValueSell(null);
      return;
    }
    newAmount = parseFloat(newAmount);
    setInputValueSell(newAmount);
    setInputValueBuy(null);
  };

  // commented due to linting fails
  // const generateQuote = (lastTradePrice) => {
  //   const plusMinusNPercent = (n) => 1 + n * 0.01 * (2 * Math.random() - 1);
  //   const plusMinus50Percent = () => plusMinusNPercent(50);

  //   const sellCoinAmount = inputValueSell ?? 1;

  //   // Proportional costs
  //   const spreadCostBps = 0.01 * plusMinus50Percent();
  //   const stablecoinRedemptionCostBps = 0.1;
  //   // const slippageCostBps = 1 * Math.floor(sellCoinAmount / 5) * plusMinus50Percent();
  //   const slippageCostBps = 1 * plusMinus50Percent();
  //   const hedgingCostBps = 1 * plusMinus50Percent();
  //   const exchangeFeeBps = 8; // Binance VIP3 fee tier is 6bps
  //   const serviceFeeBps = 2.5;

  //   const totalProportionalCostBps =
  //     spreadCostBps +
  //     stablecoinRedemptionCostBps +
  //     slippageCostBps +
  //     hedgingCostBps +
  //     exchangeFeeBps +
  //     serviceFeeBps;

  //   // Constant costs
  //   const blockchainGasCost = 20;
  //   const fiatWireTransferCost = 30;

  //   const totalConstantCost = blockchainGasCost + fiatWireTransferCost;

  //   // const blockchainGasCostBps = 0.1;
  //   // const fiatWireTransferCostBps = 0.05;

  //   const bestExchangePremiumBps = 0.5 * plusMinus50Percent();
  //   const bestExchangePrice =
  //     lastTradePrice * (1 + bestExchangePremiumBps / 10000);

  //   const amountYouWouldGetOnBestExchange = bestExchangePrice * sellCoinAmount;
  //   const totalFee =
  //     amountYouWouldGetOnBestExchange * (totalProportionalCostBps / 10000) +
  //     totalConstantCost;
  //   const buyCoinAmount = amountYouWouldGetOnBestExchange - totalFee;
  //   const totalFeeBps = (totalFee / buyCoinAmount) * 10000;
  //   const yourEffectivePrice = buyCoinAmount / sellCoinAmount;

  //   const spreadCost = buyCoinAmount * (spreadCostBps / 10000);
  //   const stablecoinRedemptionCost =
  //     buyCoinAmount * (stablecoinRedemptionCostBps / 10000);
  //   const slippageCost = buyCoinAmount * (slippageCostBps / 10000);
  //   const hedgingCost = buyCoinAmount * (hedgingCostBps / 10000);
  //   const exchangeFee = buyCoinAmount * (exchangeFeeBps / 10000);
  //   const serviceFee = buyCoinAmount * (serviceFeeBps / 10000);

  //   const blockchainGasCostBps = (blockchainGasCost / buyCoinAmount) * 10000;
  //   const fiatWireTransferCostBps =
  //     (fiatWireTransferCost / buyCoinAmount) * 10000;

  //   const alternativesDiscountBps =
  //     5 * (sellCoinAmount / 2) * plusMinusNPercent(25);
  //   const estimatedPriceOfAlternatives =
  //     yourEffectivePrice / (1 + alternativesDiscountBps / 10000);

  //   const yourSavingsWithAstra =
  //     (yourEffectivePrice - estimatedPriceOfAlternatives) * sellCoinAmount;
  //   const yourSavingsWithAstraBps =
  //     (yourSavingsWithAstra / buyCoinAmount) * 10000;

  //   return {
  //     spreadCostBps,
  //     blockchainGasCostBps,
  //     fiatWireTransferCostBps,
  //     stablecoinRedemptionCostBps,
  //     slippageCostBps,
  //     hedgingCostBps,
  //     exchangeFeeBps,
  //     serviceFeeBps,
  //     totalFeeBps,

  //     spreadCost,
  //     blockchainGasCost,
  //     fiatWireTransferCost,
  //     stablecoinRedemptionCost,
  //     slippageCost,
  //     hedgingCost,
  //     exchangeFee,
  //     serviceFee,
  //     totalFee,

  //     bestExchangePrice,
  //     yourEffectivePrice,
  //     estimatedPriceOfAlternatives,
  //     yourSavingsWithAstraBps,
  //     yourSavingsWithAstra,

  //     buyCoinAmount,
  //     sellCoinAmount,
  //   };
  // };

  // commented due to linting fails
  // const ewmaUpdate = (oldValue, newValue, fraction) => {
  //   return fraction * newValue + (1 - fraction) * oldValue;
  // };

  const handleRequestForQuote = async () => {
    const auth = await getAccessToken();
    setWizardStep("transitionToPreviewQuote");
    console.info("Connecting to quote feed...");
    const wsUrl =
      `${ASTRA_BASE_WS_URL}/ws?token=${auth.accessToken}` +
      `&method=StreamQuotes` +
      `&userId=5e6a08b3-430d-4d67-a8c2-1a420e30df97` +
      `&fromAsset=BTC` +
      `&toAsset=USD` +
      `&quantity=${inputValueSell}`;
    const ws = new WebSocket(wsUrl);
    ws.onmessage = async (e) => {
      const quote = JSON.parse(e.data);
      setLatestQuoteNew(quote);
    };
    wsRef.current = ws;
  };

  const handleCloseCurrencySelector = () => {
    setIsSelectingCurrency(false);
  };

  const handleClosePreviewQuote = () => {
    wsRef.current.close();
    setWizardStep("requestQuote");
  };

  const handleCloseTradeConfirmation = () => {
    setInputValueBuy(null);
    setInputValueSell(null);
    setWizardStep("requestQuote");
  };

  const handleCoinSelect = (coin) => {
    if (selectedDropdown === "buy_class_head") {
      setSelectedBuyCoin({
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
      });
      setInputValueBuy(null);
      setInputValueSell(null);
    } else if (selectedDropdown === "sell_class_head") {
      setSelectedSellCoin({
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
      });
      setInputValueBuy(null);
      setInputValueSell(null);
    }
  };

  const handleAcceptQuote = async () => {
    setShowLoader(true);

    await apiPost("/accept-quote", latestQuoteNew.quote);

    setConfirmedTrade({
      sellCoinAmount: latestQuoteNew.fromAssetQuantity,
      buyCoinAmount: latestQuoteNew.toAssetQuantity,
    });
    setWizardStep("tradeConfirmation");
    setShowLoader(false);
  };

  const loadingOverlay = () => (
    <div className="loader-overlay">
      <div className="loader"> Loading...</div>
    </div>
  );

  /// //////////////////////////////////////////////////////////////////////////////////////////////
  // TradeForm
  /// //////////////////////////////////////////////////////////////////////////////////////////////

  /// //////////////////////////////////////////////////////////////////////////////////////////////
  // CurrencySelector
  /// //////////////////////////////////////////////////////////////////////////////////////////////

  // function CurrencySelector() {
  //   const currencySelectorHeader = () => (
  //     <div className="search_header">
  //       <div className="header_currency">
  //         <p className="select_currency">Select Currency</p>
  //         <img
  //           className="close_button"
  //           onClick={handleCloseCurrencySelector}
  //           src={close.src}
  //           alt="close"
  //         />
  //       </div>
  //       <div className="input_search">
  //         <input
  //           type="text"
  //           name="search-form"
  //           id="search-form"
  //           className="search_bar"
  //           placeholder="Usd"
  //         />
  //         <img src={search.src} alt="search" />
  //       </div>
  //     </div>
  //   );

  //   const buyCurrencySelector = () => (
  //     <ul className="currencies_list">
  //       {coins.map((coin, index) => {
  //         // Check if the coin is not the selected sell coin
  //         if (coin.symbol !== selectedSellCoin.symbol) {
  //           return (
  //             <li key={index} onClick={() => handleCoinSelect(coin)}>
  //               <div className="search_list">
  //                 <img
  //                   className="tether_image"
  //                   src={coin.image?.src}
  //                   alt="image"
  //                 />
  //                 <div className="search_info">
  //                   <p className="currency_name_list">{coin.symbol}</p>
  //                   <p className="crypto_name_list">{coin.name}</p>
  //                 </div>
  //               </div>
  //             </li>
  //           );
  //         }
  //         throw new Error("Unreachable");
  //       })}
  //     </ul>
  //   );

  //   const sellCurrencySelector = () => (
  //     <ul className="currencies_list">
  //       {coins.map((coin, index) => {
  //         // Check if the coin is not the selected buy coin
  //         if (coin.symbol !== selectedBuyCoin.symbol) {
  //           return (
  //             <li key={index} onClick={() => handleCoinSelect(coin)}>
  //               <div className="search_list">
  //                 <img
  //                   className="tether_image"
  //                   src={coin.image?.src}
  //                   alt="image"
  //                 />
  //                 <div className="search_info">
  //                   <p className="currency_name_list">{coin.symbol}</p>
  //                   <p className="crypto_name_list">{coin.name}</p>
  //                 </div>
  //               </div>
  //             </li>
  //           );
  //         }
  //         throw new Error("Unreachable");
  //       })}
  //     </ul>
  //   );

  //   return (
  //     <div className="center">
  //       <div className="background">
  //         {currencySelectorHeader()}
  //         {selectedDropdown === "buy_class_head" && buyCurrencySelector()}
  //         {selectedDropdown === "sell_class_head" && sellCurrencySelector()}
  //       </div>
  //     </div>
  //   );
  // }

  /// //////////////////////////////////////////////////////////////////////////////////////////////
  // PreviewQuoteStep
  /// //////////////////////////////////////////////////////////////////////////////////////////////

  // function PreviewQuoteStep() {
  //   const flashableBgColor = `${flashUpdatedElements ? "bg-yellow-400/25" : "bg-inherit transition-colors ease-out duration-1000"}`;

  //   const durationToQuoteExpirySeconds = durationToQuoteExpiryMillis / 1000;

  //   const {
  //     spreadCostBps,
  //     blockchainGasCostBps,
  //     fiatWireTransferCostBps,
  //     stablecoinRedemptionCostBps,
  //     slippageCostBps,
  //     hedgingCostBps,
  //     exchangeFeeBps,
  //     serviceFeeBps,
  //     totalFeeBps,

  //     spreadCostUsd,
  //     blockchainGasCostUsd,
  //     fiatWireTransferCostUsd,
  //     stablecoinRedemptionCostUsd,
  //     slippageCostUsd,
  //     hedgingCostUsd,
  //     exchangeFeeUsd,
  //     serviceFeeUsd,
  //     totalFeeUsd,

  //     competitorStablecoinRedemptionCostBps,
  //     competitorSlippageCostBps,
  //     competitorHedgingCostBps,
  //     competitorExchangeFeeBps,
  //     competitorServiceFeeBps,

  //     competitorStablecoinRedemptionCostUsd,
  //     competitorSlippageCostUsd,
  //     competitorHedgingCostUsd,
  //     competitorExchangeFeeUsd,
  //     competitorServiceFeeUsd,

  //     competitorTotalFeeBps,
  //     competitorTotalFeeUsd,

  //     bestExchangePrice,
  //     yourEffectivePrice,
  //     estimatedPriceOfAlternatives,
  //     yourSavingsWithAstraBps,
  //     yourSavingsWithAstra,

  //     toAssetQuantity,
  //     fromAssetQuantity,
  //   } = latestQuoteNew ?? DEFAULT_QUOTE;

  //   const previewQuoteHeader = () => (
  //     <>
  //       <div className="header_quote">
  //         <p className="select_header">Preview Quote</p>
  //         <img
  //           className="close_button"
  //           onClick={handleClosePreviewQuote}
  //           src={close.src}
  //           alt="close"
  //         />
  //       </div>
  //       <div className="mb-8 text-sm text-yellow-400">
  //         Quote expires in:{" "}
  //         {Math.max(durationToQuoteExpirySeconds, 0).toFixed(1)} seconds
  //       </div>
  //     </>
  //   );

  //   const previewQuoteSellInfo = () => (
  //     <div>
  //       <div className="coin_price">
  //         <div className="coin_text">
  //           <img
  //             className="image_coin"
  //             src={selectedSellCoin.image.src}
  //             width={30}
  //             height={30}
  //             alt="bitcoin"
  //           />
  //           <span className="image_text">{selectedSellCoin.symbol}</span>
  //         </div>
  //         <span className="image_count text-red-400">
  //           {formatNumWithCommas(
  //             roundToNearestNthDecimal(fromAssetQuantity, 2),
  //           )}
  //         </span>
  //       </div>
  //     </div>
  //   );

  //   const previewQuoteBuyInfo = () => (
  //     <div className="coin_price">
  //       <div className="coin_text">
  //         <img
  //           className="image_coin"
  //           src={selectedBuyCoin.image.src}
  //           width={30}
  //           height={30}
  //           alt="usd"
  //         />
  //         <span className="image_text">{selectedBuyCoin.symbol}</span>
  //       </div>
  //       <span className={`image_count text-green-400 ${flashableBgColor}`}>
  //         {formatNumWithCommas(roundToNearestNthDecimal(toAssetQuantity, 2))}
  //       </span>
  //     </div>
  //   );

  //   const acceptQuoteButton = () => (
  //     <div>
  //       {/* <button className="bg-white text-black font-semibold w-[36rem] h-12 mt-6 shadow-sharp hover:bg-gray-200 active:shadow-none" onClick={handleAcceptQuote}> */}
  //       <button className="shadow-sharp-lg-purple mt-6 h-12 w-[36rem] bg-white font-semibold text-black hover:bg-gray-200 active:translate-x-1 active:translate-y-1 active:shadow-none">
  //         Accept Quote
  //       </button>
  //     </div>
  //   );

  //   const feeItems = [
  //     {
  //       name: "Blockchain txn gas cost",
  //       cost: blockchainGasCostUsd,
  //       bps: blockchainGasCostBps,
  //       competitorCost: blockchainGasCostUsd,
  //       competitorBps: blockchainGasCostBps,
  //     },
  //     {
  //       name: "Fiat wire transfer fee",
  //       cost: fiatWireTransferCostUsd,
  //       bps: fiatWireTransferCostBps,
  //       competitorCost: fiatWireTransferCostUsd,
  //       competitorBps: fiatWireTransferCostBps,
  //     },
  //     {
  //       name: "Spread",
  //       cost: spreadCostUsd,
  //       bps: spreadCostBps,
  //       competitorCost: spreadCostUsd,
  //       competitorBps: spreadCostBps,
  //     },
  //     {
  //       name: "Slippage",
  //       cost: slippageCostUsd,
  //       bps: slippageCostBps,
  //       competitorCost: competitorSlippageCostUsd,
  //       competitorBps: competitorSlippageCostBps,
  //     },
  //     {
  //       name: "Stablecoin redemption",
  //       cost: stablecoinRedemptionCostUsd,
  //       bps: stablecoinRedemptionCostBps,
  //       competitorCost: competitorStablecoinRedemptionCostUsd,
  //       competitorBps: competitorStablecoinRedemptionCostBps,
  //     },
  //     {
  //       name: "Hedging cost",
  //       cost: hedgingCostUsd,
  //       bps: hedgingCostBps,
  //       competitorCost: competitorHedgingCostUsd,
  //       competitorBps: competitorHedgingCostBps,
  //     },
  //     {
  //       name: "Exchange fee",
  //       cost: exchangeFeeUsd,
  //       bps: exchangeFeeBps,
  //       competitorCost: competitorExchangeFeeUsd,
  //       competitorBps: competitorExchangeFeeBps,
  //     },
  //     {
  //       name: "Service fee",
  //       cost: serviceFeeUsd,
  //       bps: serviceFeeBps,
  //       competitorCost: competitorServiceFeeUsd,
  //       competitorBps: competitorServiceFeeBps,
  //     },
  //   ];

  //   const feeItem = (name, cost, bps, competitorCost, competitorBps, key) => (
  //     <div key={key} className="flex flex-row gap-2">
  //       <div>{name}</div>
  //       <div className="ml-auto basis-24 text-right">
  //         <span className={flashableBgColor}>
  //           ({roundToNSignificantDigits(competitorBps, 2)} bps)
  //         </span>
  //       </div>
  //       <div className="basis-24 text-right">
  //         <span className={flashableBgColor}>
  //           {roundToNearestNthDecimal(competitorCost, 2)} USD
  //         </span>
  //       </div>
  //       <div className="basis-24 text-right">
  //         <span className={flashableBgColor}>
  //           ({roundToNSignificantDigits(bps, 2)} bps)
  //         </span>
  //       </div>
  //       <div className="basis-24 text-right">
  //         <span className={flashableBgColor}>
  //           {roundToNearestNthDecimal(cost, 2)} USD
  //         </span>
  //       </div>
  //     </div>
  //   );

  //   return (
  //     <div className="flex w-full flex-col items-center justify-center">
  //       <div className="shadow-sharp-lg-gray mr-1 w-[700px] border border-gray-800 p-6">
  //         {previewQuoteHeader()}
  //         {previewQuoteSellInfo()}
  //         <img className="arrow_image" src={arrow.src} alt="arrow" />
  //         {previewQuoteBuyInfo()}
  //         <div className="mt-8 flex flex-col text-xs text-white">
  //           <div className="flex flex-row justify-between">
  //             <div>
  //               Best exchange price
  //               <br />
  //               <span className="text-gray-400">
  //                 (via Astra <span className="font-bold">Smart Routing</span>)
  //               </span>
  //             </div>
  //             <div className={flashableBgColor}>
  //               {formatNumWithCommas(
  //                 roundToNearestNthDecimal(bestExchangePrice, 2),
  //               )}{" "}
  //               USD
  //             </div>
  //           </div>

  //           <div className="text-right text-2xl">-</div>

  //           <div className="flex flex-col">
  //             <div className="flex flex-row gap-1">
  //               <div>Estimated transaction costs</div>
  //               <div className="ml-auto basis-48 bg-red-400/25 text-center">
  //                 Competitors
  //               </div>
  //               <div className="basis-48 bg-green-400/25 text-center">
  //                 Astra
  //               </div>
  //             </div>
  //             {feeItem(
  //               "Total",
  //               totalFeeUsd,
  //               totalFeeBps,
  //               competitorTotalFeeUsd,
  //               competitorTotalFeeBps,
  //             )}
  //             <div className="pl-3 text-gray-400">
  //               {feeItems
  //                 .sort((a, b) => b.cost - a.cost)
  //                 .map(
  //                   ({ name, cost, bps, competitorCost, competitorBps }, i) =>
  //                     feeItem(
  //                       name,
  //                       cost,
  //                       bps,
  //                       competitorCost,
  //                       competitorBps,
  //                       i,
  //                     ),
  //                 )}
  //             </div>
  //           </div>

  //           <div className="text-right text-2xl">=</div>

  //           <div className="flex flex-row justify-between">
  //             <div>Your effective price</div>
  //             <div className={flashableBgColor}>
  //               {formatNumWithCommas(
  //                 roundToNearestNthDecimal(yourEffectivePrice, 2),
  //               )}{" "}
  //               USD
  //             </div>
  //           </div>

  //           <div className="my-4 flex flex-row justify-between">
  //             <div>Estimated price of alternatives</div>
  //             <div className={flashableBgColor}>
  //               {formatNumWithCommas(
  //                 roundToNearestNthDecimal(estimatedPriceOfAlternatives, 2),
  //               )}{" "}
  //               USD
  //             </div>
  //           </div>

  //           <div className="mt-4 flex flex-row text-base">
  //             <div>Your savings with Astra</div>
  //             {/* <div className="basis-20 text-right ml-auto text-green-400">({roundToNSignificantDigits(5, 2)} bps)</div>
  //             <div className="basis-36 text-right text-green-400">{roundToNearestNthDecimal(buyCoinAmount * 0.0005, 2)} USD</div> */}
  //             <div
  //               className={`basis-24 text-right text-green-400 ${flashableBgColor} ml-auto`}
  //             >
  //               ({roundToNSignificantDigits(yourSavingsWithAstraBps, 2)} bps)
  //             </div>
  //             <div
  //               className={`basis-28 text-right text-green-400 ${flashableBgColor}`}
  //             >
  //               {formatNumWithCommas(
  //                 roundToNearestNthDecimal(yourSavingsWithAstra, 2),
  //               )}{" "}
  //               USD
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       {acceptQuoteButton()}
  //     </div>
  //   );
  // }

  /// //////////////////////////////////////////////////////////////////////////////////////////////
  // TradeConfirmatiionStep
  /// //////////////////////////////////////////////////////////////////////////////////////////////

  // function TradeConfirmationStep() {
  //   const { sellCoinAmount, buyCoinAmount } = confirmedTrade;
  //   return (
  //     <div className="center">
  //       <div className="sucess_container">
  //         <img
  //           className="close_button_sucess"
  //           onClick={handleCloseTradeConfirmation}
  //           src={close.src}
  //           alt="close"
  //         />
  //         <div className="sucess_img">
  //           <img src={sucess.src} alt="sucess" />
  //           <p className="sucess_price">
  //             {sellCoinAmount} {selectedSellCoin.symbol} →{" "}
  //             {formatNumWithCommas(roundToNearestNthDecimal(buyCoinAmount, 2))}{" "}
  //             {selectedBuyCoin.symbol}
  //           </p>
  //           <p className="trade_status">Trade Confirmed</p>
  //         </div>
  //       </div>
  //       <button
  //         onClick={() => {
  //           window.location.href = "/history";
  //         }}
  //         className="button_group"
  //       >
  //         Trade History
  //       </button>
  //     </div>
  //   );
  // }

  /// //////////////////////////////////////////////////////////////////////////////////////////////
  // Otc
  /// //////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {showLoader && loadingOverlay()}
      {!isSelectingCurrency &&
        (inRequestQuoteStep || inTransitionToPreviewQuoteStep) && (
          <TradeForm
            setSelectedDropdown={setSelectedDropdown}
            handleInputChangeBuy={handleInputChangeBuy}
            handleCurrencySelectRequest={handleCurrencySelectRequest}
            selectedBuyCoin={selectedBuyCoin}
            inputValueBuy={inputValueBuy}
            selectedSellCoin={selectedSellCoin}
            inputValueSell={inputValueSell}
            handleInputChangeSell={handleInputChangeSell}
            handleRequestForQuote={handleRequestForQuote}
            rotation={rotation}
            swapBuyAndSellCoins={swapBuyAndSellCoins}
          />
        )}
      {isSelectingCurrency && (
        <CurrencySelector
          handleCloseCurrencySelector={handleCloseCurrencySelector}
          selectedSellCoin={selectedSellCoin}
          handleCoinSelect={handleCoinSelect}
          selectedBuyCoin={selectedBuyCoin}
          selectedDropdown={selectedDropdown}
        />
      )}
      {inPreviewQuoteStep && (
        <PreviewQuoteStep
          flashUpdatedElements={flashUpdatedElements}
          durationToQuoteExpiryMillis={durationToQuoteExpiryMillis}
          latestQuoteNew={latestQuoteNew}
          handleClosePreviewQuote={handleClosePreviewQuote}
          selectedSellCoin={selectedSellCoin}
          selectedBuyCoin={selectedBuyCoin}
          onAcceptQuote={handleAcceptQuote}
        />
      )}
      {inTradeConfirmationStep && (
        <TradeConfirmationStep
          confirmedTrade={confirmedTrade}
          handleCloseTradeConfirmation={handleCloseTradeConfirmation}
          selectedSellCoin={selectedSellCoin}
          selectedBuyCoin={selectedBuyCoin}
        />
      )}
    </>
  );
}

export default Otc;
