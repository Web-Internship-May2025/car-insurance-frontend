import React from "react";
import type { Column } from "../../components/Table.tsx";
import GenericTable from "../../components/Table.tsx";
import type { ProposalDTO } from "../../types/ProposalTypes.ts";

interface ProposalsTableProps {
  proposals: ProposalDTO[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (proposal: ProposalDTO) => void;
  onDelete: (proposal: ProposalDTO) => void;
  onViewMore: (proposal: ProposalDTO) => void;
  onRestore: (proposal: ProposalDTO) => void;
}

const canEditRow = (proposal: ProposalDTO) => {
  return proposal.proposalStatus !== "PAID" && proposal.proposalStatus !== "CONFIRMED";
};

const canViewMoreOrDownloadRow = (proposal: ProposalDTO) => {
  return proposal.proposalStatus === "PAID" || proposal.proposalStatus === "CONFIRMED";
};

const displayValue = (value: any) =>
  value !== undefined && value !== null && value !== "" ? value : "not defined";
const proposalColumns: Column<ProposalDTO>[] = [
  { header: "ID", field: "id", width: 50, render: (val) => displayValue(val) },
  {
    header: "Created At",
    field: "creationDate",
    render: (val) => displayValue(val),
  },
  {
    header: "Updated At",
    field: "updateDate",
    render: (val) => displayValue(val),
  },
  {
    header: "Subscriber name",
    field: "subscriberName",
    editable: true,
    render: (val) => displayValue(val),
  },
  {
    header: "Status",
    field: "proposalStatus",
    editable: true,
    render: (val) => displayValue(val),
  },
];
const ProposalsTable: React.FC<ProposalsTableProps> = ({
  proposals,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onViewMore,
  onRestore,
}) => {
  if (!proposals) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        No data available
      </div>
    );
  }
  return (
    <>
      <GenericTable
        columns={proposalColumns}
        data={proposals}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        showPagination={true}
        onEdit={onEdit}
        onViewMore={onViewMore}
        onDeleteClick={onDelete}
        onRestoreClick={onRestore}
        canEditRow={canEditRow}
        canViewMore={canViewMoreOrDownloadRow}
        canDownload={canViewMoreOrDownloadRow}
        name={"Proposals"}
      />
    </>
  );
};
export default ProposalsTable;
