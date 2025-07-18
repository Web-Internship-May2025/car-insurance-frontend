import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  AuthRequest,
  UserRegistration,
  LoginResponse,
} from "../types/UserServiceTypes";
import { loginUser, registerUser } from "../services/UsersApi";

export const registerUserAsync = createAsyncThunk<
  string,
  UserRegistration,
  { rejectValue: string }
>("auth/register", async (userData, thunkAPI) => {
  try {
    const resp = await registerUser(userData);
    return resp.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || err.message || "Registration failed"
    );
  }
});

export const loginUserAsync = createAsyncThunk<
  LoginResponse,
  AuthRequest,
  { rejectValue: string }
>("auth/login", async (credentials, thunkAPI) => {
  try {
    const resp = await loginUser(credentials);
    return resp.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || err.message || "Login failed"
    );
  }
});
