import type { BrandDTO } from "../types/CarServiceTypes";
import { api } from "./index";

export const fetchBrands = () => api.get("/");

export const fetchBrandsPage = (page: number, size: number) =>
  api.get("cars/brands", {
    params: {
      page_num: page,
      page_size: size,
    },
  });

export const addNewBrand = (data: FormData) =>
  api.post<BrandDTO>("cars/brands", data);

export const deleteBrandById = (id: number) =>
  api.patch<BrandDTO>(`cars/brands/delete/${id}`);

export const restoreBrandById = (id: number) =>
  api.patch<BrandDTO>(`cars/brands/restore/${id}`);

export const getBrandById = (id: number) =>
  api.get<BrandDTO>(`cars/brands/${id}`);

export const editBrandById = (id: number, data: FormData | BrandDTO) => {
  return api.put<BrandDTO>(`cars/brands/${id}`, data);
};
