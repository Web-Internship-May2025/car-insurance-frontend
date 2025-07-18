import React, { useEffect, useState } from "react";

import { useAppDispatch } from "../../reducers";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../components/Table.tsx";
import { ProtectedImage } from "../../components/ProtectedImage.tsx";
import type { RootState } from "../../reducers/index.ts";
import type { Column } from "../../components/Table.tsx";
import type { BrandDTO } from "../../types/CarServiceTypes.ts";
import { setCurrentPage, setPageSize } from "../../reducers/BrandsSlice.ts";
import {
  deleteBrandAsync,
  fetchBrandsPageAsync,
  restoreBrandAsync,
} from "../../reducers/BrandsThunk.ts";

import "../../styles/BrandTable.scss";
import ConfirmationDialog from "../../components/ConfirmationDialog.tsx";

import { CAR_SERVICE_IMAGES_URL } from "../../services/constants";
import { USER_SERVICE_IMAGES_URL } from "../countries/CountriesTable.tsx";

const columns: Column<BrandDTO>[] = [
  { header: "ID", field: "id", width: 30 },
  {
    header: "Creation Date",
    field: "creationDate",
    width: 230,
  },
  { header: "Name", field: "name", editable: true, width: 150 },
  {
    header: "Logo",
    field: "logoImage",
    render: (val) => (
      <ProtectedImage src={`${CAR_SERVICE_IMAGES_URL}/${val}`} alt="logo" />
    ),
    width: 100,
  },
  {
    header: "Active",
    field: "isDeleted",
    render: (val) => (val ? "No" : "Yes"),
    editable: true,
    width: 60,
  },
];

const BrandTable: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    options: {
      deleteText?: string;
      cancelText?: string;
    };
    onConfirm: () => void;
  } | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    selectedBrand,
    brands,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    status,
    error,
  } = useSelector((state: RootState) => state.brands);

  const [currentIconUrl, setCurrentIconUrl] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBrandsPageAsync({ page: currentPage, size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    if (!selectedBrand) return;
    if (selectedBrand.icon) {
      setCurrentIconUrl(
        `${USER_SERVICE_IMAGES_URL}/brand/${selectedBrand.icon}`
      );
    } else {
      setCurrentIconUrl(null);
    }
  }, [selectedBrand]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(0));
  };
  const handleViewMore = (brand: BrandDTO) => {
    navigate(`/brands/${brand.id}`);
  };

  const getRowClass = (brand: BrandDTO) => {
    return brand.isDeleted ? "deleted-row" : "";
  };

  const handleEdit = (brand: BrandDTO) => {
    navigate(`/brands/edit/${brand.id}`);
  };

  const handleDelete = (brand: BrandDTO) => {
    setDialogConfig({
      title: "Confirm Deletion",
      description: `Are you sure you want to delete the brand ${brand.name}?`,
      options: {
        deleteText: "Delete",
        cancelText: "Cancel",
      },
      onConfirm: () => {
        dispatch(deleteBrandAsync(brand.id))
          .unwrap()
          .then(() => {})
          .catch((error) => {
            console.log(`Deletion failed: ${error}`);
          });
        setDialogOpen(false);
      },
    });
    setDialogOpen(true);
  };

  const handleRestore = (brand: BrandDTO) => {
    dispatch(restoreBrandAsync(brand.id))
      .unwrap()
      .then(() => {})
      .catch((error) => {
        console.log(`Restorovanje nije uspelo: ${error}`);
      });
  };
  const canViewMore = () => {
    return true;
  };

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
    );
  }

  if (status === "failed") {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>There are no brands available.</p>
      </div>
    );
  }

  return (
    <div className="brand-table">
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogConfig?.title || ""}
        description={dialogConfig?.description || ""}
        onConfirm={dialogConfig?.onConfirm ?? (() => {})}
        onCancel={() => setDialogOpen(false)}
        options={dialogConfig?.options ?? {}}
      />
      <GenericTable
        columns={columns}
        data={brands}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        name="brand"
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onDeleteClick={handleDelete}
        onRestoreClick={handleRestore}
        getRowClass={getRowClass}
        onViewMore={handleViewMore}
        onEdit={handleEdit}
        showPagination={true}
        canViewMore={canViewMore}
      />
    </div>
  );
};

export default BrandTable;
