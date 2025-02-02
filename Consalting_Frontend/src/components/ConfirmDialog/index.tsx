import React from "react";
import "./ConfirmDialog.css";

interface ConfirmDialogProps {
  show: boolean;              // флаг для показа/скрытия диалога
  title?: string;             // заголовок диалога (необязательный)
  message: string;            // сообщение, которое нужно отобразить
  onConfirm: () => void;      // функция, вызываемая при подтверждении
  onCancel: () => void;       // функция, вызываемая при отмене
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  show,
  title = "Подтвердите действие",
  message,
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        {title && <h3 className="confirm-title">{title}</h3>}
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <button className="btn btn-confirm" onClick={onConfirm}>
            Подтвердить
          </button>
          <button className="btn btn-cancel" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 