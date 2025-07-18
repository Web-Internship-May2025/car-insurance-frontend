import React, { useEffect, useState } from "react";
import type { Column } from "../../components/Table.tsx";
import { useAppDispatch } from "../../reducers/index.ts";
import { useSelector } from "react-redux";
import type { RootState } from "../../reducers/index.ts";
import { setCurrentPage, setPageSize } from "../../reducers/PoliciesSlice.ts";
import GenericTable from "../../components/Table.tsx";
import type { PolicyDTO } from "../../types/PolicyDTO.ts";
import "react-toastify/ReactToastify.css";
import {
  fetchPoliciesPageAsync,
  fetchSalesAgentPoliciesPageAsync,
  searchPoliciesAsync,
} from "../../reducers/PoliciesThunk.ts";
import { formatDateTime } from "../../utils/DateTimeFormatter.tsx";
import { getUserId } from "../../services/jwtService.ts";
import { useNavigate } from "react-router-dom";


import PolicySearchBar from "./PolicySearchBar.tsx";
import type { PolicySearchRequest } from "../../services/PolicyApi.ts";
import { Loader } from "lucide-react";

interface PoliciesTableProps {
  salesAgent?: boolean;
}

interface FiltersState {
  firstName: string;
  lastName: string;
  email: string;
  creationDate: string;
  carBrand: string;
  carModel: string;
  carYear: number | "";
  showAdvancedSearch: boolean;
}

const columns: Column<PolicyDTO>[] = [
  { header: "ID", field: "id", width: 50 },
  {
    header: "Sub First Name",
    field: "firstName",
    width: 120,
  },
  {
    header: "Sub Last Name",
    field: "lastName",
    width: 120,
  },
  {
    header: "Date Signed",
    field: "dateSigned",
    width: 130,
    render: (val) => formatDateTime(val),
  },
  {
    header: "Expiring Date",
    field: "expiringDate",
    width: 130,
    render: (val) => formatDateTime(val),
  },
  {
    header: "Money Received Date",
    field: "moneyReceivedDate",
    width: 150,
    render: (val) => formatDateTime(val),
  },
  { header: "Amount", field: "amount", width: 100 },
  {
    header: "Deleted",
    field: "isDeleted",
    render: (val) => (val ? "Yes" : "No"),
    width: 60,
  },
];

const PoliciesTable: React.FC<PoliciesTableProps> = ({
  salesAgent = false,
}) => {
  const dispatch = useAppDispatch();
  const { policies, totalItems, totalPages, currentPage, pageSize, status } =
    useSelector((state: RootState) => state.policies);

    const [filters, setFilters] = useState<FiltersState>({
    firstName: "",
    lastName: "",
    email: "",
    creationDate: "",
    carBrand: "",
    carModel: "",
    carYear: "",
    showAdvancedSearch: false
  });

  const updateFilter = (key: keyof FiltersState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleAdvancedSearch = () => {
    setFilters(prev => ({
      ...prev,
      showAdvancedSearch: !prev.showAdvancedSearch,
    }));
  };

  const [isSearching, setIsSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState<PolicySearchRequest | null>(null);

  const navigate = useNavigate();
  
  useEffect(() => {
  if (status === "succeeded") {
    console.log("Paged policies:", policies);
    console.log("Page size:", pageSize, "Total pages:", totalPages);
  }
}, [status, policies, pageSize, totalPages]);

  useEffect(() => {
  if (isSearching && !salesAgent) {
    if (searchFilters) {
      dispatch(
        searchPoliciesAsync({
          ...searchFilters,
          page: currentPage,
          size: pageSize,
        })
      );
    }
  } else if (salesAgent) {
    const userId = Number(getUserId());
    dispatch(
      fetchSalesAgentPoliciesPageAsync({
        salesAgentId: userId,
        page: currentPage,
        size: pageSize,
      })
    );
  } else {
    dispatch(fetchPoliciesPageAsync({ page: currentPage, size: pageSize }));
  }
}, [dispatch, salesAgent, currentPage, pageSize, isSearching, searchFilters]);

  const handleSearch = () => {
    setIsSearching(true);

    const req: PolicySearchRequest = {
      firstName: filters.firstName || "",
      lastName: filters.lastName || "",
      email: filters.email || "",
      date: filters.creationDate || "",
      brandName: filters.carBrand || "",
      modelName: filters.carModel || undefined,
      carYear: filters.carYear === "" ? undefined : filters.carYear,
      page: 0,
      size: pageSize,
    };
    setSearchFilters(req);
    dispatch(setCurrentPage(0));

    if (salesAgent) {
      const userId = Number(getUserId());
      dispatch(
        fetchSalesAgentPoliciesPageAsync({
          salesAgentId: userId,
          ...req
        })
      )
        .unwrap()
        .then((p) => console.log("Sales‐agent load:", p))
        .catch((e) => console.error(e));
      return;
    }

    const hasFilters =
    filters.firstName ||
    filters.lastName ||
    filters.email ||
    filters.creationDate ||
    filters.carBrand ||
    filters.carModel ||
    filters.carYear !== "";

    if (hasFilters) {
      dispatch(searchPoliciesAsync(req))
        .unwrap()
        .then((payload) => console.log("Search results:", payload))
        .catch((err) => console.error(err));
    } else {
      dispatch(fetchPoliciesPageAsync({ page: 0, size: pageSize }))
        .unwrap()
        .then((p) => console.log("All policies:", p))
        .catch((e) => console.error(e));
    }
  };

  const handleClear = () => {
    setIsSearching(false)
    setSearchFilters(null);

  setFilters({
      firstName: "",
      lastName: "",
      email: "",
      creationDate: "",
      carBrand: "",
      carModel: "",
      carYear: "",
      showAdvancedSearch: false,
    });
  dispatch(setCurrentPage(0));

  if (salesAgent) {
    const userId = Number(getUserId());
    dispatch(
      fetchSalesAgentPoliciesPageAsync({
        salesAgentId: userId,
        page: 0,
        size: pageSize,
      })
    )
      .unwrap()
      .then((p) => console.log("All policies (clear):", p))
      .catch((e) => console.error(e));
  } else {
    dispatch(fetchPoliciesPageAsync({ page: 0, size: pageSize }))
      .unwrap()
      .then((p) => console.log("All policies (clear):", p))
      .catch((e) => console.error(e));
  }
};

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(0));
  };

  const handleViewMore = (policy: PolicyDTO) => {
    navigate(`/policies/${policy.id}`);
  };

  const canViewMore = () => {
    return true;
  }

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}><Loader size={48} className="spin"/></div>
    );
  }

  if (status === "succeeded" && policies?.length === 0) {
   return <>
        <PolicySearchBar
          firstName={filters.firstName}
          lastName={filters.lastName}
          email={filters.email}
          onFirstNameChange={val => updateFilter("firstName", val)}
          onLastNameChange={val => updateFilter("lastName", val)}
          onEmailChange={val => updateFilter("email", val)}
          onSearch={handleSearch}
          onClear={handleClear}
          showAdvancedSearch={filters.showAdvancedSearch}
          toggleAdvancedSearch={toggleAdvancedSearch}
          creationDate={filters.creationDate}
          onCreationDateChange={val => updateFilter("creationDate", val)}
          carBrand={filters.carBrand}
          onCarBrandChange={val => updateFilter("carBrand", val)}
          carModel={filters.carModel}
          onCarModelChange={val => updateFilter("carModel", val)}
          carYear={filters.carYear}
          onCarYearChange={val => updateFilter("carYear", val)}
        />
        <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>No policies found.</p>
      </div>
      </>
  }

  if (status === "failed") {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Failed to load policies.</p>
      </div>
    );
  }

  return (
    <div>
      <PolicySearchBar
        firstName={filters.firstName}
        lastName={filters.lastName}
        email={filters.email}
        onFirstNameChange={val => updateFilter("firstName", val)}
        onLastNameChange={val => updateFilter("lastName", val)}
        onEmailChange={val => updateFilter("email", val)}
        onSearch={handleSearch}
        onClear={handleClear}
        showAdvancedSearch={filters.showAdvancedSearch}
        toggleAdvancedSearch={toggleAdvancedSearch}
        creationDate={filters.creationDate}
        onCreationDateChange={val => updateFilter("creationDate", val)}
        carBrand={filters.carBrand}
        onCarBrandChange={val => updateFilter("carBrand", val)}
        carModel={filters.carModel}
        onCarModelChange={val => updateFilter("carModel", val)}
        carYear={filters.carYear}
        onCarYearChange={val => updateFilter("carYear", val)}
      />

      <GenericTable
        columns={columns}
        data={policies}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        name="policy"
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        showPagination={true}
        canViewMore={canViewMore}
        onViewMore={handleViewMore}
      />
    </div>
  );
};

export default PoliciesTable;
