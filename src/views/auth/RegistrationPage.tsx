import { toast } from "react-toastify";

import { useForm, Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import type { UserRegistration } from "../../types/UserServiceTypes";
import {
  SelectField,
  type SelectOption,
} from "../../components/form/SelectField";
import { useAppDispatch } from "../../reducers";
import { useNavigate } from "react-router-dom";
import { registerUserAsync } from "../../reducers/AuthThunk";

import "../../styles/RegistrationPage.scss";

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
};
const genderOptions: SelectOption[] = [
  { label: "-- select gender --", value: "" },
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

const maritalOptions: SelectOption[] = [
  { label: "-- select status --", value: "" },
  { label: "Single", value: "SINGLE" },
  { label: "Taken", value: "TAKEN" },
  { label: "Divorced", value: "DIVORCED" },
  { label: "Widowed", value: "WIDOWED" },
  { label: "Other", value: "OTHER" },
];

const roleOptions: SelectOption[] = [
  { label: "-- choose role --", value: "" },
  { label: "Subscriber", value: "SUBSCRIBER" },
  { label: "Driver", value: "DRIVER" },
  { label: "Manager", value: "MANAGER" },
  { label: "Claims Adjuster", value: "CLAIMS_ADJUSTER" },
  { label: "Sales Agent", value: "SALES_AGENT" },
  {
    label: "Customer Service Representative",
    value: "CUSTOMER_SERVICE_REPRESENTATIVE",
  },
  { label: "Administrator", value: "ADMINISTRATOR" },
  { label: "Claim Handler", value: "CLAIM_HANDLER" },
];

export default function RegistrationPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    },
  });

  const onSubmit = async (data: IFormInput) => {
    const payload: UserRegistration = {
      firstName: data.firstName,
      lastName: data.lastName,
      jmbg: data.jmbg,
      birthDate: data.birthDate ? (data.birthDate as Dayjs).toISOString() : "",
      gender: data.gender as any,
      maritalStatus: data.maritalStatus as any,
      email: data.email,
      username: data.username,
      password: data.password,
      userRoleType: data.userRoleType as any,
      isDeleted: false,
      isEnabled: true,
      isActive: true,
    };
    dispatch(registerUserAsync(payload))
      .unwrap()
      .then((message) => {
        toast.success("Registered! " + message);
        reset();
        navigate("/login");
      })
      .catch((errMsg: string) => {
        toast.error("Registration failed " + errMsg);
      });
  };

  return (
    <div className="form-container">
      <h2 className="title">Register</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            {...register("firstName", {
              required: "This field is required",
            })}
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
            {...register("lastName", {
              required: "This field is required",
            })}
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
            {...register("jmbg", {
              required: "This field is required",
            })}
          />
          {errors.jmbg && (
            <p className="error-message">{errors.jmbg.message}</p>
          )}
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

        <SelectField<IFormInput>
          name="userRoleType"
          label="User Role"
          register={register}
          validation={{ required: "Please select a user role" }}
          options={roleOptions}
          error={errors.userRoleType}
        />

        <div className="form-group">
          <label htmlFor="jmbg">Email</label>
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
              minLength: {
                value: 5,
                message: "Min 5 characters",
              },
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
                  /[A-Z]/.test(v) ||
                  "Password must include at least one uppercase letter",
                hasLower: (v) =>
                  /[a-z]/.test(v) ||
                  "Password must include at least one lowercase letter",
                hasNumber: (v) =>
                  /\d/.test(v) || "Password must include at least one digit",
                hasSpecialChar: (v) =>
                  /[@#$%^&+=!]/.test(v) ||
                  "Password must include at least one special character (@ # $ % ^ & + = ! etc.)",
                noWhiteSpace: (v) =>
                  /^\S+$/.test(v) || "Password cannot contain spaces",
              },
            })}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="btn-orange" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Register"}
        </button>
      </form>
    </div>
  );
}
