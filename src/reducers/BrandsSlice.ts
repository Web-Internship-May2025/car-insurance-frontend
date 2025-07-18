import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBrandsPageAsync,
  deleteBrandAsync,
  restoreBrandAsync,
  getBrandByIdAsync,
  editBrandAsync,
  createBrand,
} from "./BrandsThunk";
import type { BrandDTO } from "../types/CarServiceTypes";

interface BrandsState {
  brands: BrandDTO[];
  selectedBrand : BrandDTO | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;

  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
}

const initialState: BrandsState = {
  brands: [],
  selectedBrand: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
};

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrandsPageAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsPageAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.brands = action.payload.content;
        state.totalItems = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBrandsPageAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load brands";
      })
      .addCase(deleteBrandAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteBrandAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.brands.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(deleteBrandAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Delete failed";
      })
      .addCase(restoreBrandAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(restoreBrandAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.brands.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(restoreBrandAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Restore failed";
      })
      .addCase(getBrandByIdAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getBrandByIdAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedBrand = action.payload;
      })
      .addCase(getBrandByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Getting failed";
      })
      .addCase(editBrandAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editBrandAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.brands.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(editBrandAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Edit failed";
      })
      .addCase(createBrand.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createBrand.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
        (action.payload as string) ?? "Create brand failed";
      });
  },
});

export const { setCurrentPage, setPageSize } = brandsSlice.actions;
export default brandsSlice.reducer;
