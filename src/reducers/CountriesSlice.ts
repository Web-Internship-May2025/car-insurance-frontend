import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addCountry } from "./CountriesThunk";
import {
  deleteCountryAsync,
  fetchCountriesPageAsync,
  findCountryById,
  restoreCountryAsync,
  updateCountry,
} from "./CountriesThunk";
import type { CountryType } from "../types/UserServiceTypes";

interface CountriesState {
  countries: CountryType[];
  selectedCountry: CountryType | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;

  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;

  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;

  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;

  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const initialState: CountriesState = {
  countries: [],
  selectedCountry: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
  pageSize: 10,
};

const countriesSlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetCountry: (state) => {
      state.selectedCountry = null;
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(addCountry.pending, (state) => {
      state.createStatus = "loading";
      state.createError = null;
    });
    builder.addCase(addCountry.fulfilled, (state, action) => {
      state.createStatus = "succeeded";
      state.countries.push(action.payload);
    });
    builder.addCase(addCountry.rejected, (state, action) => {
      state.createStatus = "failed";
      state.createError = action.error.message ?? "Failed to create country";
    });
    builder
      .addCase(fetchCountriesPageAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCountriesPageAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.countries = action.payload.countries;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCountriesPageAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error fetching data";
      })
      .addCase(deleteCountryAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCountryAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.countries.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.countries[index] = action.payload;
        }
      })
      .addCase(deleteCountryAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Delete failed";
      })

      .addCase(restoreCountryAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(restoreCountryAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.countries.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.countries[index] = action.payload;
        }
      })
      .addCase(restoreCountryAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Restore failed";
      })
      .addCase(findCountryById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(findCountryById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCountry = action.payload;
      })
      .addCase(findCountryById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(updateCountry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCountry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCountry = action.payload;
      })
      .addCase(updateCountry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Update failed";
      });
  },
});

export const { resetCountry, setPageSize, setCurrentPage } =
  countriesSlice.actions;
export default countriesSlice.reducer;
