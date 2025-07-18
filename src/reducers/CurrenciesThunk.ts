import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Currency } from "../types/PaymentServiceTypes";
import { fetchCurrenciesPage } from "../services/PaymentsApi";

interface FetchCurrenciesParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isValid?: boolean | null;
  isDeleted?: boolean | null;
}

export const fetchCurrenciesPageAsync = createAsyncThunk<
  { currencies: Currency[]; totalItems: number; totalPages: number },
  FetchCurrenciesParams
>("currencies/fetchPage", async ({ page, size, sortBy = "name", sortDirection = "asc", isValid = null, isDeleted = null }, { rejectWithValue }) => {
  try {
    const response = await fetchCurrenciesPage({
        page,
        size,
        sortBy,
        sortDirection,
        isValid,
        isDeleted,
      });
    return {
      currencies: response.data.content,
      totalItems: response.data.totalElements,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
