import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { useAppDispatch } from "../../reducers";
import { useNavigate } from "react-router-dom";
import { loginUserAsync } from "../../reducers/AuthThunk";

import "../../styles/LoginPage.scss";
import "../../styles/FormContainer.scss";
type IFormInput = {
  username: string;
  password: string;
};
export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "onTouched",
  });
  const onSubmit = async (data: IFormInput) => {
    dispatch(loginUserAsync(data))
      .unwrap()
      .then((payload) => {
        toast.success("Login successful!");
        localStorage.setItem("jwtToken", payload.accessToken);
        localStorage.setItem("refreshToken", payload.refreshToken);
        reset();
        navigate("/home");
      })
      .catch(() => {
        toast.error("Login failed!", { autoClose: 3000 });
      });
  };
  return (
    <div className="form-container">
      <h2 className="title">Login</h2>

      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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
            })}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="btn-orange">
          {isSubmitting ? <Loader className="btn-loader" size={20} /> : "Login"}
        </button>
      </form>
    </div>
  );
}
