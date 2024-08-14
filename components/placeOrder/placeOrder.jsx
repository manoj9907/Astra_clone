import React, { useState } from "react";
import Link from "next/link";
import { UserSubscription } from "@/app/context/SubscriptionContext";
import { Button } from "../ui/button";
import { Input, InputWithUnits } from "../input";

function PlaceOrder({ text, closeModel }) {
  const { subscription } = UserSubscription();
  const [leverage, setLeverage] = useState(50);
  const [exchangeKeyAvailable] = useState(true);
  // const [featureInProgress] = useState(true);

  const handleSlider = (e) => {
    setLeverage(e.target.value);
  };

  return (
    <div className="relative h-full w-full">
      {exchangeKeyAvailable ? (
        <div className="flex h-full w-full flex-col place-items-stretch gap-1 border-b border-gray-400/25 font-mono text-xs text-white">
          <div className="mt-1 hidden place-self-center p-2 text-center font-bold text-gray-300 xl:block">
            Place Order
          </div>
          <div className="flex flex-row border-y border-gray-400/25 text-gray-300">
            <div className="h-full grow basis-1/2 bg-neutral-900 p-2 text-center">
              Limit
            </div>
            <div className="h-full grow basis-1/2 p-2 text-center ">Market</div>
          </div>

          <div className="flex flex-col p-1 px-5 xl:px-6">
            <span className="mt-3 h-full w-full place-self-start bg-black text-left text-gray-400">
              Quantity
            </span>
            <div className="mt-2">
              {" "}
              <InputWithUnits
                size="compact"
                symbol={subscription.ExtractAssets().baseAsset}
                inputWidth="w-3/4"
              />
            </div>
            <div className="mt-5">
              {" "}
              <InputWithUnits
                size="compact"
                symbol={subscription.ExtractAssets().quoteAsset}
                inputWidth="w-3/4"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 p-1 px-5 xl:px-6">
            <span className="h-full w-full place-self-start bg-black text-left text-gray-400">
              Limit Price
            </span>
            <Input
              size="compact"
              className="w-3/4"
              type="number"
              placeholder="0"
            />
          </div>

          <div className="flex flex-col p-1 px-5 xl:px-6">
            <div className="h-full flex-auto basis-full place-content-start text-left">
              <span className="h-full w-full place-self-start bg-black text-left text-gray-400">
                Leverage
              </span>
            </div>
            <div className="flex w-full flex-auto grow basis-full flex-row">
              <div className="flex h-12 w-full flex-auto basis-full justify-center p-1">
                <div className="flex w-full flex-auto grow-0 flex-row gap-1.5 rounded-md">
                  <input type="range" value={leverage} onInput={handleSlider} />
                  <div className="place-self-center">{leverage}%</div>
                </div>
              </div>
            </div>
          </div>
          {!text ? (
            <div className="flex flex-col p-1">
              <div className="flex w-full grow flex-row gap-3">
                <div className="flex h-12 basis-1/2 pl-5">
                  <Button
                    variant="green"
                    size="compact"
                    className="w-full font-bold"
                  >
                    Buy
                  </Button>
                </div>
                <div className="flex h-12 basis-1/2 justify-end pr-5">
                  <Button
                    variant="red"
                    size="compact"
                    className="w-full font-bold"
                  >
                    Sell
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-10 flex h-12 w-full flex-auto basis-1/2 justify-center p-1 ">
              <div className="flex w-full grow flex-row gap-3">
                <div className="fflex h-12 basis-1/2 pl-4">
                  <Button
                    variant="green"
                    size="compact"
                    onClick={closeModel}
                    className="w-full font-bold"
                  >
                    Buy
                  </Button>
                </div>
                <div className="flex h-12 basis-1/2 justify-end pr-4">
                  <Button
                    variant="red"
                    size="compact"
                    onClick={closeModel}
                    className="w-full font-bold"
                  >
                    Sell
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="z-10 flex h-full w-full cursor-pointer flex-col items-center justify-center border-x border-gray-400/25 bg-black p-5 text-center font-mono text-xs text-white">
          <Link href="/vault">
            <div>
              Please provide the Exchange API Key in vault to activate this
              feature
            </div>
          </Link>
        </div>
      )}
      {/* {featureInProgress && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-85 text-gray-100 text-sm">
          Feature Under Development
        </div>
      )} */}
    </div>
  );
}

export default PlaceOrder;
