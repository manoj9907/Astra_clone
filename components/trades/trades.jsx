// E:\astra_components\astra-terminal\app\components\lit\components\trades\trades.js

import React, { useState, useEffect } from "react";
import TradesbookSide from "./trades-side";
import processTrades from "./tradeDataHandle";
import { ASTRA_BASE_WS_URL } from "@/constants";

function Trades() {
  const [trades, setTrades] = useState([]);
  const [precisionPrice, setPrecisionPrice] = useState(2);
  const [getMarket] = useState("BINANCE-SPOT-BTC-USDT");
  const [getDataType] = useState("TRADE");

  const startSubscription = () => {
    // setLocalOrderbook({ bids: [], asks: [] });
  };

  useEffect(() => {
    const astraWS = new WebSocket(
      `${ASTRA_BASE_WS_URL}/ws?market=${getMarket}&dataType=${getDataType}`,
    );
    const getSocket = async () => {
      astraWS.onmessage = async (event) => {
        const jsonData = JSON.parse(event.data);
        const resPonse = await processTrades(jsonData);
        setTrades(resPonse);
      };
    };
    getSocket();

    const subscription = {
      action: "SUBSCRIBE",
      payload: {
        exchange: "BINANCE",
        market: {
          baseAsset: {
            type: "SPOT",
            asset: "BTC",
          },
          quoteAsset: "USDT",
        },
        dataType: "ORDERBOOK",
      },
    };

    startSubscription(subscription);
    return () => {
      astraWS.close();
    };
  }, []);

  const getPricePrecision = (precision) => {
    setPrecisionPrice(precision.detail);
  };

  return (
    <div className="flex h-full flex-col gap-2 bg-black font-mono text-xs">
      <div className="flex flex-col gap-1">
        <div className="hidden pt-2 text-center font-mono font-bold text-gray-300 xl:block">
          Trades
        </div>
        <div className="flex w-full flex-row justify-between px-4 text-gray-400">
          <div className="basis-1/3 text-start font-mono">Price</div>
          <div className="basis-1/3 text-center font-mono">Quantity</div>
          <div className="basis-1/3 text-end font-mono">Time</div>
        </div>
      </div>
      <TradesbookSide
        message={trades}
        getPricePrecision={getPricePrecision}
        precisionPrice={precisionPrice}
      />
    </div>
  );
}

export default Trades;
