import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchCurrenciesPageAsync } from "./CurrenciesThunk";

interface Currency {
  id: number;
  name: string;
  code: string;
  logo: string;
  creationDate: string;
  lastUpdateDate: string;
  isDeleted: boolean;
  isValid: boolean;
}

interface CurrenciesState {
  currencies: Currency[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  isValid: boolean | null;
  isDeleted: boolean | null;
}

const initialState: CurrenciesState = {
  currencies: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  status: "idle",
  error: null,
  sortBy: "name",
  sortDirection: "asc",
  isValid: null,
  isDeleted: null,
};

const currenciesSlice = createSlice({
  name: "currencies",
  initialState,
  reducers: {
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setSortBy(state, action: PayloadAction<string>) {
    state.sortBy = action.payload;
    },
    setSortDirection(state, action: PayloadAction<'asc' | 'desc'>) {
      state.sortDirection = action.payload;
    },
    setIsValid(state, action: PayloadAction<boolean | null>) {
      state.isValid = action.payload;
    },
    setIsDeleted(state, action: PayloadAction<boolean | null>) {
      state.isDeleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrenciesPageAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrenciesPageAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currencies = action.payload.currencies;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCurrenciesPageAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error fetching data";
      });
  },
});

export const { setPageSize, setCurrentPage, setSortBy, setSortDirection, setIsValid, setIsDeleted } = currenciesSlice.actions;
export default currenciesSlice.reducer;
