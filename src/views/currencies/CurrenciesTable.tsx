import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage, setIsDeleted, setIsValid, setPageSize, setSortBy, setSortDirection } from "../../reducers/CurrenciesSlice.ts";
import GenericTable from "../../components/Table.tsx";
import { ProtectedImage } from "../../components/ProtectedImage.tsx";
import type { RootState, AppDispatch } from "../../reducers/index.ts";
import type { Column } from "../../components/Table.tsx";
import type { Currency } from "../../types/PaymentServiceTypes.ts";
import { fetchCurrenciesPageAsync } from "../../reducers/CurrenciesThunk.ts";

const columns: Column<Currency>[] = [
  { header: "ID", field: "id", width: 50 },
  {
    header: "Creation Date",
    field: "creationDate",
    render: (val) => new Date(val).toLocaleString(),
    width: 150,
  },
  {
    header: "Last update date",
    field: "lastUpdateDate",
    render: (val) => new Date(val).toLocaleString(),
    width: 150,
  },
  { header: "Name", field: "name", editable: true },
  {
    header: "Logo",
    field: "logo",
    render: (val) => (
      <ProtectedImage
        src={`http://localhost:8080/payments/images/${val}`}
        alt="logo"
        width={50}
      />
    ),
  },
  { header: "Code", field: "code", editable: true, width: 60 },
  {
    header: "Active",
    field: "isDeleted",
    render: (val) => (val ? "No" : "Yes"),
    editable: true,
    width: 60,
  },
];

const CurrenciesTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currencies, totalItems, totalPages, currentPage, pageSize, status, sortBy, sortDirection, isValid, isDeleted } =
    useSelector((state: RootState) => state.currencies);

  React.useEffect(() => {
    dispatch(fetchCurrenciesPageAsync({ page: currentPage, size: pageSize, sortBy, sortDirection, isValid, isDeleted}));
  }, [dispatch, currentPage, pageSize, sortBy, sortDirection, isValid, isDeleted]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(0));
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(e.target.value));
    dispatch(setCurrentPage(0));
  };

  const handleSortDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortDirection(e.target.value as 'asc' | 'desc'));
    dispatch(setCurrentPage(0));
  };

  const handleIsValidChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    dispatch(setIsValid(val === "" ? null : val === "true"));
    dispatch(setCurrentPage(0));
  };

  const handleIsDeletedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    dispatch(setIsDeleted(val === "" ? null : val === "true"));
    dispatch(setCurrentPage(0));
  };

  const canViewMore = () => {
    return true;
  }

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
    );
  }

  if (status === "failed") {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>There are no currencies available.</p>
      </div>
    );
  }

  return (
    <>
    <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <label>
          Sort By:
          <select value={sortBy} onChange={handleSortByChange}>
            <option value="name">Name</option>
            <option value="code">Code</option>
            <option value="creationDate">Creation Date</option>
            <option value="lastUpdateDate">Last Update Date</option>
          </select>
        </label>

        <label>
          Direction:
          <select value={sortDirection} onChange={handleSortDirectionChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <label>
          Is Valid:
          <select value={isValid === null ? "" : isValid.toString()} onChange={handleIsValidChange}>
            <option value="">All</option>
            <option value="true">Valid</option>
            <option value="false">Not Valid</option>
          </select>
        </label>

        <label>
          Is Deleted:
          <select value={isDeleted === null ? "" : isDeleted.toString()} onChange={handleIsDeletedChange}>
            <option value="">All</option>
            <option value="true">Deleted</option>
            <option value="false">Not Deleted</option>
          </select>
        </label>
      </div>
    <GenericTable
      columns={columns}
      data={currencies}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      pageSize={pageSize}
      name="currency"
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      showPagination={true}
      canViewMore={canViewMore}
    />
    </>
  );
};

export default CurrenciesTable;
