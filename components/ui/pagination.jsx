// https://ui.shadcn.com/docs/components/button
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { buttonVariants } from "./button";
import cn from "@/utils/shadcn";

// Pagination Component as Function Declaration
function Page({ className, ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex justify-end w-full", className)}
      {...props}
    />
  );
}
Page.displayName = "Page";

// Separate function for PaginationContent
function PaginationContentFunction({ className, ...props }, ref) {
  return (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}
const PaginationContent = React.forwardRef(PaginationContentFunction);
PaginationContent.displayName = "PaginationContent";

// Separate function for PaginationItem
function PaginationItemFunction({ className, ...props }, ref) {
  return <li ref={ref} className={cn("", className)} {...props} />;
}
const PaginationItem = React.forwardRef(PaginationItemFunction);
PaginationItem.displayName = "PaginationItem";

// PaginationLink Component as Function Declaration
function PaginationLink({
  className,
  isActive,
  size = "icon",
  children,
  ...props
}) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
        "text-xs",
      )}
      {...props}
    >
      {children || <span className="sr-only">Page {props["aria-label"]}</span>}
    </a>
  );
}

PaginationLink.displayName = "PaginationLink";

// PaginationPrevious Component as Function Declaration
function PaginationPrevious({ className, ...props }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="h-3 w-3" />
      <span>Previous</span>
    </PaginationLink>
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

// PaginationNext Component as Function Declaration
function PaginationNext({ className, ...props }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-3 w-3 mt-0.5" />
    </PaginationLink>
  );
}
PaginationNext.displayName = "PaginationNext";

// PaginationEllipsis Component as Function Declaration
function PaginationEllipsis({ className, ...props }) {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
PaginationEllipsis.displayName = "PaginationEllipsis";

export default function Pagination({
  totalPages,
  onPageChange,
  currentPage = 1,
  setCurrentPage,
}) {
  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const handlePreviousClick = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    if (startPage > 1) {
      pageNumbers.push(
        <PaginationItem key={1} onClick={() => handlePageClick(1)} className ="cursor-pointer">
          <PaginationLink isActive={currentPage === 1}>{1}</PaginationLink>
        </PaginationItem>,
      );

      if (startPage > 2) {
        pageNumbers.push(
          <PaginationItem key="start-ellipsis" className ="cursor-pointer">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pageNumbers.push(
        <PaginationItem key={i} onClick={() => handlePageClick(i)} className ="cursor-pointer">
          <PaginationLink isActive={currentPage === i}>{i}</PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <PaginationItem key="end-ellipsis" className ="cursor-pointer">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      pageNumbers.push(
        <PaginationItem
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className ="cursor-pointer"
        >
          <PaginationLink isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pageNumbers;
  };

  return (
    <Page>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePreviousClick}
            className={`${currentPage === 1 || totalPages === 0 ? "hover:bg-transparent hover:text-gray-400 opacity-40" : "cursor-pointer"}`}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            onClick={handleNextClick}
            className={`${currentPage === totalPages  || totalPages === 0 ? "hover:bg-transparent hover:text-gray-400 opacity-40" : "cursor-pointer"}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Page>
  );
}
