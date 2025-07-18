import React from "react";
import "../styles/ConformationDialog.scss";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  options: {
    confirmText?: string;
    cancelText?: string;
    restoreText?: string;
    deleteText?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  description,
  options,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="buttons">
          <button className="cancel" onClick={onCancel}>
            {options.cancelText || "Cancel"}
          </button>
          {options.restoreText && (
            <button className="restore" onClick={onConfirm}>
              {options.restoreText}
            </button>
          )}
          {options.deleteText && (
            <button className="delete" onClick={onConfirm}>
              {options.deleteText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
