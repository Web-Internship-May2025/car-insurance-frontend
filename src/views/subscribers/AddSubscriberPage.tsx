import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "../../reducers";
import { toast } from "react-toastify";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import { addSubscriberAsync } from "../../reducers/SubscribersThunk";
import { SelectField, type SelectOption } from "../../components/form/SelectField";
import type { SubscriberDTO } from "../../types/SubscriberDTO";
import "../../styles/AddSubscriberPage.scss";

const genderOptions: SelectOption[] = [
  { label: "-- select gender --", value: "" },
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];
const maritalOptions: SelectOption[] = [
  { label: "-- select marital status --", value: "" },
  { label: "Single", value: "SINGLE" },
  { label: "Taken", value: "TAKEN" },
  { label: "Divorced", value: "DIVORCED" },
  { label: "Widowed", value: "WIDOWED" },
  { label: "Other", value: "OTHER" },
];

type IFormInput = {
  firstName: string;
  lastName: string;
  jmbg: string;
  birthDate: Dayjs | null;
  gender: string;
  maritalStatus: string;
  email: string;
  username: string;
  password: string;
  userRoleType: string;
  subscriberRoleId: number;
};

type AddSubscriberPageProps = {
  onCreated?: () => void;
  onClose?: () => void;
};

const AddSubscriberPage: React.FC<AddSubscriberPageProps> = ({
  onCreated,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "onTouched",
    defaultValues: {
      birthDate: null,
      subscriberRoleId: 1,
      userRoleType: "SUBSCRIBER",
    },
  });

  const handleBack = () => {
    if (onClose) {
      onClose(); 
    }
  };

  const handleCancel = () => {
  reset();
};

  const onSubmit = async (data: IFormInput) => {
    const payload: SubscriberDTO = {
      firstName: data.firstName,
      lastName: data.lastName,
      jmbg: data.jmbg,
      birthDate: data.birthDate ? data.birthDate.toISOString() : "",
      gender: data.gender as any,
      maritalStatus: data.maritalStatus as any,
      email: data.email,
      username: data.username,
      password: data.password,
      userRoleType: data.userRoleType as any,
      subscriberRoleId: data.subscriberRoleId,
    };
    try {
      await dispatch(addSubscriberAsync(payload)).unwrap();
      toast.success("Subscriber created successfully.");
      reset();
      if (onCreated) onCreated();
    } catch (err: any) {
      toast.error("Failed to create subscriber: " + err);
    }
  };

  return (
    <>
      <h2 className="dialog-title">Add Subscriber</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="add-subscriber-form">
        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            {...register("firstName", { required: "This field is required" })}
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            type="text"
            {...register("lastName", { required: "This field is required" })}
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="jmbg">JMBG</label>
          <input
            id="jmbg"
            type="text"
            {...register("jmbg", { required: "This field is required" })}
          />
          {errors.jmbg && <p className="error-message">{errors.jmbg.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">Birth Date</label>
          <Controller
            name="birthDate"
            control={control}
            rules={{ required: "Birth date is required" }}
            render={({ field, fieldState }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...field}
                  label="Select date"
                  onChange={(val) => field.onChange(val)}
                  value={field.value || null}
                  slotProps={{
                    textField: {
                      id: "birthDate",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </div>

        <SelectField<IFormInput>
          name="gender"
          label="Gender"
          register={register}
          validation={{ required: "Please select your gender" }}
          options={genderOptions}
          error={errors.gender}
        />

        <SelectField<IFormInput>
          name="maritalStatus"
          label="Marital Status"
          register={register}
          validation={{ required: "Please select marital status" }}
          options={maritalOptions}
          error={errors.maritalStatus}
        />

        <div className="form-group">
          <label>User Role</label>
          <input
            type="text"
            value="Subscriber"
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 5, message: "Min 5 characters" },
            })}
          />
          {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              validate: {
                minLength: (v) =>
                  v.length >= 8 || "Password must be at least 8 characters",
                hasUpper: (v) =>
                  /[A-Z]/.test(v) || "Must include an uppercase letter",
                hasLower: (v) =>
                  /[a-z]/.test(v) || "Must include a lowercase letter",
                hasNumber: (v) => /\d/.test(v) || "Must include a digit",
                hasSpecialChar: (v) =>
                  /[@#$%^&+=!]/.test(v) || "Must include special char",
                noWhiteSpace: (v) => /^\S+$/.test(v) || "No spaces allowed",
              },
            })}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <input type="hidden" value="1" {...register("subscriberRoleId")} />
        <input type="hidden" value="SUBSCRIBER" {...register("userRoleType")} />

        <div className="button-container">
          <button className="back-button" type="button" onClick={handleBack}>
            Back
          </button>
           <button className="cancel-button" type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="add-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddSubscriberPage;