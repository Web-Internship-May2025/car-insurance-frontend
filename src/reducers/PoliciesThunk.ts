import { createAsyncThunk } from '@reduxjs/toolkit';
import { deletePolicyApi, fetchPoliciesSubsriber, fetchPolicyById, restorePolicyApi, searchPolicies, type ApiResponse, type PolicySearchRequest } from '../services/PolicyApi';
import type { PolicyDTO } from '../types/PolicyDTO';
import { fetchPoliciesPage, fetchSalesAgentPolicies} from "../services/PolicyApi"

interface PageResult{
  content:PolicyDTO[]
  totalElements: number;
  totalPages: number;
}

export const searchPoliciesAsync = createAsyncThunk<
  ApiResponse<PolicyDTO>,
  PolicySearchRequest
>(
  'policies/search',
  async (request, { rejectWithValue }) => {
    try {
      const resp = await searchPolicies(request);
      
      return resp;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      return rejectWithValue(msg)
    }
  }
);

export const fetchPoliciesPageAsyncSubsriber = createAsyncThunk<
  { content: PolicyDTO[]; totalElements: number; totalPages: number },
  { subscriberId: number; page: number; size: number; sortField?: string; sortDir?: string }
>(
  'policies/fetchPageSubsriber',
  async ({ subscriberId, page, size, sortField = 'dateSigned', sortDir = 'asc' }, { rejectWithValue }) => {
    try {
      const resp = await fetchPoliciesSubsriber(subscriberId, page, size, sortField, sortDir);
      return {
        content: resp.data.content,
        totalElements: resp.data.page.totalElements,
        totalPages: resp.data.page.totalPages ?? 0,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);


export const fetchPoliciesPageAsync = createAsyncThunk<
  { content: PolicyDTO[]; totalElements: number; totalPages: number },
  { page: number; size: number }
>("policies/fetchPage", async ({ page, size }, { rejectWithValue }) => {
  try {
    const resp = await fetchPoliciesPage(page, size);
    console.log("PAGED POLICIES", resp.data)
    return {
      content: resp.data.content,
      totalElements: resp.data.page.totalElements,
      totalPages: resp.data.page.totalPages,
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export const fetchSalesAgentPoliciesPageAsync = createAsyncThunk<
  { content: PolicyDTO[]; totalElements: number; totalPages: number },
  { salesAgentId: number; page: number; size: number }
>(
  'policies/fetchAgentPage',
  async ({ salesAgentId, page, size }, { rejectWithValue }) => {
    try {
      const resp = await fetchSalesAgentPolicies(salesAgentId, page, size);
      return {
        content: resp.data.content,
        totalElements: resp.data.page.totalElements,
        totalPages: resp.data.page.totalPages,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);


export const getPolicyByIdAsync = createAsyncThunk(
  "policies/getById",
  async (id: number | string) => {
    const response = await fetchPolicyById(id); 
    return response.data;
  }
);

export const deletePolicyAsync = createAsyncThunk(
  "policies/delete",
  async (id: number | string) => {
    await deletePolicyApi(id);
    return id;
  }
);

export const restorePolicyAsync = createAsyncThunk(
  "policies/restore",
  async (id: number | string) => {
    await restorePolicyApi(id);
    return id;
  }
);
  

