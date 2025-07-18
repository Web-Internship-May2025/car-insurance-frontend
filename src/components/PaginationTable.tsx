import "../styles/Pagination.scss";
const PaginationTable = ({
  pageSize,
  onPageSizeChange,
  totalPages,
  currentPage,
  onPageChange,
}: any) => {
  return (
    <div className="pagination-footer" style={{ marginTop: 10 }}>
      <label>
        Items per page:
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{ marginLeft: 5 }}
        >
          {[1, 2, 5, 10, 20].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <div className="page-buttons" style={{ marginTop: 10 }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            disabled={i === currentPage}
            onClick={() => onPageChange(i)}
            style={{ marginRight: 5 }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
export default PaginationTable;
