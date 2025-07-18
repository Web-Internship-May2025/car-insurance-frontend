import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_API_URL } from "../../services/brandService";
import "../../styles/BrandDetail.scss";
import DetailPageButtons from "../../components/DetailPageButtons";
import { ProtectedImage } from "../../components/ProtectedImage";
import {
  deleteBrandAsync,
  getBrandByIdAsync,
  restoreBrandAsync,
} from "../../reducers/BrandsThunk";
import { useAppDispatch } from "../../reducers";
import type { RootState } from "../../reducers";
import { useSelector } from "react-redux";
import { ShieldCheck, ShieldMinus } from "lucide-react";
import ConfirmationDialog from "../../components/ConfirmationDialog";

// TODO use react redux
export default function BrandDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    selectedBrand: brand,
    status,
    error,
  } = useSelector((state: RootState) => state.brands);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    options: {
      confirmText?: string;
      cancelText?: string;
      restoreText?: string;
      deleteText?: string;
    };
    onConfirm: () => void;
  } | null>(null);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getBrandByIdAsync(id));
    }
  }, [id, dispatch]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return <p className="error">{error}</p>;
  }

  if (!brand) {
    return <p>Brand not found.</p>;
  }

  const handleUpdate = () => {
    navigate(`/brands/edit/${id}`);
  };
  const handleDelete = () => {
    if (!brand) return;
    setDialogConfig({
      title: "Confirm Deletion",
      description: `Are you sure you want to delete the brand ${brand.name}?`,
      options: {
        deleteText: "Deactivate",
        cancelText: "Cancel",
      },
      onConfirm: () => {
        dispatch(deleteBrandAsync(brand.id))
          .unwrap()
          .then(() => {
            setDialogOpen(false);
            setSuccessMessage(
              `Brand ${brand.name} has been successfully deleted.`
            );
            setSuccessDialogOpen(true);
            dispatch(getBrandByIdAsync(brand.id.toString()));
          })
          .catch(() => {
            setDialogOpen(false);
            alert("Error occurred while deleting the brand.");
          });
      },
    });
    setDialogOpen(true);
  };

  const handleRestore = () => {
    if (!brand) return;
    setDialogConfig({
      title: "Confirm Restoration",
      description: `Are you sure you want to restore the brand ${brand.name}?`,
      options: {
        restoreText: "Restore",
        cancelText: "Cancel",
      },
      onConfirm: () => {
        dispatch(restoreBrandAsync(brand.id))
          .unwrap()
          .then(() => {
            setDialogOpen(false);
            setSuccessMessage(
              `Brand ${brand.name} has been successfully restored.`
            );
            setSuccessDialogOpen(true);
            dispatch(getBrandByIdAsync(brand.id.toString()));
          })
          .catch(() => {
            setDialogOpen(false);
            alert("Error occurred while deleting the brand.");
          });
      },
    });
    setDialogOpen(true);
  };

  if (!brand) return <p>Brand not found</p>;

  return (
    <div className="form-container">
      {/* ConfirmationDialog za potvrde */}
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogConfig?.title || ""}
        description={dialogConfig?.description || ""}
        onConfirm={dialogConfig?.onConfirm ?? (() => {})}
        onCancel={() => setDialogOpen(false)}
        options={dialogConfig?.options ?? {}}
      />

      {/* ConfirmationDialog za uspešne poruke */}
      <ConfirmationDialog
        open={successDialogOpen}
        title="Successfully!"
        description={successMessage}
        onConfirm={() => setSuccessDialogOpen(false)}
        onCancel={() => setSuccessDialogOpen(false)}
        options={{ cancelText: "Close" }}
      />

      <h2 className="title">Brand details</h2>
      <div className="view-container">
        <div className="view-container-child">
          <p>
            <strong>Name:</strong> {brand.name}
          </p>
          <p>
            <strong>Creation date:</strong> {brand.creationDate}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {brand.isDeleted ? (
              <>
                <ShieldMinus size={32} color="#ff0000" />{" "}
                <span>DEACTIVATED</span>
              </>
            ) : (
              <>
                <ShieldCheck size={32} color="#008000" /> <span>ACTIVE</span>
              </>
            )}
          </p>
          <p>
            <strong>Models:</strong> {(brand.models ?? []).map(m => m.name).join(", ")}
          </p>
        </div>
        <div>
          <ProtectedImage
            className="image-detail"
            src={`${BASE_API_URL}/cars/images/${brand.logoImage}`}
            alt={brand.name}
            style={{ maxWidth: "300px", height: "auto" }}
          />
        </div>
      </div>
      <DetailPageButtons
        isDeleted={brand.isDeleted}
        handleDeactivate={handleDelete}
        handleRestore={handleRestore}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}
