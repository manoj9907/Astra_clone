import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i += 1) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };
  return (
    <ul className=" mt-4 flex items-center justify-end">
      <li className="mr-4 cursor-default text-gray-400">{"<"}</li>
      {pageNumbers.length === 0 ? (
        <li>
          <button
            type="button"
            className={`mr-1 cursor-pointer px-2 text-[12px] font-bold text-gray-700${"border-white-600 border text-white"}`}
          >
            1
          </button>
        </li>
      ) : (
        pageNumbers.map((pageNumber) => (
          <li key={pageNumber}>
            <button
              onClick={() => handlePageClick(pageNumber)}
              type="button"
              className={`mr-1 cursor-pointer px-2 text-[12px] font-bold text-gray-700${
                currentPage === pageNumber
                  ? "border-white-600 border text-white"
                  : ""
              }`}
            >
              {pageNumber}
            </button>
          </li>
        ))
      )}

      <li className="ml-2 cursor-default text-gray-400">{">"}</li>
    </ul>
  );
}

export default Pagination;
