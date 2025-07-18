import type {
  AuthRequest,
  CountryType,
  UserDTO,
  UserRegistration,
  LoginResponse
} from "../types/UserServiceTypes";
import { api } from "./index";
import type { CountryDTO } from "../types/UserServiceTypes";
import type { SubscriberDTO } from "../types/SubscriberDTO";

export const fetchCountriesPageAPI = (page: number, size: number) =>
  api.get(`/users/countries?page=${page}&size=${size}`);

export const deleteCountryById = (id: number) =>
  api.patch<CountryType>(`users/countries/delete/${id}`);

export const restoreCountryById = (id: number) =>
  api.patch<CountryType>(`users/countries/restore/${id}`);

export const addNewCountry = async (
  country: CountryDTO,
  imageFile: File
): Promise<CountryType> => {
  const formData = new FormData();
  formData.append(
    "country",
    new Blob([JSON.stringify(country)], { type: "application/json" })
  );
  formData.append("image", imageFile);

  try {
    const response = await api.post("/users/countries", formData);
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.message || "Unknown error occurred";
    throw new Error(errorMessage);
  }
};

export const fetchCountryByIdAPI = (id: string) =>
  api.get(`/users/countries/${id}`);

export const updateCountryAPI = (id: string, formData: FormData) =>
  api.put<CountryType>(`/users/countries/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const registerUser = (payload: UserRegistration) =>
  api.post<string>("users/auth/register", payload);

export const loginUser = (payload: AuthRequest) =>
  api.post<LoginResponse>("users/auth/login", payload);

export const verifyUser = (id: any) =>
  api.post<number>("users/auth/verify", { id });

export const validateToken = (token: string) =>
  api.get<string>("users/auth/validate", {
    params: { token },
  });

export const getUserByUsername = (username: string) =>
  api.get<UserRegistration>(`users/users/username/${username}`);

export const fetchSubscribersPage = (
  page: number,
  size: number,
  keyword?: string
) => {
  const params: Record<string, any> = { page, size };
  if (keyword && keyword.trim() !== "") {
    params.keyword = keyword;
  }
  return api.get<{
    content: UserDTO[];
    totalElements: number;
    totalPages: number;
  }>("/users/subscribers", { params });
};

export const addSubscriber = async (payload: SubscriberDTO) => { 
  const response = await api.post("/users/subscribers", payload);
  return response.data;
}