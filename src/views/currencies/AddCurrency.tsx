import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { ProtectedImage } from "../../components/ProtectedImage";
import { useNavigate } from "react-router-dom";
import "../../styles/AddCurrency.scss";

interface CurrencyDto {
  id?: number;
  name: string;
  code: string;
  logo: string;
  creationDate?: string;
  lastUpdateDate?: string;
  isDeleted?: boolean;
  isValid?: boolean;
}

const initialCurrency: CurrencyDto = {
  name: "",
  code: "",
  logo: "",
  isDeleted: false,
  isValid: true,
};

const AddCurrency: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CurrencyDto>({
    defaultValues: initialCurrency,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSubmit = async (data: CurrencyDto) => {
    setMessage(null);

    if (!selectedFile) {
      toast.error("Logo field is empty!");
      return;
    }

    setLoading(true);

    const nowISO = new Date().toISOString();
    const currencyPayload = {
      ...data,
      creationDate: nowISO,
      lastUpdateDate: nowISO,
    };

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
      toast.error("User is not authenticated");
      setLoading(false);
      return;
    }
      const formData = new FormData();
      const currencyBlob = new Blob([JSON.stringify(currencyPayload)], {
        type: "application/json",
      });
      formData.append("currency", currencyBlob);
      formData.append("image", selectedFile);

      const response = await fetch(
        "http://localhost:8080/payments/currencies",
        {
          method: "POST",
          headers: {
          Authorization: `Bearer ${token}`,
        },
          body: formData,
        }
      );

      if (response.ok) {
        navigate("/currencies");
        toast.success("Currency successfully added");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setPreviewUrl(null);
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
        toast.error(`Error: ${errorText}`);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      setMessage(`Error: ${errMsg}`);
      toast.error(`Error: ${errMsg}`);
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="form-container"
      noValidate
    >
      <h2 className="title">Add Currency</h2>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          {...register("name", { required: "Polje 'Ime' je obavezno" })}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>
      <div className="form-group">
        <label>Code:</label>
        <input
          type="text"
          {...register("code", { required: "Polje 'Kod' je obavezno" })}
          aria-invalid={errors.code ? "true" : "false"}
        />
        {errors.code && <p className="error-message">{errors.code.message}</p>}
      </div>
      <div className="file-group">
        <label htmlFor="fileInput">Logo:</label>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setSelectedFile(e.target.files[0]);
            }
          }}
          ref={fileInputRef}
        />
        <div className="preview-container">
          {previewUrl ? (
            <ProtectedImage src={previewUrl} alt="Preview" />
          ) : (
            <span>Preview</span>
          )}
        </div>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Add currency"}
      </button>
      {message && (
        <p
          className={`response-message ${message.startsWith("Error") ? "error" : "success"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default AddCurrency;
