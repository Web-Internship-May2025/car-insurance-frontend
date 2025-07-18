// 
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../styles/NewBrand.scss";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reducers";
import { createBrand } from "../../reducers/BrandsThunk";
import { toast } from "react-toastify";

interface FormValues {
  name: string;
  logoFile: File | null;
}

const validationSchema = Yup.object<FormValues>().shape({
  name: Yup.string()
    .required("Name is required")
    .min(1, "Must be at least 1 character")
    .max(100, "Must be at most 100 characters"),
  logoFile: Yup.mixed<File>()
    .required("Image is required")
    .test(
      "fileType",
      "Unsupported file format",
      (file) =>
        file != null &&
        ["image/jpeg", "image/png", "image/gif"].includes(file.type)
    ),
});

export default function NewBrandPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { createStatus, createError } = useAppSelector((s) => s.brands);

  const formik = useFormik<FormValues>({
    initialValues: { name: "", logoFile: null },
    validationSchema,
    onSubmit: async (values) => {
      if (!values.logoFile) return;
      const result = await dispatch(
        createBrand({ name: values.name, logoFile: values.logoFile })
      );
      if (createBrand.fulfilled.match(result)) {
        toast.success("Brand successfully created!", {
          position: "bottom-right",
        });
        navigate("/brands");
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    formik.setFieldValue("logoFile", file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleBack = () => navigate(-1);
  const handleCancel = () => formik.resetForm();

  return (
    <div className="page-wrapper">
      <div className="brand-form">
        <h2 className="title">Add New Brand</h2>

        <form className="form-body" onSubmit={formik.handleSubmit}>
          <div className="left-col">
            <div className="form-group">
              <label htmlFor="name">Brand Name</label>
              <input
                id="name"
                type="text"
                {...formik.getFieldProps("name")}
                className={
                  formik.touched.name && formik.errors.name ? "error" : ""
                }
              />
              {formik.touched.name && formik.errors.name && (
                <p className="error-message">{formik.errors.name}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="logoFile">Logo Image</label>
              <input
                id="logoFile"
                name="logoFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className={
                  formik.touched.logoFile && formik.errors.logoFile
                    ? "error"
                    : ""
                }
              />
              {formik.touched.logoFile && formik.errors.logoFile && (
                <p className="error-message">{formik.errors.logoFile}</p>
              )}
            </div>
          </div>

          <div className="right-col">
            <div className="preview-box">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" />
              ) : (
                <span>Image preview</span>
              )}
            </div>
          </div>
        </form>

        {createError && (
          <p className="response-message error">{createError}</p>
        )}

        <div className="button-group">
          <button
            type="button"
            className="btn-back"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={createStatus === "loading"}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-add"
            onClick={() => formik.handleSubmit()}
            disabled={createStatus === "loading"}
          >
            {createStatus === "loading" ? "Adding…" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}