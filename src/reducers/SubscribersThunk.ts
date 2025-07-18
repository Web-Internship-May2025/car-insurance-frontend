import { createAsyncThunk } from "@reduxjs/toolkit";
import { addSubscriber, fetchSubscribersPage } from "../services/UsersApi";
import type { UserDTO } from "../types/UserServiceTypes";
import type { SubscriberDTO } from "../types/SubscriberDTO";

interface SubscribersPage {
  content: UserDTO[];
  totalElements: number;
  totalPages: number;
}

export const fetchSubscribersPageAsync = createAsyncThunk<
  SubscribersPage,
  { page: number; size: number; keyword?: string }
>(
  "subscribers/fetchPage",
  async ({ page, size, keyword }, { rejectWithValue }) => {
    try {
      const resp = await fetchSubscribersPage(page, size, keyword);
      return {
        content: resp.data.content,
        totalElements: resp.data.totalElements,
        totalPages: resp.data.totalPages,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const addSubscriberAsync = createAsyncThunk<
  UserDTO,
  SubscriberDTO,
  { rejectValue: string }
>(
  "subscribers/addSubscriber",
  async (newSubscriber, { rejectWithValue }) => {
    try {
      const response = await addSubscriber(newSubscriber);
      return response; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Add subscriber error"
      );
    }
  }
);