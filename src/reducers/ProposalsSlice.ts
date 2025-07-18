import { createSlice } from "@reduxjs/toolkit";
import {
  createProposal,
  fetchProposalsPageAsync,
} from "../reducers/ProposalsThunk";
import type { ProposalDTO } from "../types/ProposalTypes";

interface ProposalsState {
  proposals: ProposalDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;

  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;

  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
}

const initialState: ProposalsState = {
  proposals: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
};

const proposalsSlice = createSlice({
  name: "proposals",
  initialState,
  reducers: {
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProposalsPageAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProposalsPageAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.proposals = action.payload.proposals;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProposalsPageAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch proposals";
      })
      .addCase(createProposal.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createProposal.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createProposal.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as string) ?? "Create proposal failed";
      });
  },
});

export const { setPageSize, setCurrentPage } = proposalsSlice.actions;
export default proposalsSlice.reducer;
