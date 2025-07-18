import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "../../reducers";
import {
  createProposal,
  fetchProposalsPageAsync,
} from "../../reducers/ProposalsThunk";
import { useNavigate } from "react-router-dom";
import { CirclePlus, Grid, LayoutGrid } from "lucide-react";
import ProposalsTable from "./ProposalsTable";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import type { ProposalDTO } from "../../types/ProposalTypes";
import ProposalCards from "./ProposalCards";
import { setCurrentPage, setPageSize } from "../../reducers/ProposalsSlice";

import "../../styles/ProposalsPage.scss";

export default function ProposalsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { proposals, totalItems, totalPages, currentPage, pageSize, status } =
    useSelector((state: RootState) => state.proposals);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    console.log("change");
    dispatch(fetchProposalsPageAsync({ page: currentPage, size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(1));
  };

  const handleAddNew = () => {
    setDialogOpen(true);
  };
  const handleConfirm = async () => {
    setDialogOpen(false);
    try {
      const resultAction = await dispatch(createProposal());

      if (createProposal.fulfilled.match(resultAction)) {
        navigate("/proposals/new");
      }
    } catch (err) {
      console.error("Failed to create proposal:", err);
    }
  };
  const handleCancel = () => {
    setDialogOpen(false);
    navigate("/proposals");
  };

  const handleViewMore = () => {
    console.log("Clicked view more");
  };

  const handleOnDownloadPDF = () => {
    console.log("Clicked download PDF");
  };

  const handleDelete = () => {
    console.log("Clicked delete");
  };

  const handleRestore = () => {
    console.log("Clicked restore");
  };

  const handleEdit = (proposal: ProposalDTO) => {
    if (
      proposal.proposalStatus !== "PAID" &&
      proposal.proposalStatus !== "CONFIRMED"
    ) {
      navigate(`/proposals/edit/${proposal.id}`);
    }
  };
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "failed") {
    return <div>Failed to load proposals</div>;
  }
  return (
    <div>
      <div className="header-container">
        <h2 className="header">Proposals</h2>
        <div className="header-buttons">
          <button className="add-new-button" onClick={handleAddNew}>
            <CirclePlus color="white" size={24} style={{ marginRight: 6 }} />
            New
          </button>
          <button
            onClick={() => setViewMode("table")}
            disabled={viewMode === "table"}
            aria-label="Switch to table view"
            title="Switch to table view"
            className="view-button"
          >
            <Grid size={24} color={viewMode === "grid" ? "blue" : "gray"} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            disabled={viewMode === "grid"}
            aria-label="Switch to grid view"
            title="Switch to grid view"
            className="view-button"
          >
            <LayoutGrid
              size={24}
              color={viewMode === "table" ? "blue" : "gray"}
            />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <ProposalCards
          proposals={proposals}
          onViewMore={handleViewMore}
          onDownloadPdf={handleOnDownloadPDF}
          onEdit={handleEdit}
          onDelete={handleDelete}
          totalItems={totalItems}
          totalPages={totalPages}
          currentPage={currentPage}
          pageSize={pageSize}
          showPagination={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      ) : (
        <ProposalsTable
          proposals={proposals}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMore={handleViewMore}
          onRestore={handleRestore}
          totalItems={totalItems}
          totalPages={totalPages}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <ConfirmationDialog
        open={dialogOpen}
        title="Initialize New Proposal"
        description="Are you sure you want to initialize a new proposal?"
        options={{ cancelText: "Back", restoreText: "Yes" }}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
