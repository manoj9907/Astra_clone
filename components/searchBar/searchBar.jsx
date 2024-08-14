"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import lunr from "lunr";
import { useRouter } from "next/navigation";
import { UserSubscription } from "@/app/context/SubscriptionContext";
import binance from "@/assets/exchanges/binance.png";
import coinbase from "@/assets/exchanges/coinbase.png";
import curve from "@/assets/exchanges/curve.png";
import huobi from "@/assets/exchanges/huobi.png";
import kraken from "@/assets/exchanges/kraken.png";
import kucoin from "@/assets/exchanges/kucoin.png";
import okx from "@/assets/exchanges/okx.png";
import uniswap from "@/assets/exchanges/uniswap.png";
import search from "@/assets/search/magnifier.svg";
import DivButton from "../buttons/buttons";
// import {fetchToCurl} from "fetch-to-curl";

const ICONS = {
  BINANCE: binance,
  COINBASE: coinbase,
  COINBASEPRO: coinbase,
  CURVE: curve,
  HUOBI: huobi,
  KRAKEN: kraken,
  KRAKENFUTURES: kraken,
  KUCOIN: kucoin,
  OKX: okx,
  UNISWAP: uniswap,
};

function SearchBar({ indexDump }) {
  const [hits] = useState([]);
  const [searchResults, setSearchResults] = useState(hits);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  const router = useRouter();
  const { changeSubscription } = UserSubscription();

  function searchs(query) {
    const results = [];
    const formattedQuery = query.replace(/ /g, "-").toLowerCase();
    const cleanQuery = query.replace(/[- ]/g, "").toLowerCase();

    const propsIndexDump = indexDump.props.indexDump;
    const indexSer = JSON.parse(JSON.stringify(propsIndexDump));

    indexSer.invertedIndex.forEach(([documentId, metadata]) => {
      const documentIdLower = documentId.toLowerCase();

      if (documentIdLower.includes(formattedQuery)) {
        results.push({ id: documentId, metadata });
      } else {
        const cleanDocumentId = documentIdLower.replace(/[- ]/g, "");

        if (cleanDocumentId.includes(cleanQuery)) {
          results.push({ id: documentId, metadata });
        } else {
          const documentWords = documentIdLower.split(/[- ]/);
          const queryWords = query.toLowerCase().split(/[- ]/);

          const allWordsMatch = queryWords.every((word) =>
            documentWords.some((docWord) => docWord.startsWith(word)),
          );

          if (allWordsMatch) {
            results.push({ id: documentId, metadata });
          } else {
            const wordsMatch = queryWords.every((word) =>
              documentWords.some((docWord) => docWord.includes(word)),
            );

            if (wordsMatch) {
              results.push({ id: documentId, metadata });
            }
          }
        }
      }
    });

    return results;
  }
  let getIndex;

  useEffect(() => {
    if (!getIndex && indexDump) {
      const propsIndexDump = indexDump.props.indexDump;
      const indexSer = JSON.parse(JSON.stringify(propsIndexDump));
      getIndex = lunr.Index.load(indexSer);
    }

    if (searchQuery && searchQuery.length >= 3) {
      const results = searchs(searchQuery);
      setSearchResults(results);
      setIsSearched(true);
    } else {
      setSearchResults([]);
      setIsSearched(false);
    }
  }, [indexDump, searchQuery]);

  function handleChange(event) {
    setSearchQuery(event.target.value);
  }

  function formatToUpperCase(str) {
    return str.toUpperCase().replace(/-/g, " ");
  }

  const handleChangeSubscription = (e) => {
    const uppercaseSubscription = e.toUpperCase();
    changeSubscription(uppercaseSubscription);
    localStorage.setItem("selectedSubscription", uppercaseSubscription);
    router.back();
    // setShowSearchBar(false);
  };

  return (
    <div className="z-50 col-start-1 row-start-1 grid h-full grid-cols-1 grid-rows-1 place-items-center text-white backdrop-blur-sm max-xl:h-1/4">
      {/* <ClickAwayListener
        onClickAway={() => {
          console.log("click away");
          // setShowSearchBar(false);
          router.back();
        }}
      > */}
      <div
        className="relative flex max-h-96 w-2/3 flex-auto grow flex-col
                    place-items-center gap-2 place-self-center overflow-clip rounded-lg border border-gray-400/25 bg-black
                    p-2 shadow-xl"
      >
        <div className="flex min-h-10 grow-0 basis-16 flex-row place-self-stretch text-sm xl:text-xm">
          <Image
            src={search}
            alt="search"
            className=" -mt-1 h-6 w-full basis-2 place-self-center object-scale-down"
          />

          <input
            type="text"
            placeholder="Search for a market"
            className="placeholder:text-xm flex w-full flex-auto
            grow-0 basis-full place-self-center rounded-lg border-transparent bg-transparent p-2 text-white
            placeholder:pl-2 placeholder:font-mono placeholder:font-bold placeholder:text-slate-500
            focus:border-transparent focus:outline-none"
            onChange={handleChange}
          />
        </div>
        <hr className=" h-0 place-self-stretch border-t border-gray-700" />

        <div
          className=" flex w-full flex-auto grow-0 basis-full flex-col place-items-center gap-1 place-self-center overflow-auto "
          style={{ scrollbarWidth: "none" }}
        >
          {searchResults && searchResults.length > 0
            ? searchResults.map((subscription) => {
                const dynamicImage = subscription.id.split("-")[0];
                const icon = ICONS[dynamicImage.toUpperCase()];

                const displayText = formatToUpperCase(subscription.id);
                return (
                  <DivButton
                    key={subscription.id}
                    className="flex min-h-10 w-full basis-full flex-row gap-4 rounded-lg pl-4 hover:bg-gray-400/25"
                    onClick={() => handleChangeSubscription(subscription.id)}
                  >
                    {icon && (
                      <div className="pointer-events-none h-full w-full grow-0 basis-6 place-self-center">
                        <Image
                          src={icon}
                          alt={subscription.id}
                          className="pointer-events-none h-full w-full object-scale-down py-1"
                        />
                      </div>
                    )}
                    <div className="pointer-events-none flex flex-auto grow-0 basis-full items-center justify-self-start align-middle font-mono text-xs">
                      {displayText}
                    </div>
                  </DivButton>
                );
              })
            : isSearched && (
                <div className="py-4 text-center">No Exchange Match.</div>
              )}
        </div>
      </div>
      {/* </ClickAwayListener> */}
    </div>
  );
}

export default SearchBar;
