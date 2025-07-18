export type PolicyDTO = {
  id: number;
  policyNumber: string;
  carId: string;
  dateSigned: string;
  expiringDate: string;
  moneyReceivedDate: string;
  amount: number;
  isDeleted: boolean;
  valid: boolean;
  canAddClaim: boolean;
  firstName: string;
  lastName: string;
};