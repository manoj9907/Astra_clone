"use client";

import React, { useState } from "react";
import Orderbook from "@/components/orderbook/orderbook";
import Trades from "@/components/trades/trades";
import OrderHistory from "@/components/orderHistory/orderHistory";
import Ticker from "@/components/ticker/ticker";
import { TradingViewWidget } from "@/components/chart/chart";
import PlaceOrder from "@/components/placeOrder/placeOrder";
import { UserSubscription } from "@/app/context/SubscriptionContext";
import { UserAuth } from "@/app/context/AuthContext";
import useWidth from "../../components/customHooks/useWidth";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { subscription } = UserSubscription();
  const { tabId, controllNav, setControllNav } = UserAuth();
  const [activeTab, setActiveTab] = useState("tab1");
  const [showPlaceOrder, setShowPlaceOrder] = useState({
    status: false,
    value: null,
  });
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const width = useWidth();
  if (width === 0) return <div />;
  return (
    //   The main page is split into 2 rows
    <main className="flex grow flex-col overflow-y-auto bg-black">
      {width < 1280 ? (
        <>
          <div className="flex h-12 grow-0 flex-row flex-wrap-reverse gap-4 bg-black">
            <div className="flex w-full flex-auto bg-black">
              <Ticker screenSize={width} />
            </div>
          </div>
          {showPlaceOrder?.status && controllNav ? (
            <PlaceOrder
              text={showPlaceOrder.value}
              closeModel={() => {
                setShowPlaceOrder({ status: false, value: null });
                setControllNav(false);
              }}
            />
          ) : (
            <div>
              <div
                className={`flex justify-between border-t border-gray-400/25 ${activeTab !== "tab1" ? "border-b" : ""}`}
              >
                <button
                  type="button"
                  className={`w-2/6 border-r border-gray-400/25 font-mono text-sm font-normal leading-5 text-white ${activeTab === "tab1" ? "bg-neutral-900" : ""}`}
                  onClick={() => handleTabClick("tab1")}
                >
                  Chart
                </button>
                <button
                  type="button"
                  className={`w-2/6 border-r border-gray-400/25 font-mono text-sm font-normal leading-5 text-white ${activeTab === "tab2" ? "bg-neutral-900" : ""}`}
                  onClick={() => handleTabClick("tab2")}
                >
                  0rders Book
                </button>
                <button
                  type="button"
                  className={`w-2/6 py-3 font-mono text-sm font-normal leading-5 text-white ${activeTab === "tab3" ? "bg-neutral-900" : ""}`}
                  onClick={() => handleTabClick("tab3")}
                >
                  Trades
                </button>
              </div>

              <div className="relative h-lvh">
                <div
                  className={`${activeTab === "tab1" ? "block" : "hidden"}`}
                  style={{ height: "60%" }}
                >
                  <TradingViewWidget subscription={subscription} />
                </div>
                <div
                  className={`${activeTab === "tab2" ? "block" : "hidden"} overflow-scroll`}
                  style={{ height: "60%" }}
                >
                  <Orderbook tabId={tabId} screenSize={width} />
                </div>
                <div
                  className={`${activeTab === "tab3" ? "block" : "hidden"} overflow-scroll p-3`}
                  style={{ height: "60%" }}
                >
                  <Trades tabId={tabId} />
                </div>

                <div
                  className={`${activeTab !== "tab1" ? "border-t border-gray-400/25" : ""} h-1/4 overflow-y-auto`}
                >
                  <OrderHistory />
                </div>
                <div className="bg-opacity-59 fixed bottom-0 flex w-full justify-center gap-4 bg-black p-4">
                  <Button
                    variant="green"
                    className="w-2/5"
                    onClick={() => {
                      setShowPlaceOrder({ status: true, value: "Buy" });
                      setControllNav(true);
                    }}
                  >
                    Buy
                  </Button>
                  <Button
                    variant="red"
                    className="w-2/5"
                    onClick={() => {
                      setShowPlaceOrder({ status: true, value: "Sell" });
                      setControllNav(true);
                    }}
                  >
                    Sell
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="w-full bg-black">
            <Ticker screenSize={width} />
          </div>
          <div className="flex grow flex-row">
            <div className=" flex flex-auto grow basis-4/12 flex-col bg-black">
              <div
                className="flex max-h-fit flex-auto grow  bg-black "
                style={{ height: "540px" }}
              >
                <TradingViewWidget subscription={subscription} />
              </div>
              <div className="flex flex-auto grow basis-1/2 place-items-stretch">
                <OrderHistory />
              </div>
            </div>
            <div className="flex-auto grow place-items-stretch overflow-hidden border-r border-t border-gray-400/25 bg-black py-0.5">
              <Orderbook tabId={tabId} screenSize={width} />
            </div>
            <div className="flex-auto  grow place-items-stretch overflow-hidden border-r border-t border-gray-400/25 bg-black py-0.5">
              <Trades tabId={tabId} />
            </div>
            <div className="h-50 flex flex-auto grow basis-1/5 border-t border-gray-400/25 bg-black">
              <PlaceOrder />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
