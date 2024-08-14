/* eslint-disable react/no-unstable-nested-components */

// https://tanstack.com/table/latest/docs/framework/react/examples/basic
// https://tanstack.com/table/latest/docs/framework/react/examples/filters

import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// // import { Input } from "../input";
import Pagination from "../ui/pagination";
import useWidth from "../customHooks/useWidth";

export default function CustomTable({
  data: initialData,
  columns: userColumns,
  showPagination = true,
}) {
  // const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [originalData, setOriginalData] = useState(initialData);
  const [editedRows, setEditedRows] = useState({});
  const width = useWidth();
  const columns = React.useMemo(
    () =>
      userColumns.map((col) => {
        if (col.filterFn === "tableFilter") {
          return {
            ...col,
          };
        }
        return col;
      }),
    [userColumns],
  );

  useEffect(() => {
    setData(initialData);
    setOriginalData(initialData);
  }, [initialData]);

  const table = useReactTable({
    data,
    columns,
    // state: {
    //   globalFilter,
    // },
    // onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: (row, columnId, filterValue) => {
    //   const safeValue = (() => {
    //     const value = row.getValue(columnId);
    //     return typeof value === 'number' ? String(value) : value;
    //   })();

    //   return safeValue?.toLowerCase().includes(filterValue.toLowerCase());
    // },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    meta: {
      editedRows,
      setEditedRows,
      revertData: (rowIndex, revert) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row,
            ),
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) =>
              index === rowIndex ? data[rowIndex] : row,
            ),
          );
        }
      },
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
    },
  });
  useEffect(() => {
    if (width < 768) table.setPageSize(5);
    else table.setPageSize(10);
  }, [width]);

  useEffect(() => {
    table.setPageIndex(currentPage - 1);
  }, [currentPage]);
  return (
    <div className=" mb-5 p-2">
      {/* {showSearch && (
        <div className="w-80">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="font-lg border-block border p-2 shadow"
            placeholder="Search all columns..."
          />
        </div>
      )} */}
      <div className="mt-5 overflow-auto">
        <table className="w-full overflow-auto">
          <thead className="sticky top-0 bg-black font-mono text-xs text-gray-400 md:text-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={` ${index === 0 ? "py-2 pr-4 text-left xl:px-4" : "px-4 py-2 "} ${index === userColumns.length - 1 ? "text-right" : ""} border-b border-gray-400/25`}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                        {/* {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} />
                        </div>
                      ) : null} */}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="overflow-y-auto font-mono text-xs text-gray-400">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer text-xs hover:bg-gray-400/10"
              >
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    className={`${index === 0 ? "text-left xl:px-4" : "px-4 py-2 text-center"} ${index === userColumns.length - 1 ? "text-right" : ""} border-b border-gray-400/25 py-2 text-gray-400`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-2" />
      </div>
      {showPagination && (
        <div className="mt-2 flex items-center gap-2 text-gray-400">
          <Pagination
            totalPages={table.getPageCount()}
            currentPage={table.getState().pagination.pageIndex + 1}
            setCurrentPage={setCurrentPage}
            onPageChange={(e) => {
              const page = e ? Number(e) : 0;
              setCurrentPage(page);
            }}
          />
        </div>
      )}
    </div>
  );
}

// function DebouncedInput({
//   value: initialValue,
//   onChange,
//   debounce = 500,
//   ...props
// }) {
//   const [value, setValue] = React.useState(initialValue);

//   React.useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);

//   React.useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value);
//     }, debounce);

//     return () => clearTimeout(timeout);
//   }, [value]);

//   return (
//     <Input
//       size="regular"
//       {...props}
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//     />
//   );
// }
