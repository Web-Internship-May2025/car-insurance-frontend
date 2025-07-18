import React, { useState, useEffect, useRef } from "react";
import GenericTable from "../../components/Table";
import type { Column } from "../../components/Table";
import {
  setCurrentPage,
  setPageSize,
  setSearchKeyword,
} from "../../reducers/SubscribersSlice";
import type { RootState } from "../../reducers";
import type { UserDTO } from "../../types/UserServiceTypes";
import { fetchSubscribersPageAsync } from "../../reducers/SubscribersThunk";
import { useAppDispatch, useAppSelector } from "../../reducers";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CreateSubscriberForm from "./AddSubscriberPage"; 
import "../../styles/SubscriberTable.scss";
import "../../styles/TableMainLayout.scss"
import { CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const columns: Column<UserDTO>[] = [
  { header: "First Name", field: "firstName", width: 150 },
  { header: "Last Name", field: "lastName", width: 150 },
  { header: "JMBG", field: "jmbg", width: 130 },
  {
    header: "Birth Date",
    field: "birthDate",
    width: 180,
    render: (val) => new Date(val).toLocaleDateString(),
  },
  { header: "Gender", field: "gender", width: 100 },
  { header: "Marital Status", field: "maritalStatus", width: 150 },
  { header: "Email", field: "email", width: 250 },
  { header: "Username", field: "username", width: 150 },
  {
    header: "Active",
    field: "isActive",
    width: 80,
    render: (val) => (val ? "Yes" : "No"),
  },
];

const SubscriberTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    subscribers,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    status,
    searchKeyword,
  } = useAppSelector((state: RootState) => state.subscribers);

  const [searchInput, setSearchInput] = useState(searchKeyword ?? "");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, [subscribers]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchKeyword(searchInput));
      dispatch(setCurrentPage(0));
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, dispatch]);

  useEffect(() => {
    dispatch(
      fetchSubscribersPageAsync({
        page: currentPage,
        size: pageSize,
        keyword: searchKeyword,
      })
    ).then((result: any) => {
      const fetchedData = result.payload?.data ?? [];
      if (fetchedData.length === 0 && currentPage > 0) {
        dispatch(setCurrentPage(currentPage - 1));
      }
    });
  }, [dispatch, currentPage, pageSize, searchKeyword]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(0));
  };

  const canViewMore = () => {
    return true;
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    dispatch(
      fetchSubscribersPageAsync({
        page: currentPage,
        size: pageSize,
        keyword: searchKeyword,
      })
    );
  };
  
  const handleBackFromDialog = () => {
    setOpenDialog(false);
    navigate("/policy-creation");
  };

  if (status === "loading") return <div>Loading subscribers...</div>;
  if (status === "failed") return <div>Failed to load subscribers.</div>;

  return (
    <div>
      <div className="subscribers-header">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search by first name, last name, or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="subscribers-search-input"
          aria-label="Search subscribers"
        />
        <Button onClick={handleDialogOpen} className="add-subscriber-button">
          <CirclePlus color="white" size={18} style={{ marginRight: 6 }} />
          Add New Subscriber
        </Button>
      </div>
      <GenericTable
        columns={columns}
        data={subscribers}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        name="subscribers"
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        showPagination={true}
        canViewMore={canViewMore}
      />
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        className="custom-dialog"
      >
        <DialogContent>
          <CreateSubscriberForm
            onCreated={handleDialogClose}
            onClose={handleBackFromDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriberTable;