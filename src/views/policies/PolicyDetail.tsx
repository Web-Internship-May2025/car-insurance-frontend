import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../reducers";
import { useSelector } from "react-redux";
import type { RootState } from "../../reducers";
import {
  getPolicyByIdAsync,
  deletePolicyAsync,
  restorePolicyAsync,
} from "../../reducers/PoliciesThunk";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import "../../styles/PolicyDetail.scss";
import DetailPageButtons from "../../components/DetailPageButtons";
import { ShieldCheck, ShieldMinus } from "lucide-react";
import { getCarById } from "../../services/CarApi";
import type { CarDTO } from "../../types/CarServiceTypes";
import { ProtectedImage } from "../../components/ProtectedImage.tsx";
import "../../styles/PolicyDetail.scss";

const IMAGE_BASE_URL = "http://localhost:8080/cars/images";

export default function PolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    selectedPolicy: policy,
    status,
    error,
  } = useSelector((state: RootState) => state.policies);

  const [car, setCar] = useState<CarDTO | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    description: string;
    options: {
      confirmText?: string;
      cancelText?: string;
      restoreText?: string;
      deleteText?: string;
    };
    onConfirm: () => void;
  } | null>(null);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getPolicyByIdAsync(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (policy && policy.carId) {
      getCarById(Number(policy.carId))
        .then(response => setCar(response.data))
        .catch(() => setCar(null));
    }
  }, [policy]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return <p className="error">{error}</p>;
  }

  if (!policy) {
    return <p>Policy not found.</p>;
  }

  const handleUpdate = () => {
    navigate(`/policies/edit/${id}`);
  };

  const handleDelete = () => {
    if (!policy) return;
    setDialogConfig({
      title: "Confirm Deletion",
      description: `Are you sure you want to delete the policy ${policy.policyNumber}?`,
      options: {
        deleteText: "Deactivate",
        cancelText: "Cancel",
      },
      onConfirm: () => {
        dispatch(deletePolicyAsync(policy.id))
          .unwrap()
          .then(() => {
            setDialogOpen(false);
            setSuccessMessage(
              `Policy ${policy.policyNumber} has been successfully deleted.`
            );
            setSuccessDialogOpen(true);
            dispatch(getPolicyByIdAsync(policy.id.toString()));
          })
          .catch(() => {
            setDialogOpen(false);
            alert("Error occurred while deleting the policy.");
          });
      },
    });
    setDialogOpen(true);
  };

  const handleRestore = () => {
    if (!policy) return;
    setDialogConfig({
      title: "Confirm Restoration",
      description: `Are you sure you want to restore the policy ${policy.policyNumber}?`,
      options: {
        restoreText: "Restore",
        cancelText: "Cancel",
      },
      onConfirm: () => {
        dispatch(restorePolicyAsync(policy.id))
          .unwrap()
          .then(() => {
            setDialogOpen(false);
            setSuccessMessage(
              `Policy ${policy.policyNumber} has been successfully restored.`
            );
            setSuccessDialogOpen(true);
            dispatch(getPolicyByIdAsync(policy.id.toString()));
          })
          .catch(() => {
            setDialogOpen(false);
            alert("Error occurred while restoring the policy.");
          });
      },
    });
    setDialogOpen(true);
  };

  return (
    <div className="form-container">
      {/* Confirmation dialogs */}
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogConfig?.title ?? ""}
        description={dialogConfig?.description ?? ""}
        onConfirm={dialogConfig?.onConfirm ?? (() => { })}
        onCancel={() => setDialogOpen(false)}
        options={dialogConfig?.options ?? {}}
      />
      <ConfirmationDialog
        open={successDialogOpen}
        title="Successfully!"
        description={successMessage}
        onConfirm={() => setSuccessDialogOpen(false)}
        onCancel={() => setSuccessDialogOpen(false)}
        options={{ cancelText: "Close" }}
      />
      <h2 className="title">Policy Details</h2>
      <div className="view-container">
        <div className="view-container-child">
          <p><strong>Date Signed:</strong> {policy.dateSigned}</p>
          <p><strong>Expiring Date:</strong> {policy.expiringDate}</p>
          <p><strong>Money Received Date:</strong> {policy.moneyReceivedDate}</p>
          <p><strong>Amount:</strong> {policy.amount}</p>
          <p>
            <strong>Status:</strong>{" "}
            {policy.isDeleted ? (
              <>
                <ShieldMinus size={32} color="#ff0000" /> <span>DEACTIVATED</span>
              </>
            ) : (
              <>
                <ShieldCheck size={32} color="#008000" /> <span>ACTIVE</span>
              </>
            )}
          </p>
          <p><strong>Valid:</strong> {policy.valid ? "Yes" : "No"}</p>
          <p><strong>Can Add Claim:</strong> {policy.canAddClaim ? "Yes" : "No"}</p>

          {car ? (
            <div className="car-info">
              <h3>Car Information</h3>
              <p><strong>Year:</strong> {car.year}</p>
              <p><strong>Model:</strong> {car.modelId}</p>
              {car.image ? (
                <ProtectedImage
                  src={`${IMAGE_BASE_URL}/${car.image}`}
                  alt={`Car ${car.image}`}
                  style={{ maxWidth: "200px" }}
                />
              ) : (
                <p>No car image available</p>
              )}
            </div>
          ) : (
            <p>Loading car information...</p>
          )}
        </div>
      </div>
      <DetailPageButtons
        isDeleted={policy.isDeleted}
        handleDeactivate={handleDelete}
        handleRestore={handleRestore}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}