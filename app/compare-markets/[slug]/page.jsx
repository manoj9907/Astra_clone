"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { roundToNSignificantDigits, formatNumWithCommas } from "@/utils/format";
import { TradingViewWidgetNew } from "@/components/chart/chart";
import { apiGet } from "@/services/requests";
import { getAccessToken } from "@/app/util";
import { ASTRA_BASE_WS_URL } from "@/constants";

const DATA_REFRESH_INTERVAL_MILLIS = 1000;
const RENDER_INTERVAL_SECS = 0.2;

const EXCHANGE_FEES_BPS = {
  // https://www.binance.com/en/fee/schedule
  binance: 10,
  // https://www.coinbase.com/advanced-fees
  coinbase: 80,
  // https://www.okx.com/fees
  okx: 10,
  // https://www.htx.com/fee/
  huobi: 20,
  // https://www.kucoin.com/vip/privilege
  kucoin: 10,
  // https://www.kraken.com/features/fee-schedule
  kraken: 40,
};

const getExchange = (market) => {
  const split = market.split("-");
  const exchange = split[0].toLowerCase();
  // if (exchange === "KRAKENSPOT") {
  //     exchange = "KRAKEN";
  // }
  return exchange;
};

function DataSection({ className, children, name }) {
  return (
    <div className={`${className} text-xs`}>
      <span className="text-gray-400/50">{name}</span>
      <div className="pl-2">{children}</div>
    </div>
  );
}

function DataItem({ className, children, name }) {
  return (
    <div className={`${className}`}>
      <span className="text-gray-400/75">{name}:</span> {children}
    </div>
  );
}

// const setIntervalAfterOffset = (callback, intervalMillis, offsetMillis) => {
//     const now = Date.now();
//     const timeToNextInterval = interval - (now - offsetMillis) % interval;
//     setTimeout(() => {
//         callback();
//         return setInterval(callback, interval);
//     }, timeToNextInterval);
// };

const SENTENCE_CASE_EXCHANGE_NAMES = {
  BINANCE: "Binance",
  COINBASE: "Coinbase",
  OKX: "OKX",
  HUOBI: "Huobi",
  KRAKEN: "Kraken",
  KUCOIN: "Kucoin",
};

function MarketDoesNotExistMessage({ exchange }) {
  return (
    <div className="mx-4 flex items-center justify-center text-center text-xs">
      This market does not exist on {SENTENCE_CASE_EXCHANGE_NAMES[exchange]}
    </div>
  );
}

function MarketComponent({ className, exchange, market }) {
  if (market === null) {
    return <MarketDoesNotExistMessage exchange={exchange} />;
  }

  return <MarketComponentInner className={className} market={market} />;
}

function MarketComponentInner({ className, market }) {
  const ref = useRef({});
  const renderIntervalRef = useRef(null);
  const tradeConnRef = useRef(null);
  const latestTradeRef = useRef(null);

  const [latestTrade, setLatestTrade] = useState(null);

  const [sampledData, setSampledData] = useState({});
  const midPrice = sampledData?.midPrice;
  const spread = sampledData?.spread;
  const tradePriceEwma = sampledData?.tradePriceEwma;
  const smallTradeExecutionPrice = sampledData?.smallTradeExecutionPrice;
  const largeTradeExecutionPrice = sampledData?.largeTradeExecutionPrice;

  const [currentTimeMillis, setCurrentTimeMillis] = useState(Date.now());

  const [accessToken, setAccessToken] = useState("");

  const queryKeys = {
    midPrice: ["/mid-price", { market }],
    spread: ["/spread", { market }],
    tradePriceEwma: ["/trade-price-ewma", { market }],
    smallTradeExecutionPrice: [
      "/execution-price",
      { market, side: "buy", quantity: 1 },
    ],
    largeTradeExecutionPrice: [
      "/execution-price",
      { market, side: "buy", quantity: 10 },
    ],
  };

  for (const queryKey of Object.values(queryKeys)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey,
      queryFn: () => apiGet(...queryKey),
      refetchInterval: DATA_REFRESH_INTERVAL_MILLIS,
      select: (data) => {
        ref.current[queryKey] = data;
      },
    });
  }

  useEffect(() => {
    getAccessToken().then((result) => {
      setAccessToken(result?.accessToken);
    });

    const tradesUrl =
      `${ASTRA_BASE_WS_URL}/ws?token=${accessToken}` +
      "&method=StreamTradeUpdates" +
      `&market=${market}`;
    const tradeConn = new WebSocket(tradesUrl);
    tradeConn.onmessage = async (e) => {
      const data = JSON.parse(e.data);
      const lastTrade = data.trades[data.trades.length - 1];
      latestTradeRef.current = lastTrade;
    };
    tradeConnRef.current = tradeConn;

    const renderIntervalId = setInterval(() => {
      setSampledData(
        Object.fromEntries(
          Object.entries(queryKeys).map(([name, queryKey]) => [
            name,
            ref.current[queryKey],
          ]),
        ),
      );
      setLatestTrade(latestTradeRef.current);
      setCurrentTimeMillis(Date.now());
    }, RENDER_INTERVAL_SECS * 1000);
    renderIntervalRef.current = renderIntervalId;

    return () => {
      tradeConnRef.current.close();
      clearInterval(renderIntervalRef.current);
    };
  }, [accessToken]);

  const latestTradePrice = latestTrade?.price;
  const latestTradeSide = latestTrade?.side ?? "Buy";
  const tradeColor =
    latestTradeSide === "buy" ? "text-green-400" : "text-red-400";
  const latestTradeTimeMillis = latestTrade?.time;
  const timeSinceLastTradeMillis = currentTimeMillis - latestTradeTimeMillis;
  const timeSinceLastTradeSecs = timeSinceLastTradeMillis / 1000;
  let timeColor;
  if (Number.isNaN(timeSinceLastTradeSecs)) {
    timeColor = "text-white";
  } else if (timeSinceLastTradeSecs < 5) {
    timeColor = "text-white";
  } else {
    timeColor = "text-yellow-400";
  }

  // const deviationColor = "text-red-400";

  const btc1SlippageBps = (smallTradeExecutionPrice / midPrice - 1) * 10_000;
  const btc10SlippageBps = (largeTradeExecutionPrice / midPrice - 1) * 10_000;

  const btc1SlippageBpsFormatted = btc1SlippageBps
    ? roundToNSignificantDigits(btc1SlippageBps, 3)
    : "-";
  const btc10SlippageBpsFormatted = btc10SlippageBps
    ? roundToNSignificantDigits(btc10SlippageBps, 3)
    : "-";

  return (
    <div
      className={`${className} flex flex-col items-center gap-2 border border-gray-400/50 px-4 pb-4 pt-2`}
    >
      {market}
      <TradingViewWidgetNew market={market} />
      <div className="flex w-full flex-col items-start gap-2">
        <DataSection name="Price">
          <DataItem name="Mid price">
            {formatNumWithCommas(midPrice ?? "-")}
          </DataItem>
          <DataItem name="Mid price EWMA">
            {formatNumWithCommas(tradePriceEwma ?? "-")}
          </DataItem>
          <DataItem name="Last trade price">
            <span className={tradeColor}>
              {formatNumWithCommas(latestTradePrice ?? "-")}
            </span>
          </DataItem>
          <DataItem name="Time since last trade">
            <span className={timeColor}>
              {!Number.isNaN(timeSinceLastTradeSecs)
                ? `${timeSinceLastTradeSecs} secs`
                : "-"}
            </span>
          </DataItem>
          {/* <DataItem name="Deviation from mean">
            <span className={deviationColor}>- bps</span>
          </DataItem> */}
        </DataSection>
        <DataSection name="Liquidity">
          <DataItem name="Slippage for 1 BTC order">
            {btc1SlippageBpsFormatted} bps
          </DataItem>
          <DataItem name="Slippage for 10 BTC order">
            {btc10SlippageBpsFormatted} bps
          </DataItem>
          <DataItem name="Spread">
            {formatNumWithCommas(spread * 10_000 ?? "-")} bps
          </DataItem>
        </DataSection>
        <DataSection name="Fees">
          <DataItem name="Exchange fee (regular tier)">
            {EXCHANGE_FEES_BPS[getExchange(market)]} bps
          </DataItem>
          {/* <DataItem name="Funding rate">1 bps</DataItem> */}
        </DataSection>
      </div>
    </div>
  );
}

