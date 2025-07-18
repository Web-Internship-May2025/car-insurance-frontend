import { createAsyncThunk } from "@reduxjs/toolkit";
import {getUserByUsername} from "../services/UsersApi";
import type { UserRegistration } from "../types/UserServiceTypes";


export const fetchUserByUsername = createAsyncThunk<
  UserRegistration,
  string,
  { rejectValue: string }
>("users/getUserByUsername", async (username, { rejectWithValue }) => {
  try {
    const response = await getUserByUsername(username);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to fetch user"
    );
  }
});

