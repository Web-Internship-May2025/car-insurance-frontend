export interface Model {
  id: number | null;
  name: string;
  creationDate: string | null;
  brandId: number | null;
  isDeleted: boolean;
}

export interface Brand {
  name: string;
  creationDate: string;
  logoImage: string;
  isDeleted: boolean;
  models: Model[];
  modelNames?: string[];
}

export const BASE_API_URL = "http://localhost:8080";
// TODO use react redux
export async function getBrandById(id: number): Promise<Brand> {
  const response = await fetch(`${BASE_API_URL}/cars/brands/${id}`);
  if (!response.ok) {
    throw new Error("Nije moguće dobiti podatke o brendu");
    
  }
  const data: Brand = await response.json();
  return data;
}
