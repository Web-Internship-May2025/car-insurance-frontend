import type { PolicyDTO } from "../types/PolicyDTO";
import { api } from "./index";

export const fetchPoliciesPage = (page: number, size: number) =>
  api.get("policies/policies", {
    params: {
      page_num: page,
      page_size: size,
    },
  });
export interface ApiPageInfo{
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}
export interface ApiResponse<T> {
  content: T[];
  page: ApiPageInfo
}

export interface PolicySearchRequest{
  firstName?: string;
  lastName?: string;
  email?: string;
  date?: string;
  brandName?: string;
  modelName?: string;
  carYear?: number;
  page: number;
  size: number;
}

export const searchPolicies = (
  req: PolicySearchRequest
): Promise<ApiResponse<PolicyDTO>> => 
  api.post<{data: ApiResponse<PolicyDTO>; message: string}>("policies/policies/search",req)
  .then(response => response.data.data);

export const fetchPoliciesSubsriber = (
  subscriberId: number,
  page: number,
  size: number,
  sortField: string = 'dateSigned',
  sortDir: string = 'asc'
) => {
  return api.get<ApiResponse<PolicyDTO>>(`policies/policies/subscriber/${subscriberId}`, {
    params: {
      page_num: page,
      page_size: size,
      sortField: sortField,
      sortDir: sortDir,
    },
  });
};
export const fetchSalesAgentPolicies = (
  salesAgentId: number,
  page: number,
  size: number,
) => {
  return api.get<ApiResponse<PolicyDTO>>(`policies/policies/sales-agent/${salesAgentId}`, {
    params: {
      page_num: page,
      page_size: size,
    },
  });
};

export const fetchPolicyById = (id: number | string) => 
  api.get<PolicyDTO>(`policies/policies/policy/${id}`);

export const deletePolicyApi = (id: number | string) =>
  api.delete(`policies/policies/${id}`);

export const restorePolicyApi = (id: number | string) =>
  api.post(`policies/policies/restore/${id}`);
