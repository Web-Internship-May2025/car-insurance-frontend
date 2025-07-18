import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPoliciesPageAsync,
  fetchPoliciesPageAsyncSubsriber,
  fetchSalesAgentPoliciesPageAsync,
  getPolicyByIdAsync,
  deletePolicyAsync,
  restorePolicyAsync,
  searchPoliciesAsync
} from "./PoliciesThunk";
import type { PolicyDTO } from "../types/PolicyDTO";

interface PoliciesState {
  policies: PolicyDTO[];
  selectedPolicy: PolicyDTO | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PoliciesState = {
  policies: [],
  selectedPolicy: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  status: "idle",
  error: null,
};

const policiesSlice = createSlice({
  name: "policies",
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
      .addCase(fetchPoliciesPageAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPoliciesPageAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.policies = action.payload.content;
        state.totalItems = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPoliciesPageAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load policies";
      })
      .addCase(fetchSalesAgentPoliciesPageAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSalesAgentPoliciesPageAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.policies = action.payload.content;
        state.totalItems = action.payload.totalElements;
        state.totalPages = action.payload.totalPages ?? Math.ceil(state.totalItems / state.pageSize);
      })
      .addCase(fetchSalesAgentPoliciesPageAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ?? "Could not load policies";
      })
      .addCase(fetchPoliciesPageAsyncSubsriber.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPoliciesPageAsyncSubsriber.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.policies = action.payload.content;
        state.totalItems = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPoliciesPageAsyncSubsriber.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ?? "Error fetching policies";
      })
      // Dodato za getPolicyByIdAsync
      .addCase(getPolicyByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPolicyByIdAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedPolicy = action.payload;
        state.error = null;
      })
      .addCase(getPolicyByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load policy details";
        state.selectedPolicy = null;
      })
      // Dodato za deletePolicyAsync
      .addCase(deletePolicyAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePolicyAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.selectedPolicy && state.selectedPolicy.id === action.payload) {
          state.selectedPolicy.isDeleted = true;
        }
        // Opcionalno, možeš ažurirati i policies listu ako je potrebno
      })
      .addCase(deletePolicyAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not delete policy";
      })
      // Dodato za restorePolicyAsync
      .addCase(restorePolicyAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(restorePolicyAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.selectedPolicy && state.selectedPolicy.id === action.payload) {
          state.selectedPolicy.isDeleted = false;
        }
        // Opcionalno, možeš ažurirati i policies listu ako je potrebno
      })
      .addCase(restorePolicyAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not restore policy";
      });

      builder
      .addCase(searchPoliciesAsync.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(searchPoliciesAsync.fulfilled, (state, { payload }) => {
        console.log(payload)
        state.status = 'succeeded'
        state.policies    = payload.content
        state.totalItems  = payload.page.totalElements
        state.totalPages  = payload.page.totalPages ?? 1
      })
      .addCase(searchPoliciesAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) ?? action.error.message ?? 'Search failed'
      })

  },
});

export const { setCurrentPage, setPageSize } = policiesSlice.actions;
export default policiesSlice.reducer;