import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserByUsername } from "../../services/UsersApi";
import { toast } from "react-toastify";
import { getDecodedToken } from "../../services/jwtService";
import { USER_SERVICE_IMAGES_URL } from "../../services/constants";
import { ProtectedImage } from "../../components/ProtectedImage";
import "../../styles/EditProfile.scss";

type IFormInput = {
  firstName: string;
  lastName: string;
  icon: FileList;
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userToken = getDecodedToken();
  const username = userToken?.username;

  const [initialData, setInitialData] = useState<{
    firstName?: string;
    lastName?: string;
    icon?: string;
  }>({});
  const [currentIconUrl, setCurrentIconUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
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
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const previewUrl = objectUrl || currentIconUrl;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      try {
        const response = await getUserByUsername(username);
        setInitialData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          icon: response.data.icon,
        });
        if (response.data.icon) {
          setCurrentIconUrl(
            `${USER_SERVICE_IMAGES_URL}/user/${response.data.icon}`
          );
        }
        // prefill form
        reset({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, [username, reset]);

  const onSubmit = async () => {
    console.log("Update clicked")
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
        {/* First Name */}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            {...register("firstName", { required: "First name is required" })}
            placeholder="First Name"
          />
          {errors.firstName && (
            <p className="error">{errors.firstName.message}</p>
          )}
        </div>
        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Last Name"
          />
          {errors.lastName && (
            <p className="error">{errors.lastName.message}</p>
          )}
        </div>
        {/* Profile Icon Upload */}
        <div className="form-group">
          <label>Profile Icon</label>
          <input
            type="file"
            accept="image/*"
            {...register("icon")}
            className="file-input"
          />
        </div>
        {/* Preview Image */}
        {previewUrl && (
          <div className="image-preview">
            <ProtectedImage
              src={previewUrl}
              alt="Profile Preview"
              width={150}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="buttons">
          <button
            className="btn btn-back"
            type="button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            className="btn btn-update"
            type="submit"
            disabled={isSubmitting}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
