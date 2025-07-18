import React, { useState } from "react";
import { setCurrentPage, setPageSize } from "../../reducers/CountriesSlice.ts";

import { useNavigate } from "react-router-dom";
import type { CountryType } from "../../types/UserServiceTypes.ts";
import type { Column } from "../../components/Table.tsx";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../reducers/index.ts";
import { fetchCountriesPageAsync } from "../../reducers/CountriesThunk.ts";
import {
  deleteCountryAsync,
  restoreCountryAsync,
} from "../../reducers/CountriesThunk.ts";
import ConfirmationDialog from "../../components/ConfirmationDialog.tsx";
import GenericTable from "../../components/Table.tsx";
import { ProtectedImage } from "../../components/ProtectedImage.tsx";

export const USER_SERVICE_IMAGES_URL =
  import.meta.env.VITE_USER_SERVICE_IMAGES_URL ||
  "http://localhost:8080/users/images";

const parseCustomDateString = (dateStr: string): Date => {
  const [datePart, timePart] = dateStr.split(" ");
  if (!datePart || !timePart) return new Date(NaN);

  const [day, month, year] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  if (!day || !month || !year || hours === undefined || minutes === undefined) {
    return new Date(NaN);
  }

  return new Date(year, month - 1, day, hours, minutes);
};

const columns: Column<CountryType>[] = [
  { header: "ID", field: "id", width: 50 },
  {
    header: "Creation Date",
    field: "createdAt",
    render: (val: string | number | Date) => {
      let date;
      if (typeof val === "string") {
        date = parseCustomDateString(val);
      } else {
        date = new Date(val);
      }
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleString();
    },
    width: 150,
  },
  {
    header: "Updated Date",
    field: "updatedAt",
    render: (val: string | number | Date) => {
      let date;
      if (typeof val === "string") {
        date = parseCustomDateString(val);
      } else {
        date = new Date(val);
      }
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleString();
    },
    width: 150,
  },
  { header: "Name", field: "name", editable: true },
  {
    header: "Abbreviation",
    field: "abbreviation",
  },
  {
    header: "Icon",
    field: "icon",
    render: (val: string) => (
      <ProtectedImage
        src={`${USER_SERVICE_IMAGES_URL}/country/${val}`}
        alt="logo"
        width={50}
      />
    ),
  },
  {
    header: "Active",
    field: "isDeleted",
    render: (val: any) => (val ? "No" : "Yes"),
    editable: true,
    width: 60,
  },
];

const CountriesTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { countries, totalItems, totalPages, currentPage, pageSize, status } =
    useSelector((state: RootState) => state.countries);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
    options: {
      confirmText?: string;
      cancelText?: string;
      restoreText?: string;
      deleteText?: string;
    };
  } | null>(null);

  console.log(countries);
  React.useEffect(() => {
    dispatch(fetchCountriesPageAsync({ page: currentPage, size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(0));
  };

  const handleViewMore = (country: CountryType) => {
    navigate(`/countries/${country.id}`);
  };

  const handleEdit = (country: CountryType) => {
    navigate(`/countries/edit/${country.id}`);
  };

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
    );
  }
  if (status === "failed") {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>There are no countries available.</p>
      </div>
    );
  }
  const getRowClass = (country: CountryType) => {
    return country.isDeleted ? "deleted-row" : "";
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogConfig(null);
  };
  const openConfirmation = (
    title: string,
    description: string,
    onConfirm: () => void,
    options: {
      confirmText?: string;
      cancelText?: string;
      restoreText?: string;
      deleteText?: string;
    } = {}
  ) => {
    setDialogConfig({ title, description, onConfirm, options });
    setDialogOpen(true);
  };

  const handleDelete = (country: CountryType) => {
    openConfirmation(
      "Confirm Deletion",
      `Are you sure you want to delete the country ${country.name}?`,
      () => {
        dispatch(deleteCountryAsync(country.id))
          .unwrap()
          .then(() => {
            dispatch(
              fetchCountriesPageAsync({ page: currentPage, size: pageSize })
            );
            handleCloseDialog();
          })
          .catch((error: any) => {
            console.log(`Deletion failed: ${error}`);
            handleCloseDialog();
          });
      },
      {
        deleteText: "Delete",
        cancelText: "Cancel",
      }
    );
  };

  const handleRestore = (country: CountryType) => {
    openConfirmation(
      "Confirm Restoration",
      `Are you sure you want to restore the country ${country.name}?`,
      () => {
        dispatch(restoreCountryAsync(country.id))
          .unwrap()
          .then(() => {
            dispatch(
              fetchCountriesPageAsync({ page: currentPage, size: pageSize })
            );
            handleCloseDialog();
          })
          .catch((error: any) => {
            console.log(`Restoration failed: ${error}`);
            handleCloseDialog();
          });
      },
      {
        restoreText: "Restore",
        cancelText: "Cancel",
      }
    );
  };

  //zbog azurirane genericke tabele
  const canViewMore = () => {
    return true;
  };

  return (
    <>
      {/* Prikaži dialog samo ako je open */}
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogConfig?.title || ""}
        description={dialogConfig?.description || ""}
        onConfirm={dialogConfig?.onConfirm ?? handleCloseDialog}
        onCancel={handleCloseDialog}
        options={dialogConfig?.options ?? {}}
      />
      <GenericTable
        columns={columns}
        data={countries}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        showPagination={true}
        onEdit={handleEdit}
        onViewMore={handleViewMore}
        onDeleteClick={handleDelete}
        onRestoreClick={handleRestore}
        getRowClass={getRowClass}
        canViewMore={canViewMore}
        name={""}
      />
    </>
  );
};

export default CountriesTable;
