import React from "react";
import "../styles/Pagination.scss";
import PaginationItem from "@mui/material/PaginationItem";
import Pagination from "@mui/material/Pagination";

interface PaginationProps {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  hasNextPage?: boolean;
}

const Paginate: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  hasNextPage = true,
}) => {
  function handleChange(_event: React.ChangeEvent<unknown>, page: number) {
    const nextPageIndex = page - 1;

    if (nextPageIndex > currentPage && !hasNextPage) {
      // Ne dozvoli prelaz ako nema sledeće stranice
      return;
    }
    onPageChange(nextPageIndex);
  }

function renderItem(item: any) {
  const isFirstPage = currentPage === 0;
  const isLastPage = !hasNextPage;
  const singlePage = totalPages === 1;

  if (singlePage && (item.type === "previous" || item.type === "next" || item.type === "last" || item.type === "first")) {
    return <PaginationItem {...item} disabled />;
  }

  if ((item.type === "next" || item.type === "last") && isLastPage) {
    return <PaginationItem {...item} disabled />;
  }
  if (item.type === "previous" && isFirstPage) {
    return <PaginationItem {...item} disabled />;
  }
  return <PaginationItem {...item} />;
}



  return (
    <div
      className="pagination-footer"
      style={{ display: "flex", alignItems: "center", gap: "1rem" }}
    >
      <Pagination
        count={totalPages}
        page={currentPage + 1}
        onChange={handleChange}
        siblingCount={1}
        boundaryCount={1}
        showFirstButton
        showLastButton
        size="medium"
        shape="rounded"
        renderItem={renderItem}
      />
      <div>
        <label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            title="Items per page"
            aria-label="Items per page"
            style={{
              borderRadius: 6,
              border: "1px solid #ccc",
              padding: "6px 23px 6px 6px",
              fontSize: "0.9em",
              cursor: "pointer",
              backgroundColor: "#fff",
            }}
          >
            {[1, 2, 5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default Paginate;
