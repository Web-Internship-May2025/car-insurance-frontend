import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../reducers";
import { addCountry } from "../../reducers/CountriesThunk";
import "../../styles/AddCountryPage.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";

interface FormValues {
  name: string;
  abbreviation: string;
  imageFile: File | null;
}
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(1, "Name must be at least 1 character")
    .max(100, "Name must be at most 100 characters"),
  abbreviation: Yup.string()
    .required("Abbreviation is required")
    .min(1, "Abbreviation must be at least 1 character")
    .max(3, "Abbreviation must be at most 3 characters")
    .matches(/^[A-Z]+$/, "Abbreviation must contain only uppercase letters"),
  imageFile: Yup.mixed()
    .required("Image is required")
    .test("fileType", "Unsupported File Format", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/gif"].includes((value as File).type)
      );
    }),
});

export default function AddCountryPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.countries);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0];
      formik.setFieldValue("imageFile", file);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      formik.setFieldValue("imageFile", null);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      abbreviation: "",
      imageFile: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.imageFile) {
        const resultAction = await dispatch(
          addCountry({
            name: values.name,
            abbreviation: values.abbreviation,
            imageFile: values.imageFile,
          })
        );

        if (addCountry.fulfilled.match(resultAction)) {
          toast.success("Country successfully added!", {
            position: "bottom-right",
          });
          navigate("/countries");
        }
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix validation errors before adding the country.", {
        position: "bottom-right",
      });
      formik.setTouched({
        name: true,
        abbreviation: true,
        imageFile: true,
      });
      return;
    }

    formik.handleSubmit(e);
  };
  const handleCancel = () => {
    formik.resetForm();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    navigate("/countries");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <div className="header">
          <h2>Add country</h2>
        </div>
        <div className="input-form-container">
          <div className="input-form">
            <label htmlFor="name">Name:</label>
            <input
              className="label"
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name ? (
              <div style={{ color: "red" }}>{formik.errors.name}</div>
            ) : null}

            <div>
              <label htmlFor="abbreviation">Abbreviation:</label>
              <input
                className="label"
                id="abbreviation"
                name="abbreviation"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.abbreviation}
                onBlur={formik.handleBlur}
              />
              {formik.touched.abbreviation && formik.errors.abbreviation ? (
                <div style={{ color: "red" }}>{formik.errors.abbreviation}</div>
              ) : null}
            </div>

            <label htmlFor="imageFile">Icon (Photo):</label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif"
              onBlur={formik.handleBlur}
              ref={fileInputRef}
            />
          </div>

          <div className="image-preview">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" />
            ) : (
              <span>Image preview</span>
            )}
          </div>
        </div>

        {formik.errors.imageFile ? (
          <div style={{ color: "red" }}>{formik.errors.imageFile}</div>
        ) : null}
        <div className="button-container">
          <button className="back-button" type="button" onClick={handleBack}>
            Back
          </button>
          <button
            className="cancel-button"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="add-button"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Saving..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
