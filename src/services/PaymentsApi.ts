import { api } from "./index";

interface FetchCurrenciesOptions {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isValid?: boolean | null;
  isDeleted?: boolean | null;
}

export const fetchCurrenciesPage = ({
  page,
  size,
  sortBy = "name",
  sortDirection = "asc",
  isValid = null,
  isDeleted = null,
}: FetchCurrenciesOptions) => {
  let query = `/payments/currencies?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
  if (isValid !== null && isValid !== undefined) {
    query += `&isValid=${isValid}`;
  }
  if (isDeleted !== null && isDeleted !== undefined) {
    query += `&isDeleted=${isDeleted}`;
  }
  return api.get(query);
};
