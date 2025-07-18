import type { CarDTO } from "../types/CarServiceTypes";
import { api } from "./index";
import axios from "axios";

  const IMAGE_BASE_URL = "http://localhost:8080/cars/images";


export const getCarById = (id: number) => 
  api.get<CarDTO>(`cars/cars/${id}`);

export const getCarImage = (fileName: string): Promise<Blob> => {
  return axios.get(`${IMAGE_BASE_URL}/${fileName}`, {
    responseType: "blob",
  }).then(response => response.data);
};