import { api } from "./index";

export const addNewProposal = async () => {
  const response = await api.post("policies/proposals");
  return response.data;
};

export const fetchProposalsPageAPI = (page: number, size: number) =>
  api.get(`/policies/proposals?page_num=${page}&page_size=${size}`);
