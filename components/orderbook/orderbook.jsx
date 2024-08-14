import React, { useState, useEffect, memo } from "react";
import OrderbookSide from "./orderbook-side";
import processOrdebook from "./orderDataHandle";
import { ASTRA_BASE_WS_URL } from "@/constants";

function Orderbook({ screenSize }) {
  const [tabId] = useState("");
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [mid, setMid] = useState(0);
  const [spread, setSpread] = useState(0);
  const [precisionPrice] = useState(2);
  const [getMarket] = useState("BINANCE-SPOT-BTC-USDT");
  const [getDataType] = useState("ORDERBOOK");
  useEffect(() => {
    const astraWS = new WebSocket(
      `${ASTRA_BASE_WS_URL}/ws?market=${getMarket}&dataType=${getDataType}`,
    );
    const calculateMid = (first, second) => Math.sqrt(first * second);
    const calculateSpred = (ask, bid) => {
      if (mid === 0 || Number.isNaN(mid)) return 0;
      const bpsAsk = Math.abs(((ask - mid) / mid) * 100);
      const bpsbid = Math.abs(((mid - bid) / mid) * 100);
      return Number.isFinite(bpsAsk) && Number.isFinite(bpsbid)
        ? bpsAsk + bpsbid
        : 0;
    };
    const getSocket = async () => {
      let messageCounter = 0;
      astraWS.onmessage = async (event) => {
        const jsonData = JSON.parse(event.data);
        messageCounter += 1;
        const localOrderbook = await processOrdebook(jsonData, messageCounter);
        setAsks(localOrderbook.asks);
        setBids(localOrderbook.bids);
        if (localOrderbook.asks) {
          const newMid = calculateMid(
            localOrderbook.asks[localOrderbook.asks.length - 1]?.price,
            localOrderbook.bids[0]?.price,
          );
          setMid(newMid);
          setSpread(
            calculateSpred(
              localOrderbook.asks[localOrderbook.asks.length - 1]?.price,
              localOrderbook.bids[0]?.price,
            ),
          );
        }
      };
    };
    getSocket();
    return () => {
      // broadcastChannel.close();
      // broadcastChannelMid.close();
      astraWS.close();
    };
  }, [tabId, precisionPrice]);

  return screenSize > 1280 ? (
    <div className="flex h-full flex-col gap-2 bg-black pt-2 font-mono text-xs">
      <div className="flex flex-col gap-1">
        <div className="text-center font-bold text-gray-300">Order Book</div>
        <div className=" flex w-full flex-row justify-between px-4 text-gray-400">
          <div className="basis-1/2 text-start">Price</div>
          <div className="text-end font-mono">Quantity</div>
        </div>
      </div>
      <div className="flex basis-full flex-col">
        <div className="flex basis-1/2 flex-col pb-0.5">
          <OrderbookSide name="ask" message={asks} />
        </div>
        <div className="flex w-full flex-row items-center justify-between border-y border-gray-400/25 px-4 py-1 ">
          <div className="basis-1/2 text-start text-sm text-green-500 ">
            {mid.toFixed(precisionPrice)}
          </div>
          <div className="  text-end">
            <div>
              <span className="text-gray-400">Spread</span>
              <span className="pl-1 font-mono">{spread.toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <div className=" flex basis-1/2 flex-col justify-start pt-0.5 font-mono">
          <OrderbookSide name="bid" message={bids} />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex h-full gap-1  bg-black p-3 font-mono text-xs text-white">
      <div className="ask w-1/2">
        <div className=" mb-2 flex w-full flex-row  justify-between text-gray-400">
          <div className="basis-1/2 text-start">Price</div>
          <div className="text- mr-1.5 font-mono">Quantity</div>
        </div>
        <OrderbookSide name="ask" message={asks} />
      </div>
      <div className="bid w-1/2">
        <div className=" mb-2 flex w-full flex-row  justify-between text-gray-400">
          <div className="basis-1/2 text-start">Price</div>
          <div className="mr-1.5 text-end font-mono">Quantity</div>
        </div>
        <OrderbookSide name="bid" message={bids} />
      </div>
    </div>
  );
}

export default memo(Orderbook);
