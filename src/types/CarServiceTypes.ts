type Model = {
  id: number;
  name: string;
};

export type BrandDTO = {
  data: BrandDTO;
  id: number;
  name: string;
  creationDate: string;
  logoImage: string;
  isDeleted: boolean;
  models?: Model[];  
};

type CarPartDTO = {
  id: number;
  costOfRepair: number;
  description: string;
  isDeleted: boolean;
};

export type CarDTO = {
  id: number;
  year: number;
  image: string | null;
  isDeleted: boolean;
  carParts?: CarPartDTO[];  
  modelId: number | null;
};