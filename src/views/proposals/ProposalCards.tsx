import CardsLayout from "../../components/layout/CardsLayout";
import Pagination from "../../components/Pagination";
import ProposalCard from "./ProposalCard";
import type { ProposalDTO } from "../../types/ProposalTypes";

import "../../styles/ProposalCards.scss";

interface ProposalItem {
  proposal: ProposalDTO;
  canEdit: boolean;
  canView: boolean;
  canDownload: boolean;
}

interface ProposalCardsProps {
  proposals: ProposalDTO[];
  onViewMore: (proposal: ProposalDTO) => void;
  onDownloadPdf: (proposal: ProposalDTO) => void;
  onEdit: (proposal: ProposalDTO) => void;
  onDelete: (proposal: ProposalDTO) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showPagination: boolean;
  totalItems: number;
  totalPages?: number;
  currentPage: number;
  pageSize: number;
}

const ProposalCards = ({
  proposals,
  onViewMore,
  onDownloadPdf,
  onEdit,
  onDelete,
  totalItems,
  showPagination,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}: ProposalCardsProps) => {
  const proposalItems: ProposalItem[] = proposals.map((p) => {
    const canEdit =
      p.proposalStatus !== "PAID" && p.proposalStatus !== "CONFIRMED";
    const canView =
      p.proposalStatus === "PAID" || p.proposalStatus === "CONFIRMED";
    const canDownload = canView;
    return { proposal: p, canEdit, canView, canDownload };
  });

  return (
    <>
      <CardsLayout>
        {proposalItems.map((item) => (
          <ProposalCard
            key={item.proposal.id}
            proposal={item.proposal}
            onViewMore={() => onViewMore(item.proposal)}
            onDownloadPdf={() => onDownloadPdf(item.proposal)}
            onEdit={() => onEdit(item.proposal)}
            onDelete={() => onDelete(item.proposal)}
          />
        ))}
      </CardsLayout>
      {showPagination && (
        <Pagination
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalItems}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange} totalPages={0}        />
      )}
    </>
  );
};
export default ProposalCards;
