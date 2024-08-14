import React, { memo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserSubscription } from "@/app/context/SubscriptionContext";
import binance from "@/assets/exchanges/binance.png";
import coinbase from "@/assets/exchanges/coinbase.png";
import huobi from "@/assets/exchanges/huobi.png";
import kucoin from "@/assets/exchanges/kucoin.png";
import okx from "@/assets/exchanges/okx.png";
import SearchWidget from "@/components/searchBar/searchWidget";
import { UserAuth } from "@/app/context/AuthContext";

const ICONS = {
  BINANCE: binance,
  COINBASE: coinbase,
  COINBASEPRO: coinbase,
  // CURVE: curve,
  HUOBI: huobi,
  // KRAKENSPOT: kraken,
  // KRAKENFUTURES: kraken,
  KUCOIN: kucoin,
  OKX: okx,
  // UNISWAP: uniswap,
};

const printAssetPair = (subscription) => {
  let asset = "";
  //  console.log('asset', subscription)
  if (subscription.market.baseAsset.type === "SPOT") {
    asset = subscription.market.baseAsset.asset;
  } else {
    asset = subscription.market.baseAsset.underlying;
  }
  return `${asset}/${subscription.market.quoteAsset}`;
};

function Ticker({ screenSize }) {
  const { subscription } = UserSubscription();
  const { tabId } = UserAuth();
  const sub = subscription.ConstructSubscriptionObject();
  const icon = ICONS[sub.exchange];
  const [broadcastChannelLTP] = useState(
    new BroadcastChannel(`ticker-price${tabId}`),
  );
  const [broadcastChannelMid] = useState(
    new BroadcastChannel(`ticker-mid-price${tabId}`),
  );
  const [price, setPrice] = useState(0);
  const [ltpPrice, setLtpPrice] = useState(0);
  const router = useRouter();
  // console.log('broadcastChannelLTP', broadcastChannelLTP);
  broadcastChannelLTP.onmessage = (e) => {
    // console.log('Trades', e);
    setPrice(e.data.ltp);
    setLtpPrice(e.data.ltp);
  };
  // fallback value is taken from mid price calculation
  broadcastChannelMid.onmessage = (e) => {
    // console.log('Trades', e);
    if (
      typeof ltpPrice === "undefined" ||
      ltpPrice === undefined ||
      ltpPrice === null ||
      ltpPrice === ""
    ) {
      setPrice(e.data.mid);
    }
  };

  const handleNavigate = () => {
    router.push("/search");
  };

  return screenSize > 1280 ? (
    <div className="font-white flex h-full w-full basis-full flex-row items-center justify-items-start border-l border-gray-400/25 bg-black font-mono text-xs ">
      {/* Spilt the section and use the first half */}
      <div className="font-white justify-items-star ml-6 flex h-full w-full basis-6/12 flex-row items-center gap-6 bg-black font-mono text-xs">
        <div className=" relative order-first h-full w-full grow-0 basis-8">
          <Image
            src={icon}
            alt={sub.exchange}
            fill
            className="pointer-events-none h-6 w-full basis-2 place-self-center object-scale-down py-1.5"
          />
        </div>
        <div className="flex flex-auto grow basis-full flex-row justify-items-start gap-5">
          <div className=" order-first flex flex-col justify-center justify-items-start place-self-start">
            <div className="basis-1/2 font-bold text-gray-400">
              {printAssetPair(sub)}
            </div>
            <div className="basis-1/2 text-gray-400">{sub.exchange}</div>
          </div>
          <div className="place-self-center text-center font-bold text-white">
            {price}
          </div>
        </div>
      </div>
      <div className="order-last h-full basis-2/12 place-items-stretch pr-2">
        <SearchWidget handleNavigate={handleNavigate} />
      </div>
      <div className="font-white justify-items-star flex h-full w-full basis-full flex-row items-center bg-black font-mono text-xs" />
    </div>
  ) : (
    <div className="flex h-12 w-full flex-row items-center justify-between  bg-black px-5 text-xs">
      <div className="flex flex-row items-center gap-2">
        <Image
          src={icon}
          alt={sub.exchange}
          className="pointer-events-none h-8 w-8 object-contain"
        />
        <div className="flex flex-col">
          <div className="font-bold text-gray-400">{printAssetPair(sub)}</div>
          <div className="text-gray-400">{sub.exchange}</div>
        </div>
      </div>
      <div className="place-self-center text-center font-bold text-white">
        {price}
      </div>
      <div className=" h-full w-[35%] place-items-stretch xl:pr-2">
        <SearchWidget handleNavigate={handleNavigate} />
      </div>
    </div>
  );
}

export default memo(Ticker);
