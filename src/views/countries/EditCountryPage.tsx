import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
//import "../../styles/EditCountry.scss";
import "../../styles/CountryDetail.scss";
import { useNavigate, useParams } from "react-router-dom";
import { resetCountry } from "../../reducers/CountriesSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../reducers";
import { toast} from "react-toastify";
import {
  deleteCountryAsync,
  findCountryById,
  restoreCountryAsync,
  updateCountry,
} from "../../reducers/CountriesThunk";
import { USER_SERVICE_IMAGES_URL } from "../../services/constants";
import { InputFileField } from "../../components/form/InputFileField";
import { ProtectedImage } from "../../components/ProtectedImage";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import DetailPageButtons from "../../components/DetailPageButtons";

type IFormInput = {
  name: string;
  abbreviation: string;
  icon: FileList;
};

export default function EditCountry() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedCountry, status, error } = useSelector(
    (state: RootState) => state.countries
  );

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

  const [currentIconUrl, setCurrentIconUrl] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "onTouched",
  });

  const watchedFiles = watch("icon");
  const newFile = watchedFiles?.[0] ?? null;

  const objectUrl = useMemo<string | null>(() => {
    if (!newFile) return null;
    return URL.createObjectURL(newFile);
  }, [newFile]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const previewUrl = objectUrl || currentIconUrl;

  useEffect(() => {
    if (id) {
      dispatch(findCountryById(id));
    }
    return () => {
      dispatch(resetCountry());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!selectedCountry) return;
    reset({
      name: selectedCountry.name,
      abbreviation: selectedCountry.abbreviation,
    });

    if (selectedCountry.icon) {
      setCurrentIconUrl(
        `${USER_SERVICE_IMAGES_URL}/country/${selectedCountry.icon}`
      );
    }
  }, [selectedCountry, reset]);

  const handleDelete = () => {
    if (!selectedCountry) return;
    setDialogConfig({
      title: "Confirm Deletion",
      description: `Are you sure you want to delete the country ${selectedCountry.name}?`,
      options: {
        deleteText: "Deactivate",
        cancelText: "Cancel",
      },
      onConfirm: () => {
        dispatch(deleteCountryAsync(selectedCountry.id))
          .unwrap()
          .then(() => {
            setDialogOpen(false);
            setSuccessMessage(
              `Country ${selectedCountry.name} has been successfully deleted.`
            );
            setSuccessDialogOpen(true);
            dispatch(findCountryById(selectedCountry.id.toString()));
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
    if (!selectedCountry) return;
    setDialogConfig({
      title: "Confirm Restoration",
      description: `Are you sure you want to restore the country ${selectedCountry.name}?`,
      options: {
        restoreText: "Restore",
        cancelText: "Cancel",
      },
      onConfirm: () => {
        dispatch(restoreCountryAsync(selectedCountry.id))
          .unwrap()
          .then(() => {
            setDialogOpen(false);
            setSuccessMessage(
              `Country ${selectedCountry.name} has been successfully restored.`
            );
            setSuccessDialogOpen(true);
            dispatch(findCountryById(selectedCountry.id.toString()));
          })
          .catch(() => {
            setDialogOpen(false);
            alert("Error occurred while deleting the country.");
          });
      },
    });
    setDialogOpen(true);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const countryDTO = {
      id,
      name: data.name,
      abbreviation: data.abbreviation,
      createdAt: "01-01-2024 11:00",
      updatedAt: "01-01-2024 11:00",
      icon: "",
      isDeleted: false,
    };

    const blob = new Blob([JSON.stringify(countryDTO)], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("country", blob);

    if (data.icon && data.icon[0]) {
      const file = data.icon[0];
      formData.append("image", file, file.name);
    }

    try {
      await dispatch(updateCountry({ id: id!, formData }))
        .unwrap()
        .then(() => {
          toast.success("Country updated successfully!");
          navigate("/countries");
        });
    } catch (err: any) {
      const msg =
        typeof err === "string"
          ? err
          : err?.message || "Could not update country";

      toast.error(msg);
    }
  };

  if (status === "loading") return <p>Loading…</p>;
  if (status === "failed") return <p className="error">{error}</p>;

  return (
    <div className="form-container">
      {/* ConfirmationDialog za potvrde */}
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogConfig?.title || ""}
        description={dialogConfig?.description || ""}
        onConfirm={dialogConfig?.onConfirm ?? (() => {})}
        onCancel={() => setDialogOpen(false)}
        options={dialogConfig?.options ?? {}}/>

      

      {/* ConfirmationDialog za uspešne poruke */}
      <ConfirmationDialog
        open={successDialogOpen}
        title="Successfully!"
        description={successMessage}
        onConfirm={() => setSuccessDialogOpen(false)}
        onCancel={() => setSuccessDialogOpen(false)}
        options={{ cancelText: "Close" }}
      />

      <h2 className="title">Update country information</h2>
      <div className="view-container">
        <div className="view-container-child">
          <form className="detail-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="name">Country name</label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="abbreviation">Abbreviation</label>
              <input
                id="abbreviation"
                type="text"
                {...register("abbreviation", {
                  required: "Abbreviation is required",
                  maxLength: {
                    value: 3,
                    message: "Max 3 letters",
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "Letters only",
                  },
                })}
              />
              {errors.abbreviation && (
                <p className="error-message">{errors.abbreviation.message}</p>
              )}
            </div>

            <InputFileField<IFormInput>
              name="icon"
              control={control}
              label="Logo (choose file)"
              accept="image/*"
            />
          </form>
        </div>
        {previewUrl && (
          <div>
            <ProtectedImage src={previewUrl} alt="Logo Preview" width={250} />
          </div>
        )}
      </div>
      <DetailPageButtons
        isDeleted={!!selectedCountry?.isDeleted}
        handleUpdate={handleSubmit(onSubmit)}
        handleDeactivate={handleDelete}
        handleRestore={handleRestore}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
