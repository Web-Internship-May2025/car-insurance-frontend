import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserByUsername } from "../../services/UsersApi";
import type { RootState, AppDispatch } from "../../reducers";
import { resetCountry } from "../../reducers/CountriesSlice";
import { ProtectedImage } from "../../components/ProtectedImage";
import "../../styles/ProfilePage.scss";
import { getDecodedToken } from "../../services/jwtService";
import { USER_SERVICE_IMAGES_URL } from "../../services/constants";
import DetailPageButtons from "../../components/DetailPageButtons";
import { toast } from "react-toastify";


export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = getDecodedToken();

  const [userInfo, setUserInfo] = useState<{
    firstName?: string;
    lastName?: string;
    userRoleType?: string;
    icon?: string;
  }>({});

  const handleEdit = () => {
    console.log("Edit clicked!!!");
    navigate(`/profile/${userInfo.userRoleType}`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.username) {
        console.warn("No username in token");
        return;
      }
      try {
        const response = await getUserByUsername(user.username);
        setUserInfo({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          userRoleType: response.data.userRoleType,
          icon: response.data.icon,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserData();
  }, [user?.username]);

  return (
    <div className="form-container">
      <h2 className="title">User Profile</h2>

      <div className="user-info">
        <p>
          <strong>First Name:</strong> {userInfo.firstName || "N/A"}
        </p>
        <p>
          <strong>Last Name:</strong> {userInfo.lastName || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {userInfo.userRoleType || "N/A"}
        </p>
      </div>
      <div>
        <ProtectedImage src={`${USER_SERVICE_IMAGES_URL}/${userInfo.icon}`} alt="User logo" width={150} />
      </div>

      <div className="buttons">
        <div className="tooltip-container">
          <button
            className="btn btn-back"
            type="button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <div className="tooltip-text">Back</div>
        </div>
        <div className="tooltip-container">
          <button
            className="btn btn-update"
            type="button"
            onClick={() => handleEdit()}
          >
            Edit
          </button>
          <div className="tooltip-text">Edit Profile</div>
        </div>
      </div>
    </div>
  );
}
