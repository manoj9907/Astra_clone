import React, { useState, useEffect } from "react";
import { Input } from "../input";

function TableCell({ getValue, row, column, table }) {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };

  const onSelectChange = (e) => {
    setValue(e.target.value);
    tableMeta?.updateData(
      row.index,
      column.id,
      e.target.value,
      e.target.validity.valid,
    );
  };
  if (tableMeta?.editedRows[row.id]) {
    return columnMeta?.type === "select" ? (
      <select onChange={onSelectChange} value={initialValue}>
        {columnMeta?.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        type={columnMeta?.type || "text"}
        className="h-7 w-48"
      />
    );
  }
  return <span>{value}</span>;
}

export default TableCell;
