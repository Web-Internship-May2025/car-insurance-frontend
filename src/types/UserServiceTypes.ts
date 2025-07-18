export type CountryType = {
  id: number;
  name: string;
  abbreviation: string;
  createdAt: string;
  updatedAt: string;
  icon: string;
  isDeleted: boolean;
};

export type GenderType = "MALE" | "FEMALE" | "OTHER";

export type MaritalStatusType =
  | "SINGLE"
  | "TAKEN"
  | "DIVORCED"
  | "WIDOWED"
  | "OTHER";

export type UserRoleType =
  | "SUBSCRIBER"
  | "DRIVER"
  | "MANAGER"
  | "CLAIMS_ADJUSTER"
  | "SALES_AGENT"
  | "CUSTOMER_SERVICE_REPRESENTATIVE"
  | "ADMINISTRATOR"
  | "CLAIM_HANDLER";

export interface UserRegistration {
  firstName: string;
  lastName: string;
  jmbg: string;
  birthDate: string;
  gender: GenderType;
  maritalStatus: MaritalStatusType;
  email: string;
  username: string;
  password: string;
  userRoleType: UserRoleType;
  icon: string;
  isEnabled?: boolean;
  isActive?: boolean;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CountryDTO {
  name: string;
  abbreviation: string;
}

export interface AddCountryPayload {
  name: string;
  abbreviation: string;
  imageFile: File;
}

export interface UserDTO {
  id: number | string; 
  firstName: string;
  lastName: string;
  jmbg: string;
  birthDate: string; 
  isDeleted: boolean;
  gender: GenderType;
  maritalStatus: MaritalStatusType;
  email: string;
  username: string;
  password?: string; 
  isEnabled?: boolean;
  isActive?: boolean;
  userRoleType: UserRoleType;
}