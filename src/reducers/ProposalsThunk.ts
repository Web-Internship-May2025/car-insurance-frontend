import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addNewProposal,
  fetchProposalsPageAPI,
} from "../services/ProposalsApi";
import type { ProposalDTO } from "../types/ProposalTypes";

export const createProposal = createAsyncThunk(
  "proposal/createProposal",
  async (_, { rejectWithValue }) => {
    try {
      const data = await addNewProposal();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProposalsPageAsync = createAsyncThunk<
  { proposals: ProposalDTO[]; totalItems: number; totalPages: number },
  { page: number; size: number }
>("proposals/fetchPage", async ({ page, size }, { rejectWithValue }) => {
  try {
    const response = await fetchProposalsPageAPI(page, size);
    return {
      proposals: response.data.content,
      totalItems: response.data.totalElements,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
