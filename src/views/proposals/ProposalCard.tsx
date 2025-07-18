import React from "react";
import { CircleEllipsis, Download, Edit2, Trash2 } from "lucide-react";
import "../../styles/ProposalCards.scss";
import type { ProposalDTO } from "../../types/ProposalTypes";

interface ProposalCardProps {
  proposal: ProposalDTO;
  onViewMore: () => void;
  onDownloadPdf: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onViewMore,
  onDownloadPdf,
  onEdit,
  onDelete,
}) => {
  const { proposalStatus } = proposal;

  const canEdit = !(
    proposalStatus === "PAID" || proposalStatus === "CONFIRMED"
  );
  const canViewDownload =
    proposalStatus === "PAID" || proposalStatus === "CONFIRMED";
  const displayValue = (value: any) =>
    value !== undefined && value !== null && value !== ""
      ? value
      : "not defined";

  return (
    <div className="generic-card">
      <h3>Proposal {proposal.id}</h3>
      <div className="card-content">
        <p>
          <strong>Status:</strong> {displayValue(proposal.proposalStatus)}
        </p>
        <p>
          <strong>Created At:</strong> {displayValue(proposal.creationDate)}
        </p>
        <p>
          <strong>Updated At:</strong> {displayValue(proposal.updateDate)}
        </p>
        <p>
          <strong>Subscriber:</strong> {displayValue(proposal.subscriberName)}
        </p>
      </div>
      <div
        className="action-icons"
        style={{ display: "flex", gap: "8px", marginTop: "8px" }}
      >
        {canViewDownload && (
          <>
            <button
              onClick={onViewMore}
              aria-label="View"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <CircleEllipsis size={20} color="green" />
            </button>
            <button
              onClick={onDownloadPdf}
              aria-label="Download PDF"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <Download size={20} color="black" />
            </button>
          </>
        )}
        {canEdit && (
          <button
            onClick={onEdit}
            aria-label="Edit"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <Edit2 size={20} color="blue" />
          </button>
        )}
        <button
          onClick={onDelete}
          aria-label="Delete"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <Trash2 size={20} color="red" />
        </button>
      </div>
    </div>
  );
};

export default ProposalCard;
