import { useNavigate } from "react-router-dom";
import "../styles/DetailPageButtons.scss";

interface ButtonsProps {
  isDeleted: boolean;
  handleUpdate: () => void;
  handleDeactivate: () => void;
  handleRestore: () => void;
}

const DetailPageButtons: React.FC<ButtonsProps> = ({
  isDeleted,
  handleUpdate,
  handleDeactivate,
  handleRestore,
}) => {
  const navigate = useNavigate();
  return (
    <div className="buttons">
      <button className="btn btn-back" type="button" onClick={() => navigate(-1)}>
        Back
      </button>
      <button className="btn btn-update" type="button" onClick={() => handleUpdate()}>
        Update
      </button>
      {isDeleted ? (
        <button className="btn btn-restore" type="button" onClick={() => handleRestore()}>
          Restore
        </button>
      ) : (
        <button className="btn btn-delete" type="button" onClick={() => handleDeactivate()}>
          Deactivate
        </button>
      )}
    </div>
  );
};
export default DetailPageButtons;
