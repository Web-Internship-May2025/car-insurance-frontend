import { createSlice } from "@reduxjs/toolkit";
import { fetchUserByUsername, updateUser} from "./UsersThunk";
import type { UserRegistration } from "../types/UserServiceTypes";

interface UsersState {
  user: UserRegistration | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  user: null,
  status: "idle",
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUser(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByUsername.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserByUsername.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserByUsername.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Error fetching user";
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Update failed";
      });
  },
});

export const { resetUser } = usersSlice.actions;
export default usersSlice.reducer;