function extractInstrumentInfoFromSlug(slug) {
  const perpPattern = "(.*)-PERP";

  let assetType;
  let underlying;

  const perpMatch = slug.match(perpPattern);
  if (perpMatch !== null) {
    assetType = "PERP";
    [, underlying] = perpMatch;
  } else {
    assetType = "SPOT";
    underlying = slug;
  }

  return { assetType, underlying };
}

function formatUnderlyingSymbolForExchange(exchange, assetType, underlying) {
  // if (exchange === "KUCOIN" && assetType === "PERP" && underlying === "BTC") {
  //   return "XBT";
  // }

  return underlying;
}

// If this function returns null, we interpret that as meaning that the specified exchange does
// not have a market for this assetType and underlying
function instrumentToSymbolForExchange(exchange, assetType, underlying) {
  if (assetType === "SPOT") {
    if (
      (exchange === "COINBASE" || exchange === "KRAKEN") &&
      (underlying === "BNB" || underlying === "TRX")
    ) {
      return null;
    }
  }
  if (assetType === "SPOT") {
    let quoteAssetSymbol;
    if (exchange === "COINBASE") {
      quoteAssetSymbol = "USD";
    } else {
      quoteAssetSymbol = "USDT";
    }
    const underlyingSymbol = formatUnderlyingSymbolForExchange(
      exchange,
      assetType,
      underlying,
    );
    return `${exchange}-SPOT-${underlyingSymbol}-${quoteAssetSymbol}`;
  }

  if (assetType === "PERP") {
    if (exchange === "COINBASE") {
      return null;
    }

    let quoteAssetSymbol;
    if (exchange === "KRAKEN") {
      quoteAssetSymbol = "USD";
    } else {
      quoteAssetSymbol = "USDT";
    }
    const underlyingSymbol = formatUnderlyingSymbolForExchange(
      exchange,
      assetType,
      underlying,
    );
    return `${exchange}-PERP-${underlyingSymbol}-${quoteAssetSymbol}`;
  }

  return null;
}

function Page({ params }) {
  const queryClient = new QueryClient();
  const { assetType, underlying } = extractInstrumentInfoFromSlug(params.slug);
  const exchangeList = [
    "BINANCE",
    "COINBASE",
    "OKX",
    "HUOBI",
    "KRAKEN",
    "KUCOIN",
  ];
  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid h-full w-full grid-cols-3 grid-rows-2 text-white">
        {exchangeList.map((exchange) => (
          <MarketComponent
            key={exchange}
            exchange={exchange}
            market={instrumentToSymbolForExchange(
              exchange,
              assetType,
              underlying,
            )}
          />
        ))}
      </div>
    </QueryClientProvider>
  );
}

export default Page;
