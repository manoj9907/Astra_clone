"use client";

import React, { useEffect, useState } from "react";
import { addDays } from "date-fns";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import ToggleGroupButton from "@/components/ui/toggle";
import { Input } from "@/components/input";
import cn from "@/utils/shadcn";
import { DatePicker, RangePicker } from "@/components/ui/datePicker";
import Select from "@/components/ui/select";
import AssetBadge from "@/components/badges";
import CustomTable from "@/components/tanstack-table/table";
import makeData from "@/components/tanstack-table/makeData";
import Pagination from "@/components/ui/pagination";

function Page() {
  const [getSelectedValue, setGetSelectedvalue] = useState("option1");
  const [getSelectedDropDownval, setGetDropDownval] = useState("option1");
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, settableData] = React.useState([]);
  const [date, setDate] = React.useState({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  const onValueChange = (e) => {
    setGetSelectedvalue(e);
  };
  const toggleBtnVal = [
    {
      name: "Option 1",
      value: "option1",
    },
    {
      name: "Option 2",
      value: "option2",
    },
  ];
  const dropdownValue = [
    {
      label: "option 1",
      value: "option1",
    },
    {
      label: "option 2",
      value: "option2",
    },
  ];
  const columns = [
    {
      accessorKey: "id",
      filterFn: "equalsString",
    },
    {
      accessorKey: "firstName",
      cell: (info) => info.getValue(),
      filterFn: "includesStringSensitive",
    },
    {
      accessorFn: (row) => row.lastName,
      id: "lastName",
      cell: (info) => info.getValue(),
      header: () => <span>Last Name</span>,
      filterFn: "includesString",
      sortUndefined: "last",
      sortDescFirst: false,
    },
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      id: "fullName",
      header: "Full Name",
      cell: (info) => info.getValue(),
      filterFn: "fuzzy",
      sortingFn: "fuzzy",
    },
  ];
  useEffect(() => {
    settableData(() => makeData(500));
  }, []);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex w-full flex-col gap-3 overflow-y-auto ">
        <p className="h-10 p-4 text-center text-white">UI Components</p>
        <div className="flex flex-col gap-10 pb-10 pl-10">
          <Section title="Headers">
            <h1>Header 1</h1>
            <h2>Header 2</h2>
            <h3>Header 3</h3>
            <h4>Header 4</h4>
            <h5>Header 5</h5>
            <h6>Header 6</h6>
          </Section>

          <Section title="Toggle" className="w-56">
            <ToggleGroupButton
              onValueChange={onValueChange}
              value={getSelectedValue}
              toggleDatas={toggleBtnVal}
            />
          </Section>

          <Section title="Buttons" className="w-96">
            <div className="grid w-full grid-flow-col grid-cols-3 grid-rows-4 gap-4">
              <GridLabel name="" />
              <GridLabel name="primary" />
              <GridLabel name="green" />
              <GridLabel name="red" />
              <GridLabel name="regular" />
              <Button size="regular" variant="primary">
                Button
              </Button>
              <Button size="regular" variant="green">
                Button
              </Button>
              <Button size="regular" variant="red">
                Button
              </Button>
              <GridLabel name="compact" />
              <Button size="compact" variant="primary">
                Button
              </Button>
              <Button size="compact" variant="green">
                Button
              </Button>
              <Button size="compact" variant="red">
                Button
              </Button>
            </div>
          </Section>

          <Section title="Input" className="w-64">
            <Input size="regular" placeholder="Placeholder text" />
            <Input size="compact" placeholder="Placeholder text" />
          </Section>

          <Section title="Select" className="w-64">
            <Select
              selectLabel={dropdownValue}
              value={getSelectedDropDownval}
              handleDropdown={(e) => setGetDropDownval(e)}
            />
          </Section>

          <Section title="Asset Badges">
            <AssetBadge size="compact" className="border" symbol="BTC" />
            <AssetBadge size="regular" className="border" symbol="BTC" />
          </Section>
          <Section title="DatePicker">
            <DatePicker className="w-48" />
          </Section>
          <Section title="RangePicker">
            <RangePicker setDate={setDate} date={date} />
          </Section>
          <Section title="Pagination">
            <Pagination
              totalPages={40}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              setCurrentPage={setCurrentPage}
            />
          </Section>
          <CustomTable
            className="w-full"
            data={tableData}
            columns={columns}
            showSort
            showSearch
            showPagination
          />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, className }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h5>{title}</h5>
      {children}
    </div>
  );
}

function GridLabel({ name }) {
  return (
    <span className="inline-flex items-center justify-center text-sm">
      {name}
    </span>
  );
}

export default Page;
