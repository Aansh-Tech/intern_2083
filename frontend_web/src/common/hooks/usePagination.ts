import { useMemo, useState } from "react";

interface UsePaginationOptions {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
}

export function usePagination({
  totalItems,
  pageSize = 10,
  initialPage = 1,
}: UsePaginationOptions) {
  const [page, setPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const currentPage = Math.min(page, totalPages);

  const { startIndex, endIndex } = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, totalItems);
    return { startIndex: start, endIndex: end };
  }, [currentPage, pageSize, totalItems]);

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  }

  return {
    currentPage,
    totalPages,
    pageSize,
    startIndex,
    endIndex,
    goToNext: () => goToPage(currentPage + 1),
    goToPrevious: () => goToPage(currentPage - 1),
    goToPage,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  };
}