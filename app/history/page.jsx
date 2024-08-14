/* eslint-disable react/no-unstable-nested-components */

"use client";

import React, { useState, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { AssetBadgeSm } from "../../components/ui/input";
import { INSTRUMENT_ID_TO_SYMBOL } from "@/utils/misc";
import { formatNumWithCommas, roundToNearestNthDecimal } from "@/utils/format";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { ASTRA_BASE_HTTP_URL, API_KEY } from "@/constants";
import { DatePicker } from "@/components/ui/datePicker";
import Select from "@/components/ui/select";
import CustomTable from "@/components/tanstack-table/table";

function Sections() {
  return (
    <div className="top_button mb-6 flex h-14 w-full items-center border-b border-gray-400/25 px-5  font-mono font-medium text-gray-300 xl:px-0">
      <SectionHeader name="Orders" className="text-start xl:text-center" />
      <SectionHeader name="Fills" />
      <SectionHeader name="OTC" isSelected />
      <SectionHeader name="Transfers" className="text-end xl:text-center" />
    </div>
  );
}

function SectionHeader({ name, isSelected, className }) {
  const bgColorClass = isSelected ? "bg-neutral-900" : "";
  return (
    <button
      type="button"
      className={`h-full w-36 text-sm hover:bg-gray-400/25 ${bgColorClass} ${className}`}
    >
      {name}
    </button>
  );
}

function Filters() {
  const [selectedSide, setSelectedSide] = useState("All");
  const [selectedSymbol, setSelectedSymbol] = useState("All");
  const [startDate, setStartDate] = useState();
  const [getEndDate, setGetEndDate] = useState();
  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol);
  };
  const dropdownValue = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "BTC",
      value: "BTC",
    },
    {
      label: "USDT",
      value: "USDT",
    },
    {
      label: "ETH",
      value: "ETH",
    },
    {
      label: "FTM",
      value: "FTM",
    },
  ];
  const sideDropdownValue = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "Buy",
      value: "Buy",
    },
    {
      label: "Sell",
      value: "Sell",
    },
  ];
  return (
    <div className="filter_section mx-5 flex flex-col gap-5  md:flex-row xl:mx-10">
      <div className="flex gap-10 sm:gap-5">
        <div className="relative w-1/2 md:w-44">
          <DatePicker
            onSelect={setStartDate}
            selected={startDate}
            placeholderText="Start Date"
          />
        </div>
        <div className="relative w-1/2 md:w-44">
          <DatePicker
            onSelect={setGetEndDate}
            selected={getEndDate}
            placeholderText="End Date"
          />
        </div>
      </div>
      <div className="flex gap-10 sm:gap-5">
        <div className="relative w-1/2 md:w-44">
          <Select
            selectLabel={dropdownValue}
            value={selectedSymbol}
            handleDropdown={(e) => handleSymbolChange(e)}
            addStaticval="Symbol"
            className="w-full"
          />
        </div>

        <div className="relative  w-1/2 md:w-44">
          <Select
            selectLabel={sideDropdownValue}
            value={selectedSide}
            handleDropdown={(e) => setSelectedSide(e)}
            addStaticval="Side"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

function History() {
  const [setData] = useState([]);
  const [trades, setTrades] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("orderHistoryData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          setData(parsedData);
        } else {
          console.error("Data retrieved from local storage is not an array.");
        }
      } catch (error) {
        console.error("Error parsing data from local storage:", error);
      }
    } else {
      console.warn("No data found in local storage.");
    }
  }, []);

  useEffect(() => {
    const fetchTrades = async () => {
      const response = await fetch(`${ASTRA_BASE_HTTP_URL}/trades`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-astra-api-key": API_KEY,
        },
        params: JSON.stringify({
          takerAccountId: "5510cd30-9b9b-4b91-825b-86221aad6c9b",
          category: "otc",
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setTrades(data);
    };

    fetchTrades().catch(console.error);
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("sellInstrumentId", {
      header: "From asset",
      cell: (info) => (
        <div>
          <AssetBadgeSm
            symbol={INSTRUMENT_ID_TO_SYMBOL[info.getValue()]}
            aria-label="Asset Symbol"
            className="justify-start"
          />{" "}
        </div>
      ),
    }),
    columnHelper.accessor("sellQuantity", {
      header: "From quantity",
      cell: (info) => (
        <div>
          {" "}
          {formatNumWithCommas(roundToNearestNthDecimal(info.getValue(), 2))}
        </div>
      ),
    }),
    columnHelper.accessor("buyInstrumentId", {
      cell: (info) => (
        <div>
          {" "}
          <AssetBadgeSm
            symbol={INSTRUMENT_ID_TO_SYMBOL[info.getValue()]}
            aria-label="Asset Symbol"
            className="justify-center"
          />
        </div>
      ),
      header: "To asset",
    }),
    columnHelper.accessor("buyQuantity", {
      cell: (info) => (
        <div>
          {" "}
          {formatNumWithCommas(roundToNearestNthDecimal(info.getValue(), 2))}
        </div>
      ),
      header: "To quantity",
    }),
    columnHelper.accessor("createdAt", {
      cell: (info) => (
        <div> {new Date(info.getValue() / 1000).toISOString()}</div>
      ),
      header: "Time",
    }),
    columnHelper.accessor("", {
      cell: ({ row }) => {
        const getValue = row?.original;
        return (
          <div>
            {" "}
            {formatNumWithCommas(
              roundToNearestNthDecimal(
                getValue.sellQuantity / getValue.buyQuantity,
                2,
              ),
            )}{" "}
            /{" "}
            {formatNumWithCommas(
              roundToNearestNthDecimal(
                getValue.buyQuantity / getValue.sellQuantity,
                2,
              ),
            )}
          </div>
        );
      },
      header: "Effective price",
    }),
  ];
  return (
    <div className="w-full">
      <Sections />
      <Filters />
      <div className="mt-5 px-4 xl:px-9">
        <CustomTable
          className="w-full"
          data={trades || []}
          columns={columns}
          showSort
          showSearch
          showPagination
        />
      </div>
    </div>
  );
}

export default History;
