import {
  deleteBrandById,
  fetchBrandsPage,
  restoreBrandById,
  editBrandById,
  getBrandById,
  addNewBrand,
} from "../services/BrandsApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { BrandDTO } from "../types/CarServiceTypes";

export const createBrand = createAsyncThunk<
  BrandDTO,                          
  { name: string; logoFile: File }, 
  { rejectValue: string }
>( "brands/create",
  async ({ name, logoFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("logoFile", logoFile);

      const response = await addNewBrand(formData);
      return response.data as BrandDTO;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Create failed";
      return rejectWithValue(message);
    }
  }
);

export const fetchBrandsPageAsync = createAsyncThunk<
  { content: BrandDTO[]; totalElements: number; totalPages: number },
  { page: number; size: number }
>("brands/fetchPage", async ({ page, size }, { rejectWithValue }) => {
  try {
    const resp = await fetchBrandsPage(page, size);
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
});

export const deleteBrandAsync = createAsyncThunk<BrandDTO, number>(
  "brands/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteBrandById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Delete failed"
      );
    }
  }
);

export const restoreBrandAsync = createAsyncThunk<BrandDTO, number>(
  "brands/restore",
  async (id, { rejectWithValue }) => {
    try {
      const response = await restoreBrandById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Restore failed"
      );
    }
  }
);

export const getBrandByIdAsync = createAsyncThunk<BrandDTO, string>(
  "brand/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getBrandById(parseInt(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Getting failed"
      );
    }
  }
);

export const editBrandAsync = createAsyncThunk<
  BrandDTO,
  { id: number; data: FormData | BrandDTO }
>("brand/edit", async ({ id, data }, { rejectWithValue }) => {
  try {
    let response;
    response = await editBrandById(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Update failed"
    );
  }
});
