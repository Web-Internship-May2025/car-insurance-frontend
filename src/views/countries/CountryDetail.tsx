import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/CountryDetail.scss";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../reducers";
import {
  deleteCountryAsync,
  findCountryById,
  restoreCountryAsync,
} from "../../reducers/CountriesThunk";
import { resetCountry } from "../../reducers/CountriesSlice";
import DetailPageButtons from "../../components/DetailPageButtons";
import { USER_SERVICE_IMAGES_URL } from "../../services/constants";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { ProtectedImage } from "../../components/ProtectedImage";
import { ShieldCheck, ShieldMinus } from "lucide-react";

export default function CountryDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    selectedCountry: country,
    status,
    error,
  } = useSelector((state: RootState) => state.countries);
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
      dispatch(findCountryById(id));
    } else {
    }
    return () => {
      dispatch(resetCountry());
    };
  }, [id, dispatch]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return <p className="error">{error}</p>;
  }

  if (!country) {
    return <p>Country not found.</p>;
  }
  const handleDelete = () => {
    if (!country) return;
    setDialogConfig({
      title: "Confirm Deletion",
      description: `Are you sure you want to delete the country ${country.name}?`,
      options: {
        deleteText: "Deactivate",
        cancelText: "Cancel",
      },
      onConfirm: () => {
        dispatch(deleteCountryAsync(country.id))
          .unwrap()
          .then(() => {
            setDialogOpen(false);
            setSuccessMessage(
              `Country ${country.name} has been successfully deleted.`
            );
            setSuccessDialogOpen(true);
            dispatch(findCountryById(country.id.toString()));
          })
          .catch(() => {
            setDialogOpen(false);
            alert("Error occurred while deleting the country.");
          });
      },
    });
    setDialogOpen(true);
  };

  const handleRestore = () => {
    if (!country) return;
    setDialogConfig({
      title: "Confirm Restoration",
      description: `Are you sure you want to restore the country ${country.name}?`,
      options: {
        restoreText: "Restore",
        cancelText: "Cancel",
      },
      onConfirm: () => {
        dispatch(restoreCountryAsync(country.id))
          .unwrap()
          .then(() => {
            setDialogOpen(false);
            setSuccessMessage(
              `Country ${country.name} has been successfully restored.`
            );
            setSuccessDialogOpen(true);
            dispatch(findCountryById(country.id.toString()));
          })
          .catch(() => {
            setDialogOpen(false);
            alert("Error occurred while deleting the country.");
          });
      },
    });
    setDialogOpen(true);
  };

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
      <h2 className="title">Country details</h2>
      <div className="view-container">
        <div className="view-container-child">
          <p>
            <strong>Name:</strong> {country.name}
          </p>
          <p>
            <strong>Creation date:</strong> {country.createdAt}
          </p>
          <p>
            <strong>Status:</strong> {country.isDeleted ? <><ShieldMinus size={32} color="#ff0000"/> <span>DEACTIVATED</span></> : <><ShieldCheck size={32} color="#008000"/> <span>ACTIVE</span></>}
          </p>
        </div>
        <div>
          <ProtectedImage
            className="image-detail"
            src={`${USER_SERVICE_IMAGES_URL}/country/${country.icon}`}
            alt={country.name}
          />
        </div>
      </div>

      <DetailPageButtons
        isDeleted={country.isDeleted}
        handleDeactivate={handleDelete}
        handleRestore={handleRestore}
        handleUpdate={() => {
          navigate(`/countries/edit/${country.id}`);
        }}
      />
    </div>
  );
}
