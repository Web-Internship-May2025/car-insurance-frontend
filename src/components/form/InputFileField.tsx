import { useMemo } from "react";
import {
  useController,
  type Control,
  type FieldValues,
  type RegisterOptions,
  type Path,
} from "react-hook-form";

export interface InputFileFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  accept?: string;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  showPreview?: boolean;
  getPreviewUrl?: (file: File) => string;
}
/**
 * Genericko input polje za fajlove
 */
export function InputFileField<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  accept = "image/*",
  rules,
  showPreview = false,
  getPreviewUrl,
}: InputFileFieldProps<TFieldValues>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController<TFieldValues>({
    name,
    control,
    rules,
  });

  const files = value as unknown as FileList | undefined;
  const file = files?.[0];

  const preview = useMemo<string | null>(() => {
    if (!showPreview || !file) return null;
    return getPreviewUrl ? getPreviewUrl(file) : URL.createObjectURL(file);
  }, [file, showPreview, getPreviewUrl]);

  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}

      <input
        id={name}
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files)}
        onBlur={onBlur}
        ref={ref}
      />

      {error && <p className="error-message">{error.message?.toString()}</p>}

      {preview && (
        <div style={{ marginTop: 8 }}>
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: 300, maxHeight: 200 }}
          />
        </div>
      )}
    </div>
  );
}
