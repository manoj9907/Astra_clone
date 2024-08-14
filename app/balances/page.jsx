"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { formatNumWithCommas, roundToNearestNthDecimal } from "@/utils/format";
import CustomTable from "@/components/tanstack-table/table";
import Pagination from "./Pagination";
import { Button } from "@/components/ui/button";
import Select from "@/components/ui/select";
import { AssetIcon } from "@/components/icons";
import DivButton from "@/components/buttons/buttons";
import Headers from "../header";
import getAssetsData from "@/services/myassetsservice/assets";
import { ASTRA_BASE_WS_URL } from "@/constants";
import { UserAuth } from "../context/AuthContext";
import "./balances.css";

const columnHelper = createColumnHelper();

const getColumns = (calculateValue, totalValue, socketTradePrice) => [
  columnHelper.accessor("", {
    header: "Instrument",
    cell: ({ row }) => {
      const getValue = row.instrument.symbol;
      return (
        <div className="flex items-center gap-3">
          <AssetIcon size="compact" symbol={getValue} />
          {getValue}
        </div>
      );
    },
  }),
  columnHelper.accessor("amount", {
    header: "Balance",
    cell: (info) => (
      <div>
        {formatNumWithCommas(roundToNearestNthDecimal(info.getValue(), 2))}
      </div>
    ),
  }),
  columnHelper.accessor("", {
    cell: ({ row }) => {
      const getValue = row.instrument.symbol;
      return (
        <div>
          {formatNumWithCommas(getValue === "BTC" ? socketTradePrice : 1)}
        </div>
      );
    },
    header: "Price (USD)",
  }),
  columnHelper.accessor("", {
    cell: ({ row }) => {
      const getValue = row.instrument.symbol;
      return (
        <div>
          ${"\u202F"}
          {formatNumWithCommas(calculateValue(row.amount, getValue))}
        </div>
      );
    },
    header: "Value",
  }),
  columnHelper.accessor("", {
    cell: ({ row }) => {
      const getValue = row.instrument.symbol;
      return (
        <div>
          {((calculateValue(row.amount, getValue) / totalValue) * 100).toFixed(
            2,
          )}{" "}
          %
        </div>
      );
    },
    header: "Allocation",
  }),
];

function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedText, setSelectedText] = useState("All");
  const [showOptions, setShowOptions] = useState(false);
  const [socketTradePrice, setSocketPrice] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [balanceData, setBalanceData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [getAllFilterVal, setGetAllFilterVal] = useState([]);
  const [getSelectedDropDownval, setGetDropDownval] = useState("All");
  const pageSize = 5; // Number of items per page
  const { user } = UserAuth();

  useEffect(() => {
    const sourceData = selectedText === "All" ? balanceData : getAllFilterVal;
    const displayedData = sourceData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
    setTotalPages(Math.ceil(sourceData.length / pageSize));
    setTableData(displayedData);
  }, [balanceData, currentPage]);

  const handlePageChange = (pageNumber) => {
    const sourceData = selectedText === "All" ? balanceData : getAllFilterVal;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    const displayedData = sourceData.slice(startIndex, endIndex);
    setTableData(displayedData);
    setCurrentPage(pageNumber);
  };

  const handleShowOptions = (option) => {
    setCurrentPage(1);
    setSelectedText(option);
    setGetDropDownval(option);
    setShowOptions(false);
    const filteredData =
      option === "All"
        ? balanceData
        : balanceData.filter((x) => x.instrument.symbol === option);
    const displayedData = filteredData.slice(0, pageSize);
    setGetAllFilterVal(filteredData);
    setTotalPages(Math.ceil(filteredData.length / pageSize));
    setTableData(displayedData);
  };

  const initializeWebSocket = () => {
    const astraWS = new WebSocket(
      `${ASTRA_BASE_WS_URL}?market=BINANCE-SPOT-BTC-USDT&dataType=TRADE`,
    );
    astraWS.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSocketPrice(data?.trades[0]?.price);
      // astraWS.close();
    };
  };

  const fetchAssetsData = async (userId) => {
    const response = await getAssetsData(userId);
    if (response) {
      initializeWebSocket();
      setBalanceData(response);
    }
  };

  useEffect(() => {
    if (socketTradePrice) {
      let sum = 0;
      balanceData.forEach((item) => {
        const amount = parseFloat(item.amount);
        if (item.instrument.symbol === "USD") {
          sum += amount * 1;
        } else {
          sum += amount * socketTradePrice;
        }
      });
      setTotalValue(sum?.toFixed(2));
    }
  }, [socketTradePrice, balanceData]);

  useEffect(() => {
    if (user?.userId) {
      fetchAssetsData(user.userId);
    }
  }, [user?.userId]);

  const calculateValue = (amount, name) => {
    if (amount && name) {
      return (
        parseFloat(amount) * (name === "USD" ? 1 : socketTradePrice)
      ).toFixed(2);
    }
    return 0.0;
  };

  const handleDropdown = () => {
    if (showOptions) {
      setShowOptions(false);
    }
  };

  const dropdownValue = [
    { label: "All", value: "All" },
    { label: "BTC", value: "BTC" },
    { label: "USDT", value: "USDT" },
  ];

  return (
    <div className=" h-full w-full">
      <Headers text="Balance" />
      <div className="relative h-full w-full p-5 xl:p-10">
        <DivButton
          className="custom-body flex h-screen w-full flex-col overflow-auto"
          onClick={handleDropdown}
        >
          <div className="flex w-full  justify-between">
            <p className="font-ibm-plex-mono flex items-center text-base font-semibold leading-6 text-gray-300 md:text-xl">
              My assets
            </p>
            <Link href="/balances/deposits">
              <Button>Deposit/Withdrawal</Button>
            </Link>
          </div>
          <DivButton
            className="relative mt-8 h-14 w-[120px] md:w-44"
            onClick={() => setShowOptions(!showOptions)}
          >
            <Select
              selectLabel={dropdownValue}
              value={getSelectedDropDownval}
              handleDropdown={(e) => handleShowOptions(e)}
              addStaticval="Crypto"
              className="w-full"
            />
          </DivButton>
          <CustomTable
            className="w-full"
            data={tableData || []}
            columns={getColumns(calculateValue, totalValue, socketTradePrice)}
            showSort
            showSearch
            showPagination
          />
        </DivButton>
        {/* <footer className="absolute bottom-[20%] right-10 sm:bottom-[10%]">
          <div className="">
            <Pagination
              className="bg-white"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </footer> */}
      </div>
    </div>
  );
}

export default Page;
