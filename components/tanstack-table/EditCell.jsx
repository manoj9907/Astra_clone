import Image from "next/image";
import React from "react";
import {
  tbDelete,
  tbEdit,
  tbSaveIcon,
  tbCancel,
} from "../../assets/settings/index";

function EditCell({ row, table, deleteApicall, editApikeyHandler }) {
  const { meta } = table.options;

  const setEditedRows = (e) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old) => ({
      [row.id]: !old[row.id],
    }));
    if (elName === "cancel") {
      meta?.revertData(row.index, e.currentTarget.name === "cancel");
    } else if (elName === "save") {
      editApikeyHandler(row.original.nickname, row.original.id).catch(() => {
        meta?.revertData(row.index, true);
      });
    }
  };

  const removeRow = () => {
    meta?.revertData(row.index);
    deleteApicall(row?.original?.id);
  };

  return (
    <div className="edit-cell-container">
      {meta?.editedRows[row.id] ? (
        <div className="edit-cell-action">
          <button
            className="button-edit mr-2.5 mt-1 h-4 w-4"
            type="button"
            name="save"
            onClick={setEditedRows}
          >
            <Image src={tbSaveIcon.src} alt="Edit" width="40" height="40"  className="pt-0.5" />
          </button>
          <button
            type="button"
            className="button-delete mt-1 h-4 w-4"
            name="cancel"
            onClick={setEditedRows}
          >
            <Image src={tbCancel.src} alt="Delete" width="40" height="40"  className="pt-0.5" />
          </button>
        </div>
      ) : (
        <div className="edit-cell-action">
          <button
            className="button-edit mr-2.5 h-4 w-4"
            type="button"
            name="edit"
            onClick={setEditedRows}
          >
            <Image src={tbEdit.src} alt="Edit" width="40" height="40" className="pt-[3px]" />
          </button>
          <button
            className="button-delete h-4 w-4"
            type="button"
            onClick={removeRow}
          >
            <Image src={tbDelete.src} alt="Delete" width="40" height="40" className="pt-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default EditCell;
