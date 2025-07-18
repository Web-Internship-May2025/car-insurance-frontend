import {
  type FieldError,
  type FieldValues,
  type RegisterOptions,
  type UseFormRegister,
  type Path,
} from "react-hook-form";

export type SelectOption = {
  label: string;
  value: string;
};

//Koristi se za odabir jedne od vise opcija (uglavnom za popunjavanje enum polja) u formama

export interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  validation?: RegisterOptions<T, Path<T>>;
  options: SelectOption[];
  error?: FieldError;
  className?: string;
  id?: string;
}

export function SelectField<T extends FieldValues>({
  name,
  label,
  register,
  validation,
  options,
  error,
  className = "",
  id,
}: SelectFieldProps<T>) {
  const fieldId = id ?? name;
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={fieldId}>{label}</label>
      <select id={fieldId} {...register(name, validation)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="error-message">{error.message}</p>}
    </div>
  );
}
