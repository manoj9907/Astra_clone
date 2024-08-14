import React, { useState } from "react";
import Link from "next/link";

function OrderHistory() {
  const headers = ["Time Placed", "Pair", "Side", "Price", "Amount", "Status"];
  const [list] = useState([
    {
      timePlaced: "2021-10-12 12:00:00",
      pair: "BTC/USDT",
      side: "Buy",
      price: "50000",
      amount: "0.01",
      status: "Filled",
    },
    {
      timePlaced: "2021-10-12 12:00:00",
      pair: "BTC/USDT",
      side: "Buy",
      price: "50000",
      amount: "0.01",
      status: "Filled",
    },
  ]);
  const [exchangeKeyAvailable] = useState(true);
  // const [featureInProgress] = useState(true);
  return (
    <div className="relative h-full w-full">
      {exchangeKeyAvailable ? (
        <div className="flex w-full flex-col border-x border-gray-400/25 bg-black font-mono text-xs text-white">
          <div className="align-items flex h-8 flex-row divide-x divide-gray-400/25 border-b border-gray-400/25">
            <div className="flex h-full basis-36 cursor-pointer flex-row items-center justify-center bg-neutral-900 hover:bg-gray-400/25">
              Open Orders
            </div>
            <div className="flex h-full basis-36 cursor-pointer flex-row items-center justify-center text-gray-300 hover:bg-gray-400/25">
              All Orders
            </div>
            <div />
          </div>

          <div className="w-full flex-row items-center justify-around">
            <table className="mb-2 w-full justify-center text-center">
              <thead className="p-2">
                <tr className="p-2">
                  {headers.map((header, index) => (
                    <th
                      key={header}
                      className={`px-2 py-2 ${index === 0 ? "text-left" : ""} ${index === headers.length - 1 ? "text-right" : ""}  text-gray-400`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {list.map((i, index) => (
                  <tr
                    key={`${index + 1}`}
                    className="cursor-pointer p-2 hover:bg-gray-600"
                  >
                    <td className="p-2  text-left">{i.timePlaced}</td>
                    <td className="p-2 text-center">{i.pair}</td>
                    <td
                      className={`p-2 ${i.side.toLowerCase()}-bg text-center`}
                    >
                      {i.side}
                    </td>
                    <td className="p-2 text-center">{i.price}</td>
                    <td className="p-2 text-center">{i.amount}</td>
                    <td className="p-2 text-right">{i.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className="z-10 flex h-full w-full cursor-pointer flex-col items-center justify-center
             border-x border-gray-400/25 bg-black p-5 text-center font-mono text-xs text-white"
        >
          <Link href="/vault">
            {" "}
            <div>
              Please provide the Exchange API Key in vault to activate this
              feature
            </div>{" "}
          </Link>
        </div>
      )}

      {/* {featureInProgress && ( // Conditionally render the overlay
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-85 text-gray-100 text-sm">
           Feature Under Development
        </div>
      )} */}
    </div>
  );
}
export default OrderHistory;
