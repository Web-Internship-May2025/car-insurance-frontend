import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addNewCountry,
  deleteCountryById,
  fetchCountriesPageAPI,
  fetchCountryByIdAPI,
  restoreCountryById,
  updateCountryAPI,
} from "../services/UsersApi";
import type { AddCountryPayload, CountryType } from "../types/UserServiceTypes";

export const fetchCountriesPageAsync = createAsyncThunk<
  { countries: CountryType[]; totalItems: number; totalPages: number },
  { page: number; size: number }
>("countries/fetchPage", async ({ page, size }, { rejectWithValue }) => {
  try {
    const response = await fetchCountriesPageAPI(page, size);
    return {
      countries: response.data.content,
      totalItems: response.data.totalElements,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const findCountryById = createAsyncThunk<CountryType, string>(
  "countries/{id}",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchCountryByIdAPI(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Error fetching country"
      );
    }
  }
);

export const updateCountry = createAsyncThunk<
  CountryType,
  { id: string; formData: FormData },
  { rejectValue: string }
>("countries/update/{id}", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const resp = await updateCountryAPI(id, formData);
    return resp.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message ?? err.message);
  }
});
export const deleteCountryAsync = createAsyncThunk<
  CountryType,
  number,
{ rejectValue: string }
>("countries/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await deleteCountryById(id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Delete failed"
    );
  }
});

export const restoreCountryAsync = createAsyncThunk<CountryType, number>(
  "countries/restore",
  async (id, { rejectWithValue }) => {
    try {
      const response = await restoreCountryById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Restore failed"
      );
    }
  }
);

export const addCountry = createAsyncThunk<CountryType, AddCountryPayload>(
  "countries/addCountry",
  async ({ name, abbreviation, imageFile }, { rejectWithValue }) => {
    try {
      const countryDTO = { name, abbreviation };
      const savedCountry = await addNewCountry(countryDTO, imageFile);
      return savedCountry;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add country");
    }
  }
);
