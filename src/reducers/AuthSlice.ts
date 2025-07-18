import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import type { UserRoleType } from "../types/UserServiceTypes";
import { getDecodedToken } from "../services/jwtService";
import { loginUserAsync, registerUserAsync } from "./AuthThunk";

const rawToken = localStorage.getItem("jwtToken");
const payload = getDecodedToken(rawToken ?? undefined);

interface AuthState {
  token: string | null;
  role: UserRoleType | null;
  username: string | null;
  id: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  token: rawToken,
  role: payload?.role ?? null,
  username: payload?.username ?? null,
  id: payload?.sub ?? null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("refreshToken");
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem("jwtToken", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      });

    // login
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.token = action.payload.accessToken;
        localStorage.setItem("jwtToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        const payload = getDecodedToken(action.payload.accessToken);
        state.username = payload?.username ?? null;
        state.id = payload?.sub ?? null;
        state.role = payload?.role ?? null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string" ? action.payload : "Login failed";
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthRole = (state: RootState) => state.auth.role;
