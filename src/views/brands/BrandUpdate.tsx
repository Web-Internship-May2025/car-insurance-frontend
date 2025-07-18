import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../../reducers";
import type { BrandDTO } from "../../types/CarServiceTypes";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "../../styles/BrandUpdate.scss";
import { editBrandAsync, getBrandByIdAsync } from "../../reducers/BrandsThunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { CAR_SERVICE_IMAGES_URL } from "../../services/constants";
import { ProtectedImage } from "../../components/ProtectedImage";

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").max(30, "Too Long!"),
});

export default function BrandUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [brand, setBrand] = useState<BrandDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpdate = (brand: BrandDTO) => {
    setDialogConfig({
      title: "Confirm Update",
      description: `Are you sure you want to update the brand ${brand.name}?`,
      options: {
        deleteText: "Update",
        cancelText: "Cancel",
      },
      onConfirm: () => {
        const formData = new FormData();
        formData.append("name", brand.name !== "" ? brand.name : brand.name);
        formData.append("logoImage", selectedFile || brand.logoImage);
        dispatch(editBrandAsync({ id: brand.id, data: formData }))
          .unwrap()
          .then(() => {})
          .catch((error) => {
            console.log(`Update failed: ${error}`);
          });
        setDialogOpen(false);
        navigate("/brands");
      },
    });
    setDialogOpen(true);
  };

  useEffect(() => {
    if (!id) {
      setError("ID not found");
      setLoading(false);
      return;
    }

    const fetchBrand = async () => {
      try {
        const response = await dispatch(getBrandByIdAsync(id)).unwrap();
        setBrand(response);
      } catch (err) {
        setError("Loading error");
      } finally {
        setLoading(false);
        setIsSubmitting(false);
      }
    };

    fetchBrand();
  }, [id, dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!brand) return <p>Brand not found.</p>;

  return (
    <div className="brand-update-container">
      <h1 className="brand-update-title">Update Brand</h1>
      <Formik
        initialValues={brand}
        onSubmit={handleUpdate}
        validationSchema={SignupSchema}
      >
        {({ errors, touched }) => (
          <Form>
            {isSubmitting && (
              <div className="d-flex justify-content-center my-3">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="name">Brand Name</label>
              <Field
                name="name"
                id="name"
                placeholder={brand?.name ?? "Brand Name"}
              />
              {errors.name && touched.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="logoImage">Logo Image</label>
              <input
                name="logoImage"
                id="logoImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div>
              <ProtectedImage
                src={`${CAR_SERVICE_IMAGES_URL}/${brand.logoImage}`}
                alt="User logo"
                width={150}
              />
            </div>
            <button
              type="submit"
              className="btn-update"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </Form>
        )}
      </Formik>
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogConfig?.title || ""}
        description={dialogConfig?.description || ""}
        onConfirm={dialogConfig?.onConfirm ?? (() => {})}
        onCancel={() => setDialogOpen(false)}
        options={dialogConfig?.options ?? {}}
      />
    </div>
  );
}
