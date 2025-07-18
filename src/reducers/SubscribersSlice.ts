import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { UserDTO } from "../types/UserServiceTypes";
import { addSubscriberAsync } from "./SubscribersThunk";

interface SubscribersPage {
  content: UserDTO[];
  totalElements: number;
  totalPages: number;
  number: number; 
  size: number;
}

interface SubscribersState {
  subscribers: UserDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchKeyword: string;
}

const initialState: SubscribersState = {
  subscribers: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  status: "idle",
  error: null,
  searchKeyword: "",
};

export const fetchSubscribersPageAsync = createAsyncThunk<
  SubscribersPage,
  { page: number; size: number; keyword: string },
  { rejectValue: string }
>(
  "subscribers/fetchPage",
  async ({ page, size, keyword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt_token");
      const params: any = { page, size };
      if (keyword.trim()) params.keyword = keyword;

      const response = await axios.get<SubscribersPage>("/subscribers", {
        baseURL: "http://localhost:8080",
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Fetch error"
      );
    }
  }
);

const subscribersSlice = createSlice({
  name: "subscribers",
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
    setSearchKeyword(state, action: PayloadAction<string>) {
      state.searchKeyword = action.payload;
    },
    clearSearchKeyword(state) {
      state.searchKeyword = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribersPageAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubscribersPageAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscribers = action.payload.content;
        state.totalItems = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
        state.pageSize = action.payload.size;
      })
      .addCase(fetchSubscribersPageAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch";
      })
      .addCase(addSubscriberAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addSubscriberAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscribers.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(addSubscriberAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add subscriber";
      });
  },
});

export const { setCurrentPage, setPageSize, setSearchKeyword, clearSearchKeyword } =
  subscribersSlice.actions;

export default subscribersSlice.reducer;