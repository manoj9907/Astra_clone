import React, { useState } from "react";
import Image from "next/image";
import bitcoin from "@/assets/otcpage/bitcoin.svg";
import etherum from "@/assets/otcpage/etherum-icon.svg";
import fantom from "@/assets/otcpage/fantom-icon.svg";
import tetherIcon from "@/assets/otcpage/tether-icon.svg";
import usdIcon from "@/assets/otcpage/usd-icon.svg";
import close from "@/assets/otcpage/close-icon.svg";
import DivButton from "@/components/buttons/buttons";
import { InputSearch } from "@/components/icons";

function CurrencySelectorHeader({ handleCloseCurrencySelector, onChanage }) {
  return (
    <div className="search_header">
      <div className="header_currency">
        <p className="select_currency">Select Currency</p>
        <Image
          height={10}
          width={10}
          className="close_button cursor-pointer"
          onClick={handleCloseCurrencySelector}
          src={close.src}
          alt="close"
        />
      </div>
      <div className="input_search">
        <input
          type="text"
          name="search-form"
          id="search-form"
          className="h-[50px] w-[100%] rounded-[7px] border border-[#f2f2f2] bg-[#131313] pl-[40px] text-[14px] font-semibold leading-[18.2px] text-[#f2f2f2] sm:w-[441px]"
          placeholder="Usd"
          onChange={onChanage}
        />
        <InputSearch className="absolute left-3 top-3.5 mt-0.5" />
      </div>
    </div>
  );
}

function CurrencyList({ coins, selectedCoin, handleCoinSelect ,handleCloseCurrencySelector }) {
  return (
    <ul>
      {coins.map((coin) => {
        if (coin.symbol !== selectedCoin.symbol) {
          return (
            <li key={coin.symbol} className=" hover:bg-neutral-900 px-7 py-4">
              <DivButton
                className="search_list"
                onClick={() => {
                  handleCoinSelect(coin)
                   handleCloseCurrencySelector()
                }}
              >
                <Image
                  className="tether_image"
                  height={10}
                  width={10}
                  src={coin.image.src}
                  alt={coin.name}
                />
                <div className="search_info">
                  <p className="currency_name_list">{coin.symbol}</p>
                  <p className="crypto_name_list">{coin.name}</p>
                </div>
              </DivButton>
            </li>
          );
        }
        return null;
      })}
    </ul>
  );
}

function CurrencySelector({
  handleCloseCurrencySelector,
  selectedBuyCoin,
  selectedSellCoin,
  handleCoinSelect,
  selectedDropdown,
}) {
  const coins = [
    { name: "Bitcoin", symbol: "BTC", image: bitcoin },
    { name: "Ethereum", symbol: "ETH", image: etherum },
    { name: "Fantom", symbol: "FTM", image: fantom },
    { name: "Tether", symbol: "USDT", image: tetherIcon },
    { name: "US Dollar", symbol: "USD", image: usdIcon },
  ];
  const [filteredCoins, setFilteredCoins] = useState(coins);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    // setSearchTerm(term);
    if (term === "") {
      setFilteredCoins(coins);
    } else {
      const filtered = coins.filter((coin) =>
        coin.symbol.toLowerCase().includes(term),
      );
      setFilteredCoins(filtered);
    }
  };

  return (
    <div className="center">
      <div className="h-3/4 w-[80%] rounded-[13px] bg-[#27292c] pr-[8px]  sm:w-[494px]">
        <CurrencySelectorHeader
          handleCloseCurrencySelector={handleCloseCurrencySelector}
          onChanage={handleSearch}
        />
        {selectedDropdown === "buy_class_head" && (
          <CurrencyList
            coins={filteredCoins}
            selectedCoin={selectedSellCoin}
            handleCoinSelect={handleCoinSelect}
            handleCloseCurrencySelector={handleCloseCurrencySelector}
          />
        )}
        {selectedDropdown === "sell_class_head" && (
          <CurrencyList
            coins={filteredCoins}
            selectedCoin={selectedBuyCoin}
            handleCoinSelect={handleCoinSelect}
            handleCloseCurrencySelector={handleCloseCurrencySelector}
          />
        )}
      </div>
    </div>
  );
}

export default CurrencySelector;
