import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Pagination({
  last_page,
  setCurrentPage,
  current_page,
  studentsPagination,
}) {
  // Pagination helpers
  const renderPaginationItems = () => {
    const totalPages = last_page || 1;
    const currentPageNum = current_page || 1;
    const maxVisiblePages = 5;

    let startPage = Math.max(
      1,
      currentPageNum - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];

    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key="page-1"
          onClick={() => setCurrentPage(1)}
          variant="outline"
          className="w-8 h-8"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>
        );
      }
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        studentsPagination ? (
          <Link href={`?page=${i}`} key={`page-${i}`} className="w-8 h-8">
            <Button
              variant={i === currentPageNum ? "default" : "outline"}
              className="w-8 h-8"
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </Button>
          </Link>
        ) : (
          <Button
            key={`page-${i}`}
            onClick={() => setCurrentPage(i)}
            variant={i === currentPageNum ? "default" : "outline"}
            className="w-8 h-8"
          >
            {i}
          </Button>
        )
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <Button
          key={`page-${totalPages}`}
          onClick={() => setCurrentPage(totalPages)}
          variant="outline"
          className="w-8 h-8"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="mt-4">
      {last_page > 1 && (
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
            Page {current_page} of {last_page}
          </div>

          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(current_page - 1)}
              disabled={current_page === 1}
              className="h-8 w-8"
            >
              <Icon
                icon="heroicons:chevron-left"
                className="w-5 h-5 rtl:rotate-180"
              />
            </Button>

            {renderPaginationItems()}

            <Button
              onClick={() => setCurrentPage(current_page + 1)}
              disabled={current_page === last_page}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <Icon
                icon="heroicons:chevron-right"
                className="w-5 h-5 rtl:rotate-180"
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pagination;